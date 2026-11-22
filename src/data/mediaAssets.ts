import type { ImageKey } from './presentationData';

export interface MediaAsset {
  src: string;
  alt: string;
  caption: string;
}

export const MEDIA_ASSETS: Record<ImageKey, MediaAsset> = {
  hero: {
    src: '/src/assets/images/industrial_park_sea_hero_1795342190858.jpg',
    alt: 'Toàn cảnh khu công nghiệp hiện đại tại Đông Nam Á nhìn từ trên cao',
    caption: 'Khu công nghiệp hiện đại tại Đông Nam Á',
  },
  electronics: {
    src: '/src/assets/images/electronics_assembly_line_1795342189001.jpg',
    alt: 'Dây chuyền lắp ráp linh kiện điện tử công nghệ cao trong phòng sạch',
    caption: 'Công nghiệp điện tử - tin học',
  },
  automotive: {
    src: '/src/assets/images/automotive_manufacturing_line_1795342189124.jpg',
    alt: 'Dây chuyền robot tự động lắp ráp ô tô trong nhà máy cơ khí hiện đại',
    caption: 'Cơ khí & sản xuất ô tô',
  },
  textile: {
    src: '/src/assets/images/textile_garment_factory_1795342189504.jpg',
    alt: 'Nhà máy dệt may quy mô công nghiệp tại Đông Nam Á',
    caption: 'Công nghiệp dệt may',
  },
  food: {
    src: '/src/assets/images/food_processing_plant_1795342191605.jpg',
    alt: 'Dây chuyền chế biến và đóng hộp thực phẩm tự động bằng thép không gỉ',
    caption: 'Công nghiệp chế biến thực phẩm',
  },
  petrochemical: {
    src: '/src/assets/images/petrochemical_refinery_1795342189065.jpg',
    alt: 'Tổ hợp lọc hóa dầu ven biển hiện đại tại Đông Nam Á',
    caption: 'Công nghiệp hóa chất & hóa dầu',
  },
  shipbuilding: {
    src: '/src/assets/images/shipbuilding_yard_1795342189745.jpg',
    alt: 'Nhà máy đóng tàu biển với cần cẩu giàn cỡ lớn bên bờ biển Đông Nam Á',
    caption: 'Công nghiệp đóng tàu',
  },
  wood: {
    src: '/src/assets/images/wood_processing_mill_1795346977030.jpg',
    alt: 'Nhà máy chế biến gỗ và lâm sản công nghiệp hiện đại tại Đông Nam Á',
    caption: 'Công nghiệp chế biến lâm sản',
  },
  mining: {
    src: '/src/assets/images/mineral_mining_facility_1795346977436.jpg',
    alt: 'Cơ sở khai thác và tuyển khoáng sản công nghiệp tại Đông Nam Á',
    caption: 'Công nghiệp khai thác khoáng sản',
  },
};
