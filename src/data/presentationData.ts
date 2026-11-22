export type ImageKey =
  | 'hero'
  | 'electronics'
  | 'automotive'
  | 'textile'
  | 'food'
  | 'petrochemical'
  | 'shipbuilding'
  | 'wood'
  | 'mining';

export interface IndustryPhotoItem {
  key: ImageKey;
  label: string;
}

export type SeaRegion = 'mainland' | 'maritime';

export interface IndustrialCenter {
  id: string;
  city: string;
  shortCity?: string;
  country: string;
  countryIso: string;
  region: SeaRegion;
  /** [longitude, latitude] */
  coordinates: [number, number];
  industries: string[];
  imageKey: ImageKey;
  featured?: boolean;
  /** Label offset in SVG units for the full Southeast Asia view */
  allOffset: [number, number];
  /** Label offset in SVG units for the regional zoomed view */
  regionOffset: [number, number];
}

export interface CountryGroup {
  order: number;
  country: string;
  countryIso: string;
  region: SeaRegion;
  featured?: boolean;
  centerIds: string[];
  imageKey: ImageKey;
  secondaryImageKey?: ImageKey;
}

export interface IndustryStructureGroup {
  id: string;
  order: number;
  name: string;
  shortDescription: string;
  cities: string[];
  note?: string;
  imageKey: ImageKey;
  secondaryImageKey?: ImageKey;
  accentTone: 'navy' | 'teal' | 'amber';
}

export interface SummaryPoint {
  order: number;
  title: string;
  body: string;
}

export interface SlideMeta {
  index: number;
  code: string;
  shortLabel: string;
  title: string;
}

export const TOTAL_SLIDES = 6;

export const SLIDES_META: SlideMeta[] = [
  {
    index: 0,
    code: '01',
    shortLabel: 'Giới thiệu',
    title: 'CÔNG NGHIỆP KHU VỰC ĐÔNG NAM Á',
  },
  {
    index: 1,
    code: '02',
    shortLabel: 'Bức tranh chung',
    title: 'MẠNG LƯỚI CÁC TRUNG TÂM CÔNG NGHIỆP',
  },
  {
    index: 2,
    code: '03',
    shortLabel: 'ĐNA lục địa',
    title: 'CÔNG NGHIỆP CÁC NƯỚC ĐÔNG NAM Á LỤC ĐỊA',
  },
  {
    index: 3,
    code: '04',
    shortLabel: 'ĐNA hải đảo',
    title: 'CÔNG NGHIỆP TẠI CÁC QUỐC GIA HẢI ĐẢO',
  },
  {
    index: 4,
    code: '05',
    shortLabel: 'Biểu đồ tròn',
    title: 'TỈ TRỌNG CÁC NGÀNH CÔNG NGHIỆP TỪNG NƯỚC',
  },
  {
    index: 5,
    code: '06',
    shortLabel: 'Tổng kết',
    title: 'KẾT LUẬN – BỨC TRANH CÔNG NGHIỆP ĐÔNG NAM Á',
  },
];

export const OVERVIEW_BULLETS: string[] = [
  'Công nghiệp phân bố tại nhiều quốc gia trong khu vực.',
  'Các trung tâm công nghiệp tập trung chủ yếu ở những đô thị lớn.',
  'Cơ cấu ngành công nghiệp khá đa dạng, gồm chế biến thực phẩm, dệt may, cơ khí, điện tử - tin học, hóa chất, sản xuất ô tô và đóng tàu.',
];

