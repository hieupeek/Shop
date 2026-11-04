export type Gender = 'MEN' | 'WOMEN' | 'UNISEX';

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
};

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

