export type UserRole = 'buyer' | 'seller' | 'admin';

export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';
export type ProductStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type FraudReportType = 'fake_product' | 'wrong_delivery' | 'scam';
export type FraudReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  kycStatus: KYCStatus;
  trustScore: number;
  totalOrders: number;
  totalEarnings: number;
}

export interface KYCDocument {
  id: string;
  sellerId: string;
  fullName: string;
  phone: string;
  address: string;
  upiId: string;
  aadhaarNumber: string;
  panNumber: string;
  aadhaarImage?: string;
  panImage?: string;
  shopImage?: string;
  status: KYCStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: ProductCategory;
  image: string;
  stock: number;
  unit: string;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  trustScore: number;
  createdAt: string;
}

export type ProductCategory =
  | 'groceries'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'snacks'
  | 'beverages'
  | 'household'
  | 'bakery';

export const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy Products', emoji: '🥛' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
  { value: 'beverages', label: 'Beverages', emoji: '🥤' },
  { value: 'household', label: 'Household Items', emoji: '🏠' },
  { value: 'bakery', label: 'Bakery Items', emoji: '🍞' },
];

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  sellerId: string;
  sellerName: string;
}

export interface FraudReport {
  id: string;
  reporterId: string;
  reporterName: string;
  sellerId: string;
  sellerName: string;
  orderId?: string;
  type: FraudReportType;
  description: string;
  status: FraudReportStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
