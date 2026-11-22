import PptxGenJS from 'pptxgenjs';
import {
  getCenterById,
  getPerCountrySectorCharts,
  KEY_SUMMARY_CENTER_IDS,
  MAINLAND_COUNTRIES,
  MARITIME_COUNTRIES,
  OVERVIEW_BULLETS,
  SUMMARY_POINTS,
  type ImageKey,
} from '../data/presentationData';
import { MEDIA_ASSETS } from '../data/mediaAssets';
import {
  computePptxMapHotspots,
  renderSeaMapToDataUrl,
  type MapViewMode,
} from './seaMapGeometry';
import {
  renderPerCountryPiesToDataUrl,
  renderSingleCountryPieToDataUrl,
} from '../components/CountryPieChart';

const COLORS = {
  bg: 'F6F8FB',
  white: 'FFFFFF',
  navy: '0F294A',
  navySoft: '1D3B63',
  teal: '0D7A7E',
  tealLight: 'E6F4F4',
  amber: 'D97736',
  slateText: '334155',
  slateMuted: '64748B',
  border: 'D8E2EC',
};

const FONT = 'Arial';

async function imageUrlToDataUri(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read image blob'));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function addSlideHeader(
  slide: PptxGenJS.Slide,
  slideBadge: string,
  kicker: string,
  title: string
) {
  slide.background = { color: COLORS.bg };

  // Slim top accent bar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.08,
    fill: { color: COLORS.teal },
  });

  // Kicker + Slide badge
  slide.addText(kicker, {
    x: 0.6,
    y: 0.24,
    w: 9.8,
    h: 0.28,
    fontFace: FONT,
    fontSize: 10.5,
    bold: true,
    color: COLORS.teal,
  });

  slide.addText(slideBadge, {
    x: 10.9,
    y: 0.22,
    w: 1.833,
    h: 0.3,
    fontFace: FONT,
    fontSize: 10.5,
    bold: true,
    color: COLORS.slateMuted,
    align: 'right',
  });

  // Main slide title
  slide.addText(title, {
    x: 0.6,
    y: 0.52,
    w: 12.1,
    h: 0.5,
    fontFace: FONT,
    fontSize: 22.5,
    bold: true,
    color: COLORS.navy,
  });

  // Hairline divider
  slide.addShape('line', {
    x: 0.6,
    y: 1.09,
    w: 12.133,
    h: 0,
    line: { color: COLORS.border, width: 1 },
  });
}

/**
 * Adds a high-resolution vector map image AND places native clickable PowerPoint
 * hyperlink pills + pin hit-targets over EVERY industrial center so tapping any
 * city/country in PowerPoint / Google Slides jumps directly to its detail slide.
 */
function addInteractiveMapWithHotspots(
  slide: PptxGenJS.Slide,
  mode: MapViewMode,
  mapDataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number,
  countrySlideMap: Map<string, number>,
  highlightedCenterIds?: string[]
) {
  if (mapDataUrl) {
    slide.addImage({
      data: mapDataUrl,
      x,
      y,
      w,
      h,
      sizing: { type: 'contain', w, h },
    });
  }

  const highlightSet = highlightedCenterIds ? new Set(highlightedCenterIds) : null;
  const hotspots = computePptxMapHotspots(mode, x, y, w, h);

  for (const spot of hotspots) {
    const targetSlide = countrySlideMap.get(spot.center.countryIso);
    if (!targetSlide) continue;

    const isHighlighted = highlightSet ? highlightSet.has(spot.center.id) : Boolean(spot.center.featured);
    const labelText = spot.center.shortCity ?? spot.center.city;
    const tooltip = `Nhấp để xem chi tiết công nghiệp ${spot.center.country} (${spot.center.city})`;

    // Clickable invisible pin hit-target (0.28 x 0.28 in) directly over the dot
    slide.addShape('ellipse', {
      x: spot.pinX - 0.14,
      y: spot.pinY - 0.14,
      w: 0.28,
      h: 0.28,
      fill: { color: COLORS.teal, transparency: 98 },
      line: { color: COLORS.teal, transparency: 98, width: 0 },
      hyperlink: { slide: targetSlide, tooltip },
    });

    // Native PowerPoint clickable city callout button
    slide.addText(labelText, {
      shape: 'roundRect',
      x: spot.labelX,
      y: spot.labelY,
      w: spot.labelW,
      h: spot.labelH,
      rectRadius: 0.18,
      fill: { color: isHighlighted ? COLORS.navy : COLORS.white },
      line: {
        color: isHighlighted ? COLORS.amber : COLORS.teal,
        width: isHighlighted ? 1.2 : 0.9,
      },
      fontFace: FONT,
      fontSize: 8.8,
      bold: true,
      color: isHighlighted ? COLORS.white : COLORS.navy,
      align: 'center',
      valign: 'middle',
      margin: 0,
      hyperlink: { slide: targetSlide, tooltip },
    });
  }
}