export const INDUSTRIAL_CENTERS: IndustrialCenter[] = [
  {
    id: 'ha-noi',
    city: 'Hà Nội',
    country: 'Việt Nam',
    countryIso: '704',
    region: 'mainland',
    coordinates: [105.85, 21.03],
    industries: ['Thực phẩm', 'Điện tử - tin học', 'Cơ khí', 'Dệt may', 'Hóa chất'],
    imageKey: 'electronics',
    featured: true,
    allOffset: [64, -22],
    regionOffset: [74, -18],
  },
  {
    id: 'tp-hcm',
    city: 'Thành phố Hồ Chí Minh',
    shortCity: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    countryIso: '704',
    region: 'mainland',
    coordinates: [106.7, 10.78],
    industries: [
      'Thực phẩm',
      'Điện tử - tin học',
      'Cơ khí',
      'Dệt may',
      'Hóa chất',
      'Đóng tàu',
    ],
    imageKey: 'electronics',
    featured: true,
    allOffset: [58, 28],
    regionOffset: [84, 18],
  },
  {
    id: 'bang-coc',
    city: 'Băng Cốc',
    country: 'Thái Lan',
    countryIso: '764',
    region: 'mainland',
    coordinates: [100.5, 13.76],
    industries: ['Dệt may', 'Sản xuất ô tô', 'Cơ khí', 'Điện tử - tin học'],
    imageKey: 'automotive',
    featured: true,
    allOffset: [-76, 10],
    regionOffset: [-92, 16],
  },
  {
    id: 'vieng-chan',
    city: 'Viêng Chăn',
    country: 'Lào',
    countryIso: '418',
    region: 'mainland',
    coordinates: [102.63, 17.97],
    industries: ['Chế biến lâm sản', 'Thực phẩm'],
    imageKey: 'wood',
    allOffset: [-68, -28],
    regionOffset: [-84, -26],
  },
  {
    id: 'phnom-penh',
    city: 'Phnôm Pênh',
    country: 'Campuchia',
    countryIso: '116',
    region: 'mainland',
    coordinates: [104.92, 11.56],
    industries: ['Thực phẩm', 'Dệt may'],
    imageKey: 'textile',
    allOffset: [-58, 42],
    regionOffset: [-82, 48],
  },
  {
    id: 'yangon',
    city: 'Yangon',
    country: 'Myanmar',
    countryIso: '104',
    region: 'mainland',
    coordinates: [96.16, 16.87],
    industries: ['Hóa chất', 'Thực phẩm', 'Dệt may', 'Chế biến lâm sản'],
    imageKey: 'wood',
    allOffset: [-72, -16],
    regionOffset: [-74, -22],
  },
  {
    id: 'kuala-lumpur',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    countryIso: '458',
    region: 'maritime',
    coordinates: [101.69, 3.14],
    industries: [
      'Sản xuất ô tô',
      'Hóa chất',
      'Điện tử - tin học',
      'Khai thác khoáng sản',
    ],
    imageKey: 'mining',
    featured: true,
    allOffset: [-88, -14],
    regionOffset: [-96, -24],
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryIso: '702',
    region: 'maritime',
    coordinates: [103.82, 1.35],
    industries: ['Hóa dầu', 'Điện tử - tin học', 'Đóng tàu'],
    imageKey: 'petrochemical',
    featured: true,
    allOffset: [74, -18],
    regionOffset: [76, -24],
  },
  {
    id: 'jakarta',
    city: 'Jakarta',
    country: 'Indonesia',
    countryIso: '360',
    region: 'maritime',
    coordinates: [106.85, -6.21],
    industries: ['Sản xuất ô tô', 'Dệt may', 'Hóa chất', 'Cơ khí'],
    imageKey: 'automotive',
    featured: true,
    allOffset: [-66, 24],
    regionOffset: [-68, 28],
  },
  {
    id: 'manila',
    city: 'Manila',
    country: 'Philippines',
    countryIso: '608',
    region: 'maritime',
    coordinates: [120.98, 14.6],
    industries: ['Thực phẩm', 'Dệt may', 'Hóa chất'],
    imageKey: 'food',
    featured: true,
    allOffset: [64, -18],
    regionOffset: [-76, -18],
  },
  {
    id: 'dili',
    city: 'Dili',
    country: 'Đông Timor',
    countryIso: '626',
    region: 'maritime',
    coordinates: [125.57, -8.56],
    industries: ['Chế biến lâm sản', 'Thực phẩm'],
    imageKey: 'wood',
    allOffset: [54, 24],
    regionOffset: [58, 22],
  },
];

