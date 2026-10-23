/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'merchant' | 'courier' | 'admin';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface MoneyAmount {
  amount: number;
  currency: 'ARS';
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

export type DeliveryType = 'platform' | 'merchant' | 'pickup';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  merchantId?: string;
  courierId?: string;
}

export interface PublicUser {
  id: string;
  role: UserRole;
  displayName: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  cityId: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  merchantId?: string;
  courierId?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  displayName: string;
  email?: string;
  phone?: string;
  cityId: string;
  merchantId?: string;
  courierId?: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuthResponse {
  session?: AuthSession;
  user?: PublicUser;
  message?: string;
  authenticated?: boolean;
}

export interface Address {
  id: string;
  label: string; // 'Casa', 'Oficina', etc.
  street: string;
  number: string;
  apartment?: string;
  city: string;
  instructions?: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  tags: string[];
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: MoneyAmount;
  freeDeliveryThreshold?: MoneyAmount;
  distanceKm: number;
  coverImage: string;
  logoImage?: string;
  address: string;
  isSponsored?: boolean;
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: MoneyAmount;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: {
    size?: string;
    extras?: string[];
  };
  notes?: string;
}

export interface OrderItemVM {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: MoneyAmount;
  totalPrice: MoneyAmount;
  notes?: string;
}

export interface OrderViewModel {
  id: string;
  orderNumber: number;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  customerId: string;
  courierId?: string;
  courierName?: string;
  status: OrderStatus;
  deliveryType: DeliveryType;
  items: OrderItemVM[];
  subtotal: MoneyAmount;
  deliveryFee: MoneyAmount;
  tip: MoneyAmount;
  discount: MoneyAmount;
  total: MoneyAmount;
  deliveryAddress: Address;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export interface CourierOfferVM {
  id: string;
  orderId: string;
  orderNumber: number;
  merchantName: string;
  merchantAddress: string;
  customerZone: string;
  customerAddress: string;
  distanceKm: number;
  estimatedMinutes: number;
  guaranteedPayment: MoneyAmount;
  tip: MoneyAmount;
  expiresAt: string; // ISO string
  secondsRemaining: number;
}

export * from './ecosystem';
