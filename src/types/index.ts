export type Gender = 'MEN' | 'WOMEN' | 'UNISEX';

export type OccasionSlug = 'tiec-tung' | 'dam-cuoi' | 'chup-anh' | 'cong-so' | 'hen-ho';

export type Occasion = {
  id: string;
  name: string;
  slug: OccasionSlug;
  description: string;
  subtitle: string;
  image: string;
  badge: string;
};

export type Category = {
  id: string;
  name: string;
  shortName?: string;
  fullName?: string;
  slug: string;
  gender: Gender;
  image?: string;
  icon?: string;
  itemCount: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
  price: number;
  originalPrice: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  gender: Gender;
  categorySlug: string;
  categoryName: string;
  basePrice: number;
  originalPrice: number;
  discountPercent?: number;
  description: string;
  images: {
    url: string;
    colorName?: string;
    isPrimary?: boolean;
  }[];
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;

  // Thuê sản phẩm & Gợi ý theo dịp
  isRentable?: boolean;
  rentalPrice?: number; // Giá thuê theo gói (ví dụ 3 ngày)
  rentalDeposit?: number; // Tiền đặt cọc giữ đồ (hoàn trả 100% khi trả lại trang phục)
  occasions?: OccasionSlug[]; // Các dịp phù hợp
  stylistTip?: string; // Lời khuyên phối đồ cho big size
};

export type CartItemType = 'BUY' | 'RENT';

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  colorName: string;
  size: string;
  image: string;
  quantity: number;

  // Cho thuê
  itemType: CartItemType; // 'BUY' hoặc 'RENT'
  rentalDays?: number; // Số ngày thuê, vd 3 hoặc 5 ngày
  rentalStartDate?: string; // Ngày nhận đồ
  rentalEndDate?: string; // Ngày trả đồ
  deposit?: number; // Tiền đặt cọc của sản phẩm này
};

export type MakeupPackage = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: string[];
  image: string;
  tag?: string;
};

export type MakeupBooking = {
  id?: string;
  packageId: string;
  packageName: string;
  price: number;
  customerName: string;
  phone: string;
  date: string;
  timeSlot: string;
  locationType: 'STUDIO' | 'AT_HOME';
  address?: string;
  notes?: string;
  createdAt?: string;
};

export type CustomerReview = {
  id: string;
  customerName: string;
  author?: string;
  avatar?: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
};