export const MAINLAND_COUNTRIES: CountryGroup[] = [
  {
    order: 1,
    country: 'Việt Nam',
    countryIso: '704',
    region: 'mainland',
    featured: true,
    centerIds: ['ha-noi', 'tp-hcm'],
    imageKey: 'electronics',
  },
  {
    order: 2,
    country: 'Thái Lan',
    countryIso: '764',
    region: 'mainland',
    featured: true,
    centerIds: ['bang-coc'],
    imageKey: 'automotive',
  },
  {
    order: 3,
    country: 'Lào',
    countryIso: '418',
    region: 'mainland',
    centerIds: ['vieng-chan'],
    imageKey: 'wood',
  },
  {
    order: 4,
    country: 'Campuchia',
    countryIso: '116',
    region: 'mainland',
    centerIds: ['phnom-penh'],
    imageKey: 'textile',
  },
  {
    order: 5,
    country: 'Myanmar',
    countryIso: '104',
    region: 'mainland',
    centerIds: ['yangon'],
    imageKey: 'food',
  },
];

export const MARITIME_COUNTRIES: CountryGroup[] = [
  {
    order: 1,
    country: 'Malaysia',
    countryIso: '458',
    region: 'maritime',
    featured: true,
    centerIds: ['kuala-lumpur'],
    imageKey: 'electronics',
  },
  {
    order: 2,
    country: 'Singapore',
    countryIso: '702',
    region: 'maritime',
    featured: true,
    centerIds: ['singapore'],
    imageKey: 'petrochemical',
    secondaryImageKey: 'shipbuilding',
  },
  {
    order: 3,
    country: 'Indonesia',
    countryIso: '360',
    region: 'maritime',
    featured: true,
    centerIds: ['jakarta'],
    imageKey: 'automotive',
  },
  {
    order: 4,
    country: 'Philippines',
    countryIso: '608',
    region: 'maritime',
    centerIds: ['manila'],
    imageKey: 'food',
  },
  {
    order: 5,
    country: 'Đông Timor',
    countryIso: '626',
    region: 'maritime',
    centerIds: ['dili'],
    imageKey: 'wood',
  },
];

export const INDUSTRY_GROUPS: IndustryStructureGroup[] = [
  {
    id: 'dien-tu-tin-hoc',
    order: 1,
    name: 'Công nghiệp điện tử - tin học',
    shortDescription: 'Lắp ráp linh kiện điện tử và sản xuất thiết bị công nghệ tại các đô thị lớn.',
    cities: ['Hà Nội', 'TP. Hồ Chí Minh', 'Băng Cốc', 'Kuala Lumpur', 'Singapore'],
    imageKey: 'electronics',
    accentTone: 'navy',
  },
  {
    id: 'co-khi-o-to',
    order: 2,
    name: 'Công nghiệp cơ khí và sản xuất ô tô',
    shortDescription: 'Dây chuyền lắp ráp ô tô và chế tạo cơ khí công nghiệp hiện đại.',
    cities: ['Hà Nội', 'TP. Hồ Chí Minh', 'Băng Cốc', 'Kuala Lumpur', 'Jakarta'],
    imageKey: 'automotive',
    accentTone: 'amber',
  },
  {
    id: 'det-may',
    order: 3,
    name: 'Công nghiệp dệt may',
    shortDescription: 'Sản xuất dệt vải và may mặc phát triển rộng ở nhiều trung tâm công nghiệp.',
    cities: ['Hà Nội', 'TP. Hồ Chí Minh', 'Băng Cốc', 'Phnôm Pênh', 'Manila'],
    imageKey: 'textile',
    accentTone: 'teal',
  },
  {
    id: 'thuc-pham',
    order: 4,
    name: 'Công nghiệp thực phẩm',
    shortDescription: 'Chế biến thực phẩm và đồ đóng hộp hiện diện phổ biến trên toàn khu vực.',
    cities: ['Hà Nội', 'TP. Hồ Chí Minh', 'Viêng Chăn', 'Phnôm Pênh', 'Yangon', 'Manila', 'Dili'],
    note: 'Xuất hiện tại nhiều trung tâm trong khu vực.',
    imageKey: 'food',
    accentTone: 'amber',
  },
  {
    id: 'hoa-chat-hoa-dau-dong-tau',
    order: 5,
    name: 'Công nghiệp hóa chất, hóa dầu và đóng tàu',
    shortDescription: 'Tập trung tại các trung tâm công nghiệp ven biển và cửa ngõ hàng hải lớn.',
    cities: ['Singapore', 'Kuala Lumpur', 'Jakarta', 'TP. Hồ Chí Minh'],
    imageKey: 'petrochemical',
    secondaryImageKey: 'shipbuilding',
    accentTone: 'navy',
  },
];

