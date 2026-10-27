/**
 * TypeScript Data Models - Chợ Mua Bán Khuôn Viên Trường (Campus Marketplace)
 * Đề tài 02 - Đại học Công nghệ Đồng Nai
 */

export type UserRole = 'BUYER' | 'SELLER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campusLocation?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type MarketCategory =
  | 'textbooks'
  | 'electronics'
  | 'stationery'
  | 'living'
  | 'uniforms'
  | 'other';

export interface CategoryInfo {
  id: MarketCategory;
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'textbooks', name: 'Giáo trình & Sách', icon: 'book' },
  { id: 'electronics', name: 'Đồ điện tử & Phụ kiện', icon: 'laptop' },
  { id: 'stationery', name: 'Dụng cụ học tập', icon: 'pencil' },
  { id: 'living', name: 'Đồ dùng ký túc xá', icon: 'home' },
  { id: 'uniforms', name: 'Đồng phục & Trang phục', icon: 'shirt' },
  { id: 'other', name: 'Mục khác', icon: 'grid' },
];

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  title: string;
  description: string;
  category: MarketCategory;
  price: number; // Giá bán (VNĐ, >= 0)
  stock: number; // Tồn kho (số nguyên >= 0)
  photoUri: string; // Đường dẫn ảnh thực tế (đã nén)
  originalPhotoSize?: number; // Dung lượng ảnh gốc (bytes) để đo tỷ lệ nén
  compressedPhotoSize?: number; // Dung lượng sau nén (bytes)
  createdAt: string; // ISO String
  updatedAt?: string; // ISO String
  isAvailable: boolean; // Còn hàng hay không
  condition?: 'new' | 'like-new' | 'used'; // Tình trạng món đồ
}

export interface CartItem {
  listingId: string;
  quantity: number; // Số lượng (nguyên dương >= 1, không vượt quá stock)
  listing: Listing;
}

export type ShippingMethod = 'CAMPUS_PICKUP' | 'DORM_DELIVERY';

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  total: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  items: {
    listingId: string;
    title: string;
    price: number;
    quantity: number;
    photoUri: string;
  }[];
  subtotal: number;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  total: number;
  pickupLocation: string;
  note?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface PriceAlert {
  listingId: string;
  listingTitle: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
  notified: boolean;
}

