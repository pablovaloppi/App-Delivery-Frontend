/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoneyAmount } from './index';

export type AdminSubTab = 'overview' | 'disputes' | 'audit' | 'settings';

export interface MarketplaceMetrics {
  dailyGmv: MoneyAmount;
  platformRevenue: MoneyAmount;
  totalOrdersToday: number;
  activeOrdersInTransit: number;
  openMerchantsCount: number;
  totalMerchantsCount: number;
  activeCouriersInTransit: number;
  availableCouriers: number;
  avgDeliveryMinutes: number;
  onTimeDeliveryRate: number; // e.g. 96.4
  pendingDisputesCount: number;
  pendingAuditsCount: number;
  rainSurchargeActive: boolean;
}

export type DisputeCategory =
  | 'DELAY'
  | 'DAMAGED_COLD_FOOD'
  | 'WRONG_ITEMS'
  | 'WRONG_ADDRESS'
  | 'COURIER_BREAKDOWN';

export type DisputeStatus =
  | 'PENDING'
  | 'INVESTIGATING'
  | 'REFUNDED'
  | 'REASSIGNED'
  | 'COMPENSATED'
  | 'DISMISSED';

export type DisputePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DisputeTicket {
  id: string;
  orderId: string;
  orderNumber: number;
  customerName: string;
  merchantName: string;
  courierName?: string;
  reportedBy: 'customer' | 'merchant' | 'courier';
  category: DisputeCategory;
  title: string;
  description: string;
  amount: MoneyAmount;
  status: DisputeStatus;
  priority: DisputePriority;
  createdAt: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  actionTaken?: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS';
  refundAmount?: MoneyAmount;
}

export type DocumentType =
  | 'BROMATOLOGY'
  | 'CUIT'
  | 'DNI'
  | 'INSURANCE'
  | 'CRIMINAL_RECORD'
  | 'VEHICLE_REGISTRATION';

export interface PartnerDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  submittedAt: string;
  expiresAt?: string;
  documentNumber?: string;
  issuer?: string;
}

export type PartnerVerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'SUSPENDED';

export interface PartnerAuditRecord {
  id: string;
  name: string;
  type: 'MERCHANT' | 'COURIER';
  categoryOrVehicle: string;
  contactEmail: string;
  contactPhone: string;
  zone: string;
  documents: PartnerDocument[];
  verificationStatus: PartnerVerificationStatus;
  registeredAt: string;
  rejectionReason?: string;
  rating?: number;
  totalCompletedOrders?: number;
  cuitOrDni: string;
}

export interface PlatformFeeConfig {
  baseFare: number;
  perKmFare: number;
  rainSurchargeEnabled: boolean;
  rainSurchargeAmount: number;
  nightRushEnabled: boolean;
  nightRushAmount: number;
  platformFairCommissionPercent: number; // e.g. 6.5
  courierRewardsPoolCurrent: number; // e.g. 51500 ARS
  courierRewardsPoolMonthlyTarget: number; // e.g. 100000 ARS
  courierPoolAllocationPercent: number; // e.g. 2%
}

export interface ZoneDeliveryStats {
  zoneName: string;
  activeOrders: number;
  availableCouriers: number;
  avgEtaMinutes: number;
  demandLevel: 'NORMAL' | 'HIGH' | 'SURGE';
}