export const SUMMARY_POINTS: SummaryPoint[] = [
  {
    order: 1,
    title: 'Phân bố',
    body: 'Các trung tâm công nghiệp phân bố ở nhiều quốc gia, tập trung tại những đô thị lớn.',
  },
  {
    order: 2,
    title: 'Cơ cấu',
    body: 'Đa dạng ngành nghề: điện tử - tin học, cơ khí, ô tô, dệt may, thực phẩm, hóa chất và đóng tàu.',
  },
  {
    order: 3,
    title: 'Trung tâm tiêu biểu',
    body: 'Hà Nội, TP. Hồ Chí Minh, Băng Cốc, Kuala Lumpur, Singapore, Jakarta và Manila.',
  },
];

export const KEY_SUMMARY_CENTER_IDS: string[] = [
  'ha-noi',
  'tp-hcm',
  'bang-coc',
  'kuala-lumpur',
  'singapore',
  'jakarta',
  'manila',
];

export function getCenterById(id: string): IndustrialCenter | undefined {
  return INDUSTRIAL_CENTERS.find((center) => center.id === id);
}

const INDUSTRY_TO_PHOTO_KEY: Record<string, ImageKey> = {
  'Điện tử - tin học': 'electronics',
  'Sản xuất ô tô': 'automotive',
  'Cơ khí': 'automotive',
  'Dệt may': 'textile',
  'Thực phẩm': 'food',
  'Hóa chất': 'petrochemical',
  'Hóa dầu': 'petrochemical',
  'Đóng tàu': 'shipbuilding',
  'Chế biến lâm sản': 'wood',
  'Khai thác khoáng sản': 'mining',
};

/**
 * Returns the deduplicated list of real industrial photographs strictly matching
 * the SGK industries present in the given center (preserving exact industry names).
 */
export function getIndustryPhotosForCenter(
  center: IndustrialCenter
): IndustryPhotoItem[] {
  const byKey = new Map<ImageKey, string[]>();

  for (const industry of center.industries) {
    const key = INDUSTRY_TO_PHOTO_KEY[industry];
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      if (!existing.includes(industry)) existing.push(industry);
    } else {
      byKey.set(key, [industry]);
    }
  }

  return Array.from(byKey.entries()).map(([key, labels]) => ({
    key,
    label: labels.join(' & '),
  }));
}

