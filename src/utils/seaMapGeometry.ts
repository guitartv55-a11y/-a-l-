import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import worldAtlasRaw from 'world-atlas/countries-50m.json';
import { INDUSTRIAL_CENTERS, type IndustrialCenter } from '../data/presentationData';

export type MapViewMode = 'all' | 'mainland' | 'maritime';

export const SEA_MAINLAND_ISOS = new Set(['704', '764', '418', '116', '104']);
export const SEA_MARITIME_ISOS = new Set(['458', '702', '360', '608', '626', '096']);
export const ALL_SEA_ISOS = new Set([...SEA_MAINLAND_ISOS, ...SEA_MARITIME_ISOS]);
export const NEIGHBOR_ISOS = new Set(['156', '356', '050', '598', '036', '158', '144']);

export interface MapViewSpec {
  width: number;
  height: number;
  center: [number, number];
  scale: number;
  translate: [number, number];
}

export const MAP_VIEW_SPECS: Record<MapViewMode, MapViewSpec> = {
  all: {
    width: 860,
    height: 620,
    center: [113.8, 6.4],
    scale: 1020,
    translate: [430, 315],
  },
  mainland: {
    width: 640,
    height: 660,
    center: [101.8, 16.0],
    scale: 1920,
    translate: [320, 330],
  },
  maritime: {
    width: 860,
    height: 540,
    center: [114.2, 2.2],
    scale: 1140,
    translate: [430, 275],
  },
};

export interface GeoCountryFeature {
  key: string;
  iso: string;
  name: string;
  isSea: boolean;
  isMainland: boolean;
  isMaritime: boolean;
  geojson: Feature<Geometry>;
}

let cachedFeatures: GeoCountryFeature[] | null = null;

export function getSeaGeoFeatures(): GeoCountryFeature[] {
  if (cachedFeatures) return cachedFeatures;

  const topology = worldAtlasRaw as unknown as Topology<{
    countries: GeometryCollection<{ name?: string }>;
  }>;
  const fc = feature(
    topology,
    topology.objects.countries
  ) as unknown as FeatureCollection<Geometry, { name?: string }>;

  cachedFeatures = fc.features
    .map((f, index) => {
      const iso = String(f.id ?? '').padStart(3, '0');
      const isMainland = SEA_MAINLAND_ISOS.has(iso);
      const isMaritime = SEA_MARITIME_ISOS.has(iso);
      const isSea = isMainland || isMaritime;
      return {
        key: `${iso}-${index}`,
        iso,
        name: f.properties?.name ?? '',
        isSea,
        isMainland,
        isMaritime,
        geojson: f,
      };
    })
    .filter((item) => item.isSea || NEIGHBOR_ISOS.has(item.iso));

  return cachedFeatures;
}

export function createMapProjection(mode: MapViewMode) {
  const spec = MAP_VIEW_SPECS[mode];
  return geoMercator()
    .center(spec.center)
    .scale(spec.scale)
    .translate(spec.translate)
    .clipExtent([
      [-16, -16],
      [spec.width + 16, spec.height + 16],
    ]);
}

/**
 * Decimates sub-pixel segments from projected SVG path strings so Natural Earth 50m
 * coastlines stay crisp at 1440px while cutting SVG DOM path complexity by ~85%.
 */
export function simplifySvgPath(d: string, minDistSq: number = 2.6): string {
  if (!d) return '';
  const tokens = d.match(/[MLZ]|-?\d+(?:\.\d+)?/g);
  if (!tokens) return '';

  const out: string[] = [];
  let i = 0;
  let lastX = NaN;
  let lastY = NaN;

  while (i < tokens.length) {
    const cmd = tokens[i];
    if (cmd === 'M') {
      const x = Math.round(Number(tokens[i + 1]) * 10) / 10;
      const y = Math.round(Number(tokens[i + 2]) * 10) / 10;
      out.push(`M${x},${y}`);
      lastX = x;
      lastY = y;
      i += 3;
    } else if (cmd === 'L') {
      const x = Math.round(Number(tokens[i + 1]) * 10) / 10;
      const y = Math.round(Number(tokens[i + 2]) * 10) / 10;
      const dx = x - lastX;
      const dy = y - lastY;
      if (dx * dx + dy * dy >= minDistSq) {
        out.push(`L${x},${y}`);
        lastX = x;
        lastY = y;
      }
      i += 3;
    } else if (cmd === 'Z') {
      out.push('Z');
      i += 1;
    } else {
      i += 1;
    }
  }

  return out.join('');
}

export interface PptxMapHotspot {
  center: IndustrialCenter;
  pinX: number;
  pinY: number;
  labelX: number;
  labelY: number;
  labelW: number;
  labelH: number;
}