export async function exportPresentationToPptx(): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in (16:9)
  pptx.author = 'Địa lí 11 – Kết nối tri thức';
  pptx.title = 'Công nghiệp khu vực Đông Nam Á';
  pptx.subject = 'Địa lí 11 – SGK trang 57, Hình 12.3';

  // Load all 9 real industrial photographs in parallel
  const imageKeys: ImageKey[] = [
    'hero',
    'electronics',
    'automotive',
    'textile',
    'food',
    'petrochemical',
    'shipbuilding',
    'wood',
    'mining',
  ];

  const loadedEntries = await Promise.all(
    imageKeys.map(async (key) => [key, await imageUrlToDataUri(MEDIA_ASSETS[key].src)] as const)
  );
  const images = Object.fromEntries(loadedEntries) as Record<ImageKey, string | null>;

  // Country detail slides live at Slides 7..16 (1-indexed for pptxgenjs internal slide links)
  const countryCharts = getPerCountrySectorCharts();
  const countrySlideMap = new Map<string, number>();
  countryCharts.forEach((chart, idx) => {
    countrySlideMap.set(chart.countryIso, 7 + idx);
  });

  // Render crisp base maps (omit baked labels so native clickable hyperlink pills sit cleanly on top)
  const mapAllBase = renderSeaMapToDataUrl('all', undefined, { omitLabels: true });
  const mapMainlandBase = renderSeaMapToDataUrl('mainland', undefined, { omitLabels: true });
  const mapMaritimeBase = renderSeaMapToDataUrl(
    'maritime',
    ['singapore', 'jakarta', 'kuala-lumpur'],
    { omitLabels: true }
  );
  const mapSummaryBase = renderSeaMapToDataUrl('all', KEY_SUMMARY_CENTER_IDS, {
    omitLabels: true,
  });
  const perCountryPiesImg = renderPerCountryPiesToDataUrl();

  // =========================================================================
  // SLIDE 1 – GIỚI THIỆU CHỦ ĐỀ
  // =========================================================================
  const s1 = pptx.addSlide();
  s1.background = { color: COLORS.navy };

  if (images.hero) {
    s1.addImage({
      data: images.hero,
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
      sizing: { type: 'cover', w: 13.333, h: 7.5 },
    });
  }

  s1.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: COLORS.navy, transparency: 38 },
  });

  s1.addShape('rect', {
    x: 0.75,
    y: 1.55,
    w: 7.8,
    h: 4.35,
    fill: { color: '0B1E38', transparency: 24 },
    line: { color: 'FFFFFF', transparency: 78, width: 1 },
    rectRadius: 0.12,
  });

  s1.addText('ĐỊA LÍ 11 – KẾT NỐI TRI THỨC  ·  SGK TRANG 57, HÌNH 12.3', {
    x: 1.1,
    y: 1.9,
    w: 7.1,
    h: 0.35,
    fontFace: FONT,
    fontSize: 11,
    bold: true,
    color: '7CE3E6',
  });

  s1.addText('CÔNG NGHIỆP\nKHU VỰC ĐÔNG NAM Á', {
    x: 1.1,
    y: 2.38,
    w: 7.1,
    h: 1.8,
    fontFace: FONT,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    breakLine: true,
  });

  s1.addText('Đặc điểm phân bố và các trung tâm công nghiệp chính.', {
    x: 1.1,
    y: 4.35,
    w: 6.8,
    h: 0.6,
    fontFace: FONT,
    fontSize: 16,
    color: 'E2ECF5',
  });

  if (images.electronics) {
    s1.addImage({
      data: images.electronics,
      x: 9.0,
      y: 1.55,
      w: 3.6,
      h: 2.05,
      sizing: { type: 'cover', w: 3.6, h: 2.05 },
      rounding: true,
    });
  }
  if (images.automotive) {
    s1.addImage({
      data: images.automotive,
      x: 9.0,
      y: 3.85,
      w: 3.6,
      h: 2.05,
      sizing: { type: 'cover', w: 3.6, h: 2.05 },
      rounding: true,
    });
  }

  // =========================================================================
  // SLIDE 2 – BỨC TRANH CHUNG VỀ CÔNG NGHIỆP ĐÔNG NAM Á (Bản đồ tương tác)
  // =========================================================================
  const s2 = pptx.addSlide();
  addSlideHeader(
    s2,
    '02/06',
    'BỨC TRANH CHUNG  ·  SGK TRANG 57, HÌNH 12.3',
    'MẠNG LƯỚI CÁC TRUNG TÂM CÔNG NGHIỆP'
  );

  // Top 3 compact SGK bullets
  OVERVIEW_BULLETS.forEach((bullet, idx) => {
    const xPos = 0.6 + idx * 4.1;
    s2.addShape('roundRect', {
      x: xPos,
      y: 1.24,
      w: 3.92,
      h: 0.88,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    s2.addText(`0${idx + 1}`, {
      x: xPos + 0.14,
      y: 1.33,
      w: 0.38,
      h: 0.25,
      fontFace: FONT,
      fontSize: 10,
      bold: true,
      color: COLORS.teal,
    });
    s2.addText(bullet, {
      x: xPos + 0.52,
      y: 1.31,
      w: 3.3,
      h: 0.74,
      fontFace: FONT,
      fontSize: 9,
      color: COLORS.slateText,
      valign: 'top',
    });
  });

  // Left: Interactive Southeast Asia Map (7/12 width) with clickable city hyperlinks
  addInteractiveMapWithHotspots(
    s2,
    'all',
    mapAllBase,
    0.6,
    2.26,
    6.75,
    4.62,
    countrySlideMap
  );

  s2.addText('Mẹo trình chiếu: Nhấp vào tên trung tâm trên bản đồ để mở trang chi tiết quốc gia', {
    x: 0.6,
    y: 6.95,
    w: 6.75,
    h: 0.26,
    fontFace: FONT,
    fontSize: 9,
    italic: true,
    color: COLORS.teal,
  });

  // Right: 4 crisp industry showcase photographs (2x2 grid)
  const s2Photos: Array<{ key: ImageKey; label: string }> = [
    { key: 'electronics', label: 'Điện tử - tin học' },
    { key: 'automotive', label: 'Sản xuất ô tô & cơ khí' },
    { key: 'textile', label: 'Dệt may' },
    { key: 'petrochemical', label: 'Hóa chất, hóa dầu & đóng tàu' },
  ];
  s2Photos.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 7.55 + col * 2.66;
    const yPos = 2.26 + row * 2.38;
    const imgData = images[item.key];
    if (imgData) {
      s2.addImage({
        data: imgData,
        x: xPos,
        y: yPos,
        w: 2.52,
        h: 1.9,
        sizing: { type: 'cover', w: 2.52, h: 1.9 },
        rounding: true,
      });
    }
    s2.addText(item.label, {
      x: xPos,
      y: yPos + 1.94,
      w: 2.52,
      h: 0.3,
      fontFace: FONT,
      fontSize: 9.5,
      bold: true,
      color: COLORS.navy,
      align: 'center',
    });
  });

  // =========================================================================
  // SLIDE 3 – CÔNG NGHIỆP CÁC NƯỚC ĐÔNG NAM Á LỤC ĐỊA (Bản đồ & thẻ tương tác)
  // =========================================================================
  const s3 = pptx.addSlide();
  addSlideHeader(
    s3,
    '03/06',
    'ĐÔNG NAM Á LỤC ĐỊA  ·  5 QUỐC GIA, 6 TRUNG TÂM',
    'CÔNG NGHIỆP CÁC NƯỚC ĐÔNG NAM Á LỤC ĐỊA'
  );

  // Left: Interactive Mainland SEA Map
  addInteractiveMapWithHotspots(
    s3,
    'mainland',
    mapMainlandBase,
    0.6,
    1.26,
    5.15,
    5.65,
    countrySlideMap
  );

  s3.addText('Nhấp vào thành phố trên bản đồ hoặc thẻ quốc gia bên phải để xem chi tiết', {
    x: 0.6,
    y: 6.96,
    w: 5.5,
    h: 0.25,
    fontFace: FONT,
    fontSize: 8.8,
    italic: true,
    color: COLORS.teal,
  });

  // Middle: 5 Clickable Mainland Country Cards
  let s3Y = 1.26;
  MAINLAND_COUNTRIES.forEach((group) => {
    const centers = group.centerIds
      .map((id) => getCenterById(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    const cardH = centers.length > 1 ? 1.56 : 0.94;
    const targetSlide = countrySlideMap.get(group.countryIso);
    const linkOpts = targetSlide
      ? { hyperlink: { slide: targetSlide, tooltip: `Xem chi tiết ${group.country}` } }
      : {};

    s3.addShape('roundRect', {
      x: 5.95,
      y: s3Y,
      w: 4.65,
      h: cardH,
      fill: { color: COLORS.white },
      line: { color: COLORS.teal, width: 1 },
      rectRadius: 0.07,
      ...linkOpts,
    });

    s3.addText(`${group.order}. ${group.country}  ›`, {
      x: 6.12,
      y: s3Y + 0.08,
      w: 4.3,
      h: 0.28,
      fontFace: FONT,
      fontSize: 12,
      bold: true,
      color: COLORS.navy,
      ...linkOpts,
    });

    centers.forEach((center, ci) => {
      s3.addText(
        [
          { text: `${center.city}: `, options: { bold: true, color: COLORS.teal } },
          { text: `${center.industries.join(', ')}.`, options: { color: COLORS.slateText } },
        ],
        {
          x: 6.12,
          y: s3Y + 0.38 + ci * 0.54,
          w: 4.35,
          h: 0.52,
          fontFace: FONT,
          fontSize: 9.5,
          valign: 'top',
          ...linkOpts,
        }
      );
    });

    s3Y += cardH + 0.1;
  });

  // Far right: 4 Mainland industry thumbnails
  const s3Photos: Array<{ key: ImageKey; label: string }> = [
    { key: 'electronics', label: 'Điện tử' },
    { key: 'automotive', label: 'Ô tô – cơ khí' },
    { key: 'textile', label: 'Dệt may' },
    { key: 'wood', label: 'Lâm sản & thực phẩm' },
  ];
  s3Photos.forEach((item, idx) => {
    const data = images[item.key];
    const yPos = 1.26 + idx * 1.44;
    if (data) {
      s3.addImage({
        data,
        x: 10.8,
        y: yPos,
        w: 1.95,
        h: 1.14,
        sizing: { type: 'cover', w: 1.95, h: 1.14 },
        rounding: true,
      });
    }
    s3.addText(item.label, {
      x: 10.8,
      y: yPos + 1.15,
      w: 1.95,
      h: 0.22,
      fontFace: FONT,
      fontSize: 8.5,
      bold: true,
      color: COLORS.navy,
      align: 'center',
    });
  });

  // =========================================================================
  // SLIDE 4 – ĐÔNG NAM Á HẢI ĐẢO (Bản đồ & thẻ tương tác)
  // =========================================================================
  const s4 = pptx.addSlide();
  addSlideHeader(
    s4,
    '04/06',
    'ĐÔNG NAM Á HẢI ĐẢO  ·  5 QUỐC GIA, 5 TRUNG TÂM',
    'CÔNG NGHIỆP TẠI CÁC QUỐC GIA HẢI ĐẢO'
  );

  // Left: Interactive Maritime SEA Map
  addInteractiveMapWithHotspots(
    s4,
    'maritime',
    mapMaritimeBase,
    0.6,
    1.26,
    6.45,
    4.1,
    countrySlideMap,
    ['singapore', 'jakarta', 'kuala-lumpur']
  );

  // Highlight photos below map (also clickable to their respective countries!)
  const s4Showcase: Array<{ key: ImageKey; label: string; iso: string }> = [
    { key: 'petrochemical', label: 'Hóa dầu – Singapore', iso: '702' },
    { key: 'shipbuilding', label: 'Đóng tàu – Singapore', iso: '702' },
    { key: 'mining', label: 'Khoáng sản – Malaysia', iso: '458' },
    { key: 'automotive', label: 'Ô tô – Indonesia', iso: '360' },
  ];
  s4Showcase.forEach((item, idx) => {
    const data = images[item.key];
    const xPos = 0.6 + idx * 1.64;
    const targetSlide = countrySlideMap.get(item.iso);
    const linkOpts = targetSlide ? { hyperlink: { slide: targetSlide } } : {};
    if (data) {
      s4.addImage({
        data,
        x: xPos,
        y: 5.5,
        w: 1.52,
        h: 1.14,
        sizing: { type: 'cover', w: 1.52, h: 1.14 },
        rounding: true,
        ...linkOpts,
      });
    }
    s4.addText(item.label, {
      x: xPos,
      y: 6.68,
      w: 1.52,
      h: 0.28,
      fontFace: FONT,
      fontSize: 8.5,
      bold: true,
      color: COLORS.navy,
      align: 'center',
      ...linkOpts,
    });
  });

  // Right: 5 Clickable Maritime Country Cards
  MARITIME_COUNTRIES.forEach((group, idx) => {
    const center = getCenterById(group.centerIds[0]);
    if (!center) return;
    const yPos = 1.26 + idx * 1.14;
    const isFeatured = Boolean(group.featured);
    const targetSlide = countrySlideMap.get(group.countryIso);
    const linkOpts = targetSlide
      ? { hyperlink: { slide: targetSlide, tooltip: `Xem chi tiết ${group.country}` } }
      : {};

    s4.addShape('roundRect', {
      x: 7.3,
      y: yPos,
      w: 5.45,
      h: 1.02,
      fill: { color: isFeatured ? COLORS.white : 'F1F5F9' },
      line: { color: isFeatured ? COLORS.teal : COLORS.border, width: isFeatured ? 1.2 : 1 },
      rectRadius: 0.08,
      ...linkOpts,
    });

    s4.addText(`${group.order}. ${group.country}  ›`, {
      x: 7.5,
      y: yPos + 0.1,
      w: 5.0,
      h: 0.28,
      fontFace: FONT,
      fontSize: 12,
      bold: true,
      color: isFeatured ? COLORS.navy : COLORS.slateText,
      ...linkOpts,
    });

    s4.addText(
      [
        { text: `${center.city}: `, options: { bold: true, color: isFeatured ? COLORS.amber : COLORS.teal } },
        { text: `${center.industries.join(', ')}.`, options: { color: COLORS.slateText } },
      ],
      {
        x: 7.5,
        y: yPos + 0.42,
        w: 5.05,
        h: 0.52,
        fontFace: FONT,
        fontSize: 10,
        ...linkOpts,
      }
    );
  });

  // =========================================================================
  // SLIDE 5 – BẢN ĐỒ + 10 BIỂU ĐỒ TRÒN TỈ TRỌNG NGÀNH CÔNG NGHIỆP TỪNG NƯỚC
  // =========================================================================
  const s5 = pptx.addSlide();
  addSlideHeader(
    s5,
    '05/06',
    'SỐ LIỆU QUỐC TẾ  ·  WORLD BANK (WDI) & UNIDO INDSTAT',
    'TỈ TRỌNG CÁC NGÀNH CÔNG NGHIỆP TỪNG NƯỚC'
  );

  // Left: Interactive Southeast Asia Map
  addInteractiveMapWithHotspots(
    s5,
    'all',
    mapAllBase,
    0.55,
    1.26,
    4.6,
    5.55,
    countrySlideMap
  );

  s5.addText('Nhấp vào quốc gia trên bản đồ hoặc biểu đồ tròn để xem chi tiết', {
    x: 0.55,
    y: 6.9,
    w: 4.6,
    h: 0.28,
    fontFace: FONT,
    fontSize: 8.5,
    italic: true,
    color: COLORS.teal,
  });

  // Right: 10 individual country sector-proportion pie charts + clickable hotspot overlays
  s5.addShape('roundRect', {
    x: 5.28,
    y: 1.26,
    w: 7.5,
    h: 5.65,
    fill: { color: COLORS.white },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.08,
  });

  const pieImgX = 5.38;
  const pieImgY = 1.36;
  const pieImgW = 7.3;
  const pieImgH = 5.1;

  if (perCountryPiesImg) {
    s5.addImage({
      data: perCountryPiesImg,
      x: pieImgX,
      y: pieImgY,
      w: pieImgW,
      h: pieImgH,
      sizing: { type: 'contain', w: pieImgW, h: pieImgH },
    });
  }

  // Place transparent clickable PowerPoint hyperlink overlays over all 10 country pie cards (2x5 grid)
  // Canvas is 1280x840; aspect = 1.5238; box 7.3x5.1 has aspect 1.431 -> image fits full width 7.3, height 4.79
  const canvasAspect = 1280 / 840;
  const drawPieW = pieImgW;
  const drawPieH = pieImgW / canvasAspect;
  const drawPieX = pieImgX;
  const drawPieY = pieImgY + (pieImgH - drawPieH) / 2;

  countryCharts.forEach((chart, idx) => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    const targetSlide = countrySlideMap.get(chart.countryIso);
    if (!targetSlide) return;

    const cxPx = 10 + col * (244 + 10);
    const cyPx = 96 + row * (358 + 14);
    const hx = drawPieX + (cxPx / 1280) * drawPieW;
    const hy = drawPieY + (cyPx / 840) * drawPieH;
    const hw = (244 / 1280) * drawPieW;
    const hh = (358 / 840) * drawPieH;

    s5.addShape('roundRect', {
      x: hx,
      y: hy,
      w: hw,
      h: hh,
      rectRadius: 0.06,
      fill: { color: COLORS.white, transparency: 99 },
      line: { color: COLORS.teal, transparency: 99, width: 0 },
      hyperlink: {
        slide: targetSlide,
        tooltip: `Nhấp để xem chi tiết ${chart.country}`,
      },
    });
  });

  s5.addText('Nguồn số liệu quốc tế: World Bank Open Data (WDI) & Tổ chức Phát triển Công nghiệp Liên Hợp Quốc (UNIDO INDSTAT)', {
    x: 5.38,
    y: 6.56,
    w: 7.3,
    h: 0.28,
    fontFace: FONT,
    fontSize: 8.5,
    color: COLORS.slateMuted,
    align: 'center',
  });

  // =========================================================================
  // SLIDE 6 – TỔNG KẾT (Bản đồ tương tác + 3 ý kết luận + Lời cảm ơn)
  // =========================================================================
  const s6 = pptx.addSlide();
  addSlideHeader(
    s6,
    '06/06',
    'TỔNG KẾT BÀI HỌC  ·  ĐỊA LÍ 11',
    'KẾT LUẬN – BỨC TRANH CÔNG NGHIỆP ĐÔNG NAM Á'
  );

  addInteractiveMapWithHotspots(
    s6,
    'all',
    mapSummaryBase,
    0.6,
    1.28,
    6.25,
    5.05,
    countrySlideMap,
    KEY_SUMMARY_CENTER_IDS
  );

  SUMMARY_POINTS.forEach((pt, idx) => {
    const yPos = 1.32 + idx * 1.62;
    s6.addShape('roundRect', {
      x: 7.15,
      y: yPos,
      w: 5.58,
      h: 1.44,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });

    s6.addText(`${pt.order}. ${pt.title}`, {
      x: 7.4,
      y: yPos + 0.16,
      w: 5.1,
      h: 0.34,
      fontFace: FONT,
      fontSize: 13.5,
      bold: true,
      color: COLORS.teal,
    });

    s6.addText(pt.body, {
      x: 7.4,
      y: yPos + 0.54,
      w: 5.1,
      h: 0.78,
      fontFace: FONT,
      fontSize: 11.5,
      color: COLORS.navy,
      valign: 'top',
    });
  });

  s6.addShape('roundRect', {
    x: 0.6,
    y: 6.5,
    w: 12.133,
    h: 0.66,
    fill: { color: COLORS.navy },
    rectRadius: 0.08,
  });

  s6.addText('CẢM ƠN THẦY CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE!', {
    x: 0.6,
    y: 6.56,
    w: 12.133,
    h: 0.54,
    fontFace: FONT,
    fontSize: 14,
    bold: true,
    color: COLORS.white,
    align: 'center',
    valign: 'middle',
  });

  // =========================================================================
  // SLIDES 7..16 – 10 TRANG CHI TIẾT QUỐC GIA TƯƠNG TÁC (Nhảy tới khi nhấp trên bản đồ)
  // =========================================================================
  countryCharts.forEach((chart) => {
    const detailSlide = pptx.addSlide();
    const regionLabel =
      chart.region === 'mainland' ? 'ĐÔNG NAM Á LỤC ĐỊA' : 'ĐÔNG NAM Á HẢI ĐẢO';
    const regionSlideNum = chart.region === 'mainland' ? 3 : 4;

    addSlideHeader(
      detailSlide,
      `CHI TIẾT · ${chart.country.toUpperCase()}`,
      `${regionLabel}  ·  TRUNG TÂM: ${chart.cities.join(' & ').toUpperCase()}`,
      `CÔNG NGHIỆP ${chart.country.toUpperCase()}`
    );

    // Left: Highlighted regional map pinpointing this exact country
    const detailMapImg = renderSeaMapToDataUrl(chart.region, chart.centerIds, {
      activeCountryIso: chart.countryIso,
    });
    if (detailMapImg) {
      detailSlide.addImage({
        data: detailMapImg,
        x: 0.6,
        y: 1.28,
        w: 4.35,
        h: 5.05,
        sizing: { type: 'contain', w: 4.35, h: 5.05 },
      });
    }

    // Middle: Enlarged Country Sector-Proportion Donut Chart + Exact % Breakdown
    detailSlide.addShape('roundRect', {
      x: 5.12,
      y: 1.28,
      w: 3.55,
      h: 5.05,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });

    const singlePieImg = renderSingleCountryPieToDataUrl(chart);
    if (singlePieImg) {
      detailSlide.addImage({
        data: singlePieImg,
        x: 5.26,
        y: 1.4,
        w: 3.27,
        h: 2.45,
        sizing: { type: 'contain', w: 3.27, h: 2.45 },
      });
    }

    detailSlide.addText(`Tỉ trọng ngành (${chart.sourceLabel})`, {
      x: 5.28,
      y: 3.92,
      w: 3.25,
      h: 0.28,
      fontFace: FONT,
      fontSize: 9.8,
      bold: true,
      color: COLORS.navy,
    });

    chart.sectors.forEach((sector, si) => {
      const sy = 4.26 + si * 0.32;
      if (sy > 6.08) return;
      detailSlide.addShape('rect', {
        x: 5.32,
        y: sy + 0.05,
        w: 0.14,
        h: 0.14,
        fill: { color: sector.color.replace('#', '') },
      });
      detailSlide.addText(sector.name, {
        x: 5.54,
        y: sy,
        w: 2.15,
        h: 0.26,
        fontFace: FONT,
        fontSize: 9.8,
        color: COLORS.slateText,
      });
      detailSlide.addText(`${sector.sharePercent}%`, {
        x: 7.72,
        y: sy,
        w: 0.8,
        h: 0.26,
        fontFace: FONT,
        fontSize: 9.8,
        bold: true,
        color: COLORS.navy,
        align: 'right',
      });
    });

    // Right: Strictly matching real industrial photographs for this country's industries
    detailSlide.addShape('roundRect', {
      x: 8.85,
      y: 1.28,
      w: 3.88,
      h: 5.05,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });

    detailSlide.addText(`Ảnh ngành thực tế · ${chart.country}`, {
      x: 9.02,
      y: 1.4,
      w: 3.55,
      h: 0.3,
      fontFace: FONT,
      fontSize: 11,
      bold: true,
      color: COLORS.teal,
    });

    const countryPhotos = chart.photos.slice(0, 4);
    const isTwoPhotos = countryPhotos.length <= 2;

    countryPhotos.forEach((photo, pi) => {
      const data = images[photo.key];
      if (isTwoPhotos) {
        const py = 1.78 + pi * 2.24;
        if (data) {
          detailSlide.addImage({
            data,
            x: 9.04,
            y: py,
            w: 3.5,
            h: 1.82,
            sizing: { type: 'cover', w: 3.5, h: 1.82 },
            rounding: true,
          });
        }
        detailSlide.addText(photo.label, {
          x: 9.04,
          y: py + 1.86,
          w: 3.5,
          h: 0.28,
          fontFace: FONT,
          fontSize: 9.5,
          bold: true,
          color: COLORS.navy,
          align: 'center',
        });
      } else {
        const col = pi % 2;
        const row = Math.floor(pi / 2);
        const px = 9.02 + col * 1.82;
        const py = 1.78 + row * 2.24;
        if (data) {
          detailSlide.addImage({
            data,
            x: px,
            y: py,
            w: 1.72,
            h: 1.78,
            sizing: { type: 'cover', w: 1.72, h: 1.78 },
            rounding: true,
          });
        }
        detailSlide.addText(photo.label, {
          x: px,
          y: py + 1.82,
          w: 1.72,
          h: 0.36,
          fontFace: FONT,
          fontSize: 8.2,
          bold: true,
          color: COLORS.navy,
          align: 'center',
          valign: 'top',
        });
      }
    });

    // Bottom Interactive Return Navigation Bar (1-tap back to any map slide!)
    const navButtons: Array<{ label: string; slide: number; primary?: boolean }> = [
      { label: '↩ Slide 2: Mạng lưới chung', slide: 2 },
      {
        label:
          regionSlideNum === 3
            ? '↩ Slide 3: ĐNA lục địa'
            : '↩ Slide 4: ĐNA hải đảo',
        slide: regionSlideNum,
        primary: true,
      },
      { label: '↩ Slide 5: Biểu đồ tròn', slide: 5 },
      { label: '↩ Slide 6: Tổng kết', slide: 6 },
    ];

    navButtons.forEach((btn, bi) => {
      const bx = 0.6 + bi * 3.08;
      detailSlide.addText(btn.label, {
        shape: 'roundRect',
        x: bx,
        y: 6.56,
        w: 2.9,
        h: 0.54,
        rectRadius: 0.14,
        fill: { color: btn.primary ? COLORS.navy : COLORS.white },
        line: {
          color: btn.primary ? COLORS.navy : COLORS.teal,
          width: 1.1,
        },
        fontFace: FONT,
        fontSize: 10.5,
        bold: true,
        color: btn.primary ? COLORS.white : COLORS.navy,
        align: 'center',
        valign: 'middle',
        hyperlink: {
          slide: btn.slide,
          tooltip: `Quay lại ${btn.label.replace('↩ ', '')}`,
        },
      });
    });
  });

  await pptx.writeFile({ fileName: 'Cong-Nghiep-Dong-Nam-A-Dia-Li-11.pptx' });
}