export interface CountrySectorSlice {
  name: string;
  sharePercent: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface CountrySectorChart {
  id: string;
  countryIso: string;
  country: string;
  region: SeaRegion;
  centerIds: string[];
  primaryCenterId: string;
  cities: string[];
  dataYear: string;
  sourceLabel: string;
  metricNote?: string;
  industryGdpPercent: number;
  manufacturingGdpPercent: number;
  gdpYear: string;
  dominantSector: string;
  dominantPercent: number;
  sectors: CountrySectorSlice[];
  photos: IndustryPhotoItem[];
}

export const INDUSTRY_SECTOR_COLORS: Record<string, string> = {
  'Cơ khí, điện tử & vận tải': '#0F294A',
  'Thực phẩm & đồ uống': '#D97736',
  'Dệt may & da giày': '#E11D48',
  'Hóa chất & hóa dầu': '#0D7A7E',
  'CN chế biến khác': '#64748B',
  'Khai khoáng & xây dựng': '#94A3B8',
};

export const INDUSTRY_SECTOR_LEGEND: Array<{ name: string; color: string }> = [
  { name: 'Cơ khí, điện tử & vận tải', color: '#0F294A' },
  { name: 'Thực phẩm & đồ uống', color: '#D97736' },
  { name: 'Dệt may & da giày', color: '#E11D48' },
  { name: 'Hóa chất & hóa dầu', color: '#0D7A7E' },
  { name: 'CN chế biến khác', color: '#64748B' },
];

interface RawCountryWdiStats {
  country: string;
  countryIso: string;
  region: SeaRegion;
  centerIds: string[];
  dataYear: string;
  sourceLabel: string;
  metricNote?: string;
  industryGdpPercent: number;
  manufacturingGdpPercent: number;
  gdpYear: string;
  rawSectors: Array<{ name: string; sharePercent: number }>;
}

/**
 * Verified international statistics retrieved directly from World Bank Open Data (WDI)
 * & UNIDO INDSTAT (indicators NV.MNF.MTRN.ZS.UN, NV.MNF.FBTO.ZS.UN, NV.MNF.TXTL.ZS.UN,
 * NV.MNF.CHEM.ZS.UN, NV.MNF.OTHR.ZS.UN, plus NV.IND.TOTL.ZS & NV.IND.MANF.ZS).
 */
const INTERNATIONAL_WDI_COUNTRIES: RawCountryWdiStats[] = [
  {
    country: 'Việt Nam',
    countryIso: '704',
    region: 'mainland',
    centerIds: ['ha-noi', 'tp-hcm'],
    dataYear: '2023',
    sourceLabel: 'World Bank / UNIDO (2023)',
    industryGdpPercent: 37.6,
    manufacturingGdpPercent: 24.5,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 29.9 },
      { name: 'Dệt may & da giày', sharePercent: 13.8 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 12.5 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 4.9 },
      { name: 'CN chế biến khác', sharePercent: 38.9 },
    ],
  },
  {
    country: 'Thái Lan',
    countryIso: '764',
    region: 'mainland',
    centerIds: ['bang-coc'],
    dataYear: '2021',
    sourceLabel: 'World Bank / UNIDO (2021)',
    industryGdpPercent: 31.1,
    manufacturingGdpPercent: 23.7,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 22.4 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 17.5 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 8.1 },
      { name: 'Dệt may & da giày', sharePercent: 2.1 },
      { name: 'CN chế biến khác', sharePercent: 49.9 },
    ],
  },
  {
    country: 'Lào',
    countryIso: '418',
    region: 'mainland',
    centerIds: ['vieng-chan'],
    dataYear: '2017',
    sourceLabel: 'World Bank / UNIDO (2017)',
    industryGdpPercent: 29.2,
    manufacturingGdpPercent: 9.1,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Thực phẩm & đồ uống', sharePercent: 33.4 },
      { name: 'Dệt may & da giày', sharePercent: 15.7 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 2.3 },
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 0.9 },
      { name: 'CN chế biến khác', sharePercent: 47.7 },
    ],
  },
  {
    country: 'Campuchia',
    countryIso: '116',
    region: 'mainland',
    centerIds: ['phnom-penh'],
    dataYear: 'WDI',
    sourceLabel: 'World Bank / UNIDO (kỳ chuẩn WDI)',
    metricNote: 'Dệt may & da giày chiếm tỉ trọng áp đảo trong giá trị gia tăng công nghiệp chế biến.',
    industryGdpPercent: 43.1,
    manufacturingGdpPercent: 29.0,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Dệt may & da giày', sharePercent: 86.5 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 6.6 },
      { name: 'CN chế biến khác', sharePercent: 6.7 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 0.1 },
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 0.1 },
    ],
  },
  {
    country: 'Myanmar',
    countryIso: '104',
    region: 'mainland',
    centerIds: ['yangon'],
    dataYear: '2022',
    sourceLabel: 'World Bank / UNIDO (2022)',
    metricNote: 'Theo khảo sát doanh nghiệp chính thức UNIDO 2022.',
    industryGdpPercent: 36.2,
    manufacturingGdpPercent: 25.1,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Hóa chất & hóa dầu', sharePercent: 83.5 },
      { name: 'Dệt may & da giày', sharePercent: 9.9 },
      { name: 'CN chế biến khác', sharePercent: 6.0 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 0.5 },
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 0.1 },
    ],
  },
  {
    country: 'Malaysia',
    countryIso: '458',
    region: 'maritime',
    centerIds: ['kuala-lumpur'],
    dataYear: '2022',
    sourceLabel: 'World Bank / UNIDO (2022)',
    industryGdpPercent: 35.7,
    manufacturingGdpPercent: 22.1,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 31.4 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 12.2 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 9.7 },
      { name: 'Dệt may & da giày', sharePercent: 1.7 },
      { name: 'CN chế biến khác', sharePercent: 45.0 },
    ],
  },
  {
    country: 'Singapore',
    countryIso: '702',
    region: 'maritime',
    centerIds: ['singapore'],
    dataYear: '2023',
    sourceLabel: 'World Bank / UNIDO (2023)',
    industryGdpPercent: 22.7,
    manufacturingGdpPercent: 17.4,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 58.8 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 17.8 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 3.7 },
      { name: 'Dệt may & da giày', sharePercent: 0.1 },
      { name: 'CN chế biến khác', sharePercent: 19.6 },
    ],
  },
  {
    country: 'Indonesia',
    countryIso: '360',
    region: 'maritime',
    centerIds: ['jakarta'],
    dataYear: '2022',
    sourceLabel: 'World Bank / UNIDO (2022)',
    industryGdpPercent: 38.7,
    manufacturingGdpPercent: 19.1,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Thực phẩm & đồ uống', sharePercent: 28.6 },
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 15.9 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 12.7 },
      { name: 'Dệt may & da giày', sharePercent: 10.8 },
      { name: 'CN chế biến khác', sharePercent: 32.0 },
    ],
  },
  {
    country: 'Philippines',
    countryIso: '608',
    region: 'maritime',
    centerIds: ['manila'],
    dataYear: '2022',
    sourceLabel: 'World Bank / UNIDO (2022)',
    industryGdpPercent: 27.0,
    manufacturingGdpPercent: 15.3,
    gdpYear: '2025',
    rawSectors: [
      { name: 'Cơ khí, điện tử & vận tải', sharePercent: 34.2 },
      { name: 'Thực phẩm & đồ uống', sharePercent: 33.7 },
      { name: 'Hóa chất & hóa dầu', sharePercent: 6.4 },
      { name: 'Dệt may & da giày', sharePercent: 2.4 },
      { name: 'CN chế biến khác', sharePercent: 23.3 },
    ],
  },
  {
    country: 'Đông Timor',
    countryIso: '626',
    region: 'maritime',
    centerIds: ['dili'],
    dataYear: '2024',
    sourceLabel: 'World Bank WDI (2024)',
    metricNote: 'UNIDO chưa tách 5 phân ngành chế biến; biểu đồ thể hiện tỉ trọng trong toàn ngành công nghiệp (11,8% GDP).',
    industryGdpPercent: 11.8,
    manufacturingGdpPercent: 1.9,
    gdpYear: '2024',
    rawSectors: [
      { name: 'Khai khoáng & xây dựng', sharePercent: 83.9 },
      { name: 'CN chế biến khác', sharePercent: 16.1 },
    ],
  },
];