/**
 * Computes exact PowerPoint inch coordinates for each industrial center pin and
 * callout label inside a `contain`-fitted map frame (boxX, boxY, boxW, boxH).
 */
export function computePptxMapHotspots(
  mode: MapViewMode,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
): PptxMapHotspot[] {
  const spec = MAP_VIEW_SPECS[mode];
  const projection = createMapProjection(mode);

  // Compute exact rendered sub-rect inside box when using sizing: { type: 'contain' }
  const imgAspect = spec.width / spec.height;
  const boxAspect = boxW / boxH;
  let drawW = boxW;
  let drawH = boxH;
  let drawX = boxX;
  let drawY = boxY;

  if (imgAspect > boxAspect) {
    drawH = boxW / imgAspect;
    drawY = boxY + (boxH - drawH) / 2;
  } else {
    drawW = boxH * imgAspect;
    drawX = boxX + (boxW - drawW) / 2;
  }

  const scaleX = drawW / spec.width;
  const scaleY = drawH / spec.height;

  const visibleCenters: IndustrialCenter[] = INDUSTRIAL_CENTERS.filter((c) => {
    if (mode === 'mainland') return c.region === 'mainland';
    if (mode === 'maritime') return c.region === 'maritime';
    return true;
  });

  const hotspots: PptxMapHotspot[] = [];
  for (const center of visibleCenters) {
    const pt = projection(center.coordinates);
    if (!pt) continue;
    const [dx, dy] = mode === 'all' ? center.allOffset : center.regionOffset;
    const lx = Math.max(76, Math.min(spec.width - 76, pt[0] + dx));
    const ly = Math.max(24, Math.min(spec.height - 22, pt[1] + dy));

    const labelText = center.shortCity ?? center.city;
    const pillPxW = Math.max(82, labelText.length * 8.4 + 22);
    const pillPxH = 26;

    const labelW = Math.max(0.74, pillPxW * scaleX);
    const labelH = Math.max(0.24, pillPxH * scaleY);

    const rawLabelX = drawX + lx * scaleX - labelW / 2;
    const rawLabelY = drawY + ly * scaleY - labelH / 2;

    hotspots.push({
      center,
      pinX: drawX + pt[0] * scaleX,
      pinY: drawY + pt[1] * scaleY,
      labelX: Math.max(drawX + 0.04, Math.min(drawX + drawW - labelW - 0.04, rawLabelX)),
      labelY: Math.max(drawY + 0.04, Math.min(drawY + drawH - labelH - 0.04, rawLabelY)),
      labelW,
      labelH,
    });
  }

  return hotspots;
}

export interface RenderSeaMapOptions {
  /** Omit baked-in city text pills when PowerPoint adds native clickable hyperlink buttons on top */
  omitLabels?: boolean;
  /** Highlight a single country's landmass in accent teal (used on country detail slides) */
  activeCountryIso?: string;
}

/**
 * Renders a crisp high-resolution PNG data URL of the Southeast Asia map
 * using the exact Natural Earth 50m TopoJSON and d3-geo Mercator projection.
 * Used when exporting PowerPoint slides so Slides 2–6 and detail slides embed real vector-accurate maps.
 */
