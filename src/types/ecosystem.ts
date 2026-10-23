/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoneyAmount, OrderStatus, OrderViewModel, UserRole } from './index';

export type ReviewTargetType = 'merchant' | 'courier';

export interface ReviewFeedback {
  id: string;
  orderId: string;
  orderNumber: number;
  targetType: ReviewTargetType;
  targetId: string;
  targetName: string;
  authorId: string;
  authorName: string;
  rating: number; // 1 to 5
  tags: string[];
  comment?: string;
  createdAt: string;
  courierTipAdded?: MoneyAmount;
}

export type LoyaltyTierName = 'VECINO_NUEVO' | 'VECINO_HABITUAL' | 'VECINO_NOTABLE';

export interface LoyaltyTierInfo {
  tier: LoyaltyTierName;
  label: string;
  minPoints: number;
  maxPoints?: number;
  cashbackPercent: number;
  colorClass: string;
  badgeIcon: string;
  perks: string[];
}

export interface LoyaltyCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  pointsCost: number;
  discountAmount: MoneyAmount;
  minSpend: MoneyAmount;
  category?: string;
  isRedeemed?: boolean;
}

export interface BadgeAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
}

export interface CustomerLoyaltyProfile {
  totalPoints: number;
  lifetimePoints: number;
  currentTier: LoyaltyTierName;
  unlockedBadges: BadgeAchievement[];
  redeemedCoupons: LoyaltyCoupon[];
}

export type NotificationType =
  | 'ORDER_UPDATE'
  | 'NEW_OFFER'
  | 'NEW_ORDER'
  | 'WEATHER_ALERT'
  | 'LOYALTY_REWARD'
  | 'REVIEW_REQUEST'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  targetRole: UserRole | 'all';
  type: NotificationType;
  timestamp: string;
  read: boolean;
  orderId?: string;
  orderNumber?: number;
}

export interface SimulationStep {
  stepIndex: number;
  role: UserRole;
  title: string;
  description: string;
  orderStatus: OrderStatus;
  badgeText: string;
}