/**
 * Returns real international per-country manufacturing value-added share pie charts
 * sourced from World Bank Open Data (WDI) and UNIDO INDSTAT.
 */
export function getPerCountrySectorCharts(): CountrySectorChart[] {
  return INTERNATIONAL_WDI_COUNTRIES.map((entry) => {
    const centers = entry.centerIds
      .map((id) => getCenterById(id))
      .filter((c): c is IndustrialCenter => Boolean(c));

    const total = entry.rawSectors.reduce((sum, s) => sum + s.sharePercent, 0);
    let cursor = -90;

    const sectors: CountrySectorSlice[] = entry.rawSectors.map((s) => {
      const sweep = (s.sharePercent / total) * 360;
      const startAngle = cursor;
      const endAngle = cursor + sweep;
      cursor = endAngle;
      return {
        name: s.name,
        sharePercent: s.sharePercent,
        startAngle,
        endAngle,
        color: INDUSTRY_SECTOR_COLORS[s.name] ?? '#64748B',
      };
    });

    const photosByKey = new Map<ImageKey, string[]>();
    for (const center of centers) {
      for (const industry of center.industries) {
        const photoKey = INDUSTRY_TO_PHOTO_KEY[industry];
        if (!photoKey) continue;
        const existing = photosByKey.get(photoKey);
        if (existing) {
          if (!existing.includes(industry)) existing.push(industry);
        } else {
          photosByKey.set(photoKey, [industry]);
        }
      }
    }

    const photos: IndustryPhotoItem[] = Array.from(photosByKey.entries()).map(
      ([key, labels]) => ({
        key,
        label: labels.join(' & '),
      })
    );

    // Find the main named manufacturing driver (preferring specific sector over 'other' if close)
    const sorted = [...sectors].sort((a, b) => b.sharePercent - a.sharePercent);
    const top = sorted[0];

    return {
      id: entry.countryIso,
      countryIso: entry.countryIso,
      country: entry.country,
      region: entry.region,
      centerIds: entry.centerIds,
      primaryCenterId: entry.centerIds[0],
      cities: centers.map((c) => c.shortCity ?? c.city),
      dataYear: entry.dataYear,
      sourceLabel: entry.sourceLabel,
      metricNote: entry.metricNote,
      industryGdpPercent: entry.industryGdpPercent,
      manufacturingGdpPercent: entry.manufacturingGdpPercent,
      gdpYear: entry.gdpYear,
      dominantSector: top.name,
      dominantPercent: top.sharePercent,
      sectors,
      photos,
    };
  });
}