export function renderSeaMapToDataUrl(
  mode: MapViewMode,
  highlightCenterIds?: string[],
  options: RenderSeaMapOptions = {}
): string {
  const { omitLabels = false, activeCountryIso } = options;
  const spec = MAP_VIEW_SPECS[mode];
  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = spec.width * dpr;
  canvas.height = spec.height * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(dpr, dpr);

  // Subtle ocean backdrop gradient
  const bgGrad = ctx.createLinearGradient(0, 0, spec.width, spec.height);
  bgGrad.addColorStop(0, '#EDF4FA');
  bgGrad.addColorStop(1, '#E1EDF7');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, spec.width, spec.height);

  // Subtle graticule grid
  const projection = createMapProjection(mode);
  const pathGen = geoPath(projection, ctx);

  ctx.strokeStyle = 'rgba(15, 41, 74, 0.05)';
  ctx.lineWidth = 1;
  for (let lon = 90; lon <= 140; lon += 10) {
    const p1 = projection([lon, -15]);
    const p2 = projection([lon, 28]);
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    }
  }
  for (let lat = -10; lat <= 25; lat += 5) {
    const p1 = projection([85, lat]);
    const p2 = projection([145, lat]);
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    }
  }

  // Draw landmasses
  const features = getSeaGeoFeatures();
  for (const item of features) {
    ctx.beginPath();
    pathGen(item.geojson);

    const isFocusedRegion =
      mode === 'all'
        ? item.isSea
        : mode === 'mainland'
          ? item.isMainland
          : item.isMaritime;

    const isActiveCountry = Boolean(activeCountryIso && item.iso === activeCountryIso);

    if (isActiveCountry) {
      ctx.fillStyle = '#9ED4DC';
      ctx.strokeStyle = '#0D7A7E';
      ctx.lineWidth = 1.8;
    } else if (isFocusedRegion) {
      ctx.fillStyle = '#CFE2EE';
      ctx.strokeStyle = '#6E95B3';
      ctx.lineWidth = 1.1;
    } else if (item.isSea) {
      ctx.fillStyle = '#E2ECF3';
      ctx.strokeStyle = '#AEC5D8';
      ctx.lineWidth = 0.85;
    } else {
      ctx.fillStyle = '#EBF0F5';
      ctx.strokeStyle = '#D1DDE8';
      ctx.lineWidth = 0.7;
    }
    ctx.fill();
    ctx.stroke();
  }

  // Biển Đông & Vietnamese archipelagos markers
  const seaLabelPos = projection([113.8, 14.3]);
  if (seaLabelPos && mode !== 'maritime') {
    ctx.font = 'italic 600 13px Arial, sans-serif';
    ctx.fillStyle = 'rgba(15, 41, 74, 0.34)';
    ctx.textAlign = 'center';
    ctx.fillText('BIỂN ĐÔNG', seaLabelPos[0], seaLabelPos[1]);
  }

  const archipelagos: Array<{ name: string; coords: [number, number] }> = [
    { name: 'QĐ. Hoàng Sa', coords: [112.0, 16.5] },
    { name: 'QĐ. Trường Sa', coords: [114.2, 10.0] },
  ];
  for (const arch of archipelagos) {
    const pt = projection(arch.coords);
    if (pt && pt[0] > 20 && pt[0] < spec.width - 20 && pt[1] > 20 && pt[1] < spec.height - 20) {
      ctx.fillStyle = 'rgba(15, 41, 74, 0.45)';
      ctx.beginPath();
      ctx.arc(pt[0] - 2, pt[1], 1.5, 0, Math.PI * 2);
      ctx.arc(pt[0] + 2, pt[1] + 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'italic 500 9.5px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(arch.name, pt[0] + 6, pt[1] + 3);
    }
  }

  // Industrial centers
  const visibleCenters: IndustrialCenter[] = INDUSTRIAL_CENTERS.filter((c) => {
    if (mode === 'mainland') return c.region === 'mainland';
    if (mode === 'maritime') return c.region === 'maritime';
    return true;
  });

  const highlightSet = highlightCenterIds ? new Set(highlightCenterIds) : null;

  for (const center of visibleCenters) {
    const pt = projection(center.coordinates);
    if (!pt) continue;
    const isHighlighted = highlightSet ? highlightSet.has(center.id) : true;
    const [dx, dy] = mode === 'all' ? center.allOffset : center.regionOffset;
    const lx = Math.max(76, Math.min(spec.width - 76, pt[0] + dx));
    const ly = Math.max(24, Math.min(spec.height - 22, pt[1] + dy));

    // Thin leader line
    ctx.strokeStyle = isHighlighted ? 'rgba(13, 122, 126, 0.65)' : 'rgba(15, 41, 74, 0.35)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(pt[0], pt[1]);
    ctx.lineTo(lx, ly);
    ctx.stroke();

    // Glowing halo
    ctx.fillStyle = isHighlighted ? 'rgba(217, 119, 54, 0.28)' : 'rgba(13, 122, 126, 0.2)';
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], isHighlighted ? 12 : 7, 0, Math.PI * 2);
    ctx.fill();

    // Core dot
    ctx.fillStyle = isHighlighted ? '#D97736' : '#0D7A7E';
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], isHighlighted ? 5.6 : 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    if (!omitLabels) {
      // Label pill backdrop
      const labelText = center.shortCity ?? center.city;
      ctx.font = '600 12px Arial, sans-serif';
      const textWidth = ctx.measureText(labelText).width;
      const padX = 8;
      const boxW = textWidth + padX * 2;
      const boxH = 22;
      const boxX = lx - boxW / 2;
      const boxY = ly - boxH / 2;

      ctx.fillStyle = isHighlighted ? 'rgba(15, 41, 74, 0.92)' : 'rgba(255, 255, 255, 0.94)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 5);
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#0F294A' : 'rgba(15, 41, 74, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isHighlighted ? '#FFFFFF' : '#0F294A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, lx, ly + 0.5);
    }
  }

  return canvas.toDataURL('image/png');
}
