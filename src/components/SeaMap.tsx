import React, { useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { motion } from 'motion/react';
import {
  INDUSTRIAL_CENTERS,
  type IndustrialCenter,
} from '../data/presentationData';
import {
  createMapProjection,
  getSeaGeoFeatures,
  MAP_VIEW_SPECS,
  simplifySvgPath,
  type MapViewMode,
} from '../utils/seaMapGeometry';

interface SeaMapProps {
  mode: MapViewMode;
  activeCenterId?: string | null;
  activeCountryIso?: string | null;
  highlightedCenterIds?: string[];
  onSelectCenter?: (centerId: string) => void;
  showLeaderLines?: boolean;
  showCountryNames?: boolean;
  staggerMarkers?: boolean;
  className?: string;
}

const COUNTRY_NAME_COORDS: Array<{
  iso: string;
  label: string;
  coords: [number, number];
  region: 'mainland' | 'maritime';
}> = [
  { iso: '704', label: 'VIỆT NAM', coords: [108.4, 15.2], region: 'mainland' },
  { iso: '764', label: 'THÁI LAN', coords: [101.2, 15.6], region: 'mainland' },
  { iso: '418', label: 'LÀO', coords: [103.5, 19.3], region: 'mainland' },
  { iso: '116', label: 'CAMPUCHIA', coords: [104.9, 12.9], region: 'mainland' },
  { iso: '104', label: 'MYANMAR', coords: [96.6, 20.6], region: 'mainland' },
  { iso: '458', label: 'MALAYSIA', coords: [113.6, 3.0], region: 'maritime' },
  { iso: '360', label: 'INDONESIA', coords: [115.2, -2.1], region: 'maritime' },
  { iso: '608', label: 'PHILIPPINES', coords: [122.9, 11.2], region: 'maritime' },
  { iso: '626', label: 'ĐÔNG TIMOR', coords: [126.1, -9.8], region: 'maritime' },
];

export const SeaMap: React.FC<SeaMapProps> = ({
  mode,
  activeCenterId = null,
  activeCountryIso = null,
  highlightedCenterIds,
  onSelectCenter,
  showLeaderLines = true,
  showCountryNames = false,
  staggerMarkers = true,
  className = '',
}) => {
  const spec = MAP_VIEW_SPECS[mode];

  const { projection, landPaths, graticuleLines } = useMemo(() => {
    const proj = createMapProjection(mode);
    const pathGenerator = geoPath(proj);
    const features = getSeaGeoFeatures();

    const paths = features
      .map((item) => ({
        ...item,
        d: simplifySvgPath(pathGenerator(item.geojson) ?? '', 3.2),
      }))
      .filter((item) => item.d.length > 0);

    const lines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }> = [];
    for (let lon = 90; lon <= 140; lon += 10) {
      const p1 = proj([lon, -15]);
      const p2 = proj([lon, 28]);
      if (p1 && p2) {
        lines.push({ id: `lon-${lon}`, x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] });
      }
    }
    for (let lat = -10; lat <= 25; lat += 5) {
      const p1 = proj([85, lat]);
      const p2 = proj([145, lat]);
      if (p1 && p2) {
        lines.push({ id: `lat-${lat}`, x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] });
      }
    }

    return { projection: proj, landPaths: paths, graticuleLines: lines };
  }, [mode]);

  const visibleCenters: IndustrialCenter[] = useMemo(() => {
    if (mode === 'mainland') {
      return INDUSTRIAL_CENTERS.filter((c) => c.region === 'mainland');
    }
    if (mode === 'maritime') {
      return INDUSTRIAL_CENTERS.filter((c) => c.region === 'maritime');
    }
    return INDUSTRIAL_CENTERS;
  }, [mode]);

  const highlightSet = useMemo(
    () => (highlightedCenterIds ? new Set(highlightedCenterIds) : null),
    [highlightedCenterIds]
  );

  const activeCenter = useMemo(
    () => INDUSTRIAL_CENTERS.find((c) => c.id === activeCenterId) ?? null,
    [activeCenterId]
  );

  const seaTitlePos = projection([114.2, 14.2]);
  const hoangSaPos = projection([112.0, 16.5]);
  const truongSaPos = projection([114.8, 9.5]);

  return (
    <div
      data-testid={`sea-map-${mode}`}
      className={`relative h-full w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#EDF5FB] via-[#E8F1F8] to-[#DFECF6] ${className}`}
    >
      <svg
        viewBox={`0 0 ${spec.width} ${spec.height}`}
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", Arial, sans-serif' }}
        className="h-full w-full select-none"
        role="img"
        aria-label="Bản đồ phân bố các trung tâm công nghiệp khu vực Đông Nam Á"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id={`beacon-glow-${mode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D97736" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`teal-glow-${mode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0D7A7E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0D7A7E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle geographic graticule */}
        <g aria-hidden="true">
          {graticuleLines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#0F294A"
              strokeOpacity="0.055"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}
        </g>

        {/* Landmasses */}
        <g>
          {landPaths.map((land) => {
            const isFocusedRegion =
              mode === 'all'
                ? land.isSea
                : mode === 'mainland'
                  ? land.isMainland
                  : land.isMaritime;

            const isActiveCountry =
              (activeCountryIso !== null && activeCountryIso === land.iso) ||
              (activeCenter !== null && activeCenter.countryIso === land.iso);

            let fill = '#E9EFF5';
            let stroke = '#CEDBE6';
            let strokeWidth = 0.7;

            if (isActiveCountry) {
              fill = '#B9DCE2';
              stroke = '#0D7A7E';
              strokeWidth = 1.45;
            } else if (isFocusedRegion) {
              fill = '#D0E2EE';
              stroke = '#769CB8';
              strokeWidth = 1.05;
            } else if (land.isSea) {
              fill = '#E1EBF3';
              stroke = '#B2C8DA';
              strokeWidth = 0.85;
            }

            return (
              <path
                key={land.key}
                d={land.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                className="transition-colors duration-300"
              />
            );
          })}
        </g>

        {/* Biển Đông & Vietnamese archipelagos */}
        {seaTitlePos && mode !== 'maritime' && (
          <text
            x={seaTitlePos[0]}
            y={seaTitlePos[1]}
            textAnchor="middle"
            className="pointer-events-none fill-[#0F294A]/30 text-[12px] font-semibold italic tracking-[0.22em]"
          >
            BIỂN ĐÔNG
          </text>
        )}

        {hoangSaPos &&
          hoangSaPos[0] > 24 &&
          hoangSaPos[0] < spec.width - 70 &&
          hoangSaPos[1] > 20 &&
          hoangSaPos[1] < spec.height - 20 && (
            <g className="pointer-events-none" aria-hidden="true">
              <circle cx={hoangSaPos[0]} cy={hoangSaPos[1]} r="1.6" fill="#0F294A" fillOpacity="0.45" />
              <circle cx={hoangSaPos[0] + 4} cy={hoangSaPos[1] + 2} r="1.3" fill="#0F294A" fillOpacity="0.45" />
              <text
                x={hoangSaPos[0] + 8}
                y={hoangSaPos[1] + 3}
                className="fill-[#0F294A]/45 text-[9.5px] font-medium italic"
              >
                QĐ. Hoàng Sa
              </text>
            </g>
          )}

        {truongSaPos &&
          truongSaPos[0] > 24 &&
          truongSaPos[0] < spec.width - 70 &&
          truongSaPos[1] > 20 &&
          truongSaPos[1] < spec.height - 20 && (
            <g className="pointer-events-none" aria-hidden="true">
              <circle cx={truongSaPos[0]} cy={truongSaPos[1]} r="1.6" fill="#0F294A" fillOpacity="0.45" />
              <circle cx={truongSaPos[0] + 4} cy={truongSaPos[1] + 2} r="1.3" fill="#0F294A" fillOpacity="0.45" />
              <text
                x={truongSaPos[0] + 8}
                y={truongSaPos[1] + 3}
                className="fill-[#0F294A]/45 text-[9.5px] font-medium italic"
              >
                QĐ. Trường Sa
              </text>
            </g>
          )}

        {/* Country names (subtle cartographic labels) */}
        {showCountryNames &&
          COUNTRY_NAME_COORDS.filter((c) => mode === 'all' || c.region === mode).map((country) => {
            const pt = projection(country.coords);
            if (!pt) return null;
            return (
              <text
                key={country.iso}
                x={pt[0]}
                y={pt[1]}
                textAnchor="middle"
                className="pointer-events-none fill-[#0F294A]/42 text-[10px] font-semibold tracking-[0.14em]"
              >
                {country.label}
              </text>
            );
          })}

        {/* Industrial center markers + thin leader lines + callout labels */}
        <g>
          {visibleCenters.map((center, idx) => {
            const pt = projection(center.coordinates);
            if (!pt) return null;

            const isActive = activeCenterId === center.id;
            const isHighlighted = highlightSet ? highlightSet.has(center.id) : true;
            const isProminent = isActive || (highlightSet ? isHighlighted : Boolean(center.featured));

            const [dx, dy] = mode === 'all' ? center.allOffset : center.regionOffset;
            const labelText = center.shortCity ?? center.city;
            const estWidth = Math.max(84, labelText.length * 8.6 + 24);
            const lx = Math.max(estWidth / 2 + 6, Math.min(spec.width - estWidth / 2 - 6, pt[0] + dx));
            const ly = Math.max(18, Math.min(spec.height - 18, pt[1] + dy));

            const pinDelay = staggerMarkers ? 0.18 + idx * 0.09 : 0;
            const labelDelay = staggerMarkers ? 0.42 + idx * 0.09 : 0;

            return (
              <g
                key={center.id}
                className={
                  onSelectCenter
                    ? 'cursor-pointer outline-none focus:outline-none'
                    : undefined
                }
                onClick={onSelectCenter ? () => onSelectCenter(center.id) : undefined}
                onKeyDown={
                  onSelectCenter
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectCenter(center.id);
                        }
                      }
                    : undefined
                }
                role={onSelectCenter ? 'button' : undefined}
                tabIndex={onSelectCenter ? 0 : undefined}
                aria-label={`${center.city}, ${center.country}: ${center.industries.join(', ')}`}
              >
                {/* Thin connecting leader line */}
                {showLeaderLines && (
                  <motion.line
                    x1={pt[0]}
                    y1={pt[1]}
                    x2={lx}
                    y2={ly}
                    stroke={isActive ? '#D97736' : isProminent ? '#0D7A7E' : '#64748B'}
                    strokeWidth={isActive ? 1.6 : 1.05}
                    strokeOpacity={isActive ? 0.95 : isHighlighted ? 0.65 : 0.35}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: labelDelay * 0.7 }}
                  />
                )}

                {/* Soft glowing halo */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.38, delay: pinDelay }}
                >
                  {(isActive || isProminent) && (
                    <>
                      <circle
                        cx={pt[0]}
                        cy={pt[1]}
                        r={isActive ? 16 : 11}
                        fill={
                          isActive
                            ? `url(#beacon-glow-${mode})`
                            : `url(#teal-glow-${mode})`
                        }
                      />
                      <circle
                        cx={pt[0]}
                        cy={pt[1]}
                        r={isActive ? 10.5 : 8}
                        fill="none"
                        stroke={isActive ? '#D97736' : '#0D7A7E'}
                        strokeOpacity={isActive ? 0.5 : 0.32}
                        strokeWidth={1.2}
                      />
                    </>
                  )}
                  <circle
                    cx={pt[0]}
                    cy={pt[1]}
                    r={isActive ? 6.5 : isProminent ? 5.2 : 4.2}
                    fill={isActive ? '#D97736' : isHighlighted ? '#0D7A7E' : '#475569'}
                    stroke="#FFFFFF"
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                </motion.g>

                {/* Crisp city label */}
                {showLeaderLines && (
                  <motion.g
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: isHighlighted || isActive ? 1 : 0.62, y: 0 }}
                    transition={{ duration: 0.35, delay: labelDelay }}
                  >
                    <rect
                      x={lx - estWidth / 2}
                      y={ly - 13}
                      width={estWidth}
                      height={26}
                      rx={6.5}
                      fill={isActive ? '#0F294A' : 'rgba(255,255,255,0.96)'}
                      stroke={isActive ? '#D97736' : isProminent ? 'rgba(13,122,126,0.4)' : 'rgba(15,41,74,0.2)'}
                      strokeWidth={isActive ? 1.6 : 1.05}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12.8"
                      fontWeight="600"
                      className={isActive ? 'fill-white' : 'fill-[#0F294A]'}
                    >
                      {labelText}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Subtle single-line cartographic attribution over open ocean away from all city labels */}
      <div
        className={`pointer-events-none absolute whitespace-nowrap rounded bg-[#EDF5FB]/92 px-2 py-0.5 text-[10px] font-medium text-[#0F294A]/70 sm:text-[11px] ${
          mode === 'mainland' ? 'bottom-1.5 right-2' : 'right-2 top-1.5'
        }`}
      >
        <span>Hình 12.3 · Công nghiệp Đông Nam Á</span>
      </div>
    </div>
  );
};