export interface CountryPieSlice {
  id: string;
  country: string;
  region: SeaRegion;
  cities: string[];
  industries: string[];
  industryCount: number;
  sharePercent: number;
  startAngle: number;
  endAngle: number;
  color: string;
  photos: IndustryPhotoItem[];
}

const COUNTRY_PIE_COLORS: Record<string, string> = {
  'Việt Nam': '#0F294A',
  'Thái Lan': '#0D7A7E',
  'Malaysia': '#1E6B9B',
  'Indonesia': '#D97736',
  'Myanmar': '#2E8B7A',
  'Singapore': '#2563EB',
  'Philippines': '#E08E45',
  'Lào': '#4B8EA3',
  'Campuchia': '#64748B',
  'Đông Timor': '#94A3B8',
};

/**
 * Computes the 10-country pie chart dataset strictly from the distinct industrial
 * sectors shown for each country on SGK Hình 12.3 (zero fabricated statistics).
 */
export function getCountryPieData(): CountryPieSlice[] {
  const allGroups = [...MAINLAND_COUNTRIES, ...MARITIME_COUNTRIES];

  const rawEntries = allGroups.map((group) => {
    const centers = group.centerIds
      .map((id) => getCenterById(id))
      .filter((c): c is IndustrialCenter => Boolean(c));

    const uniqueIndustries: string[] = [];
    const photosByKey = new Map<ImageKey, string[]>();

    for (const center of centers) {
      for (const industry of center.industries) {
        if (!uniqueIndustries.includes(industry)) {
          uniqueIndustries.push(industry);
        }
        const photoKey = INDUSTRY_TO_PHOTO_KEY[industry];
        if (photoKey) {
          const existing = photosByKey.get(photoKey);
          if (existing) {
            if (!existing.includes(industry)) existing.push(industry);
          } else {
            photosByKey.set(photoKey, [industry]);
          }
        }
      }
    }

    return {
      id: group.countryIso,
      country: group.country,
      region: group.region,
      cities: centers.map((c) => c.shortCity ?? c.city),
      industries: uniqueIndustries,
      industryCount: uniqueIndustries.length,
      color: COUNTRY_PIE_COLORS[group.country] ?? '#0D7A7E',
      photos: Array.from(photosByKey.entries()).map(([key, labels]) => ({
        key,
        label: labels.join(' & '),
      })),
    };
  });

  // Sort descending by sector diversity for clean cartographic pie reading
  rawEntries.sort((a, b) => b.industryCount - a.industryCount);

  const totalCount = rawEntries.reduce((sum, item) => sum + item.industryCount, 0);
  let cursorAngle = -90; // Start at 12 o'clock

  return rawEntries.map((entry) => {
    const sweep = (entry.industryCount / totalCount) * 360;
    const startAngle = cursorAngle;
    const endAngle = cursorAngle + sweep;
    cursorAngle = endAngle;

    return {
      ...entry,
      sharePercent: Math.round((entry.industryCount / totalCount) * 1000) / 10,
      startAngle,
      endAngle,
    };
  });
}

export function clampSlide(index: number, total: number = TOTAL_SLIDES): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(index, total - 1));
}

export function nextSlide(current: number, total: number = TOTAL_SLIDES): number {
  return clampSlide(current + 1, total);
}

export function prevSlide(current: number, total: number = TOTAL_SLIDES): number {
  return clampSlide(current - 1, total);
}

export function formatSlideNumber(index: number, total: number = TOTAL_SLIDES): string {
  const safeIndex = clampSlide(index, total);
  const currentStr = String(safeIndex + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');
  return `${currentStr}/${totalStr}`;
}

export function getProgressPercent(index: number, total: number = TOTAL_SLIDES): number {
  if (total <= 0) return 0;
  const safeIndex = clampSlide(index, total);
  return Math.round(((safeIndex + 1) / total) * 100);
}
