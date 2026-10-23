/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DisputeTicket,
  DisputeStatus,
  DisputePriority,
  PartnerAuditRecord,
  PartnerVerificationStatus,
  PlatformFeeConfig,
  MarketplaceMetrics,
} from '../types/admin';
import { MoneyAmount } from '../types';

/**
 * Calculates dynamic delivery pricing and breakdown between customer, courier, and platform
 */
export function calculateOrderPricing(
  distanceKm: number,
  subtotal: number,
  config: PlatformFeeConfig,
  options?: { isRainActive?: boolean; isNightRush?: boolean }
): {
  customerDeliveryFee: MoneyAmount;
  courierEarnings: MoneyAmount;
  platformFairTake: MoneyAmount;
  courierPoolContribution: MoneyAmount;
  breakdown: {
    baseFare: number;
    distanceCharge: number;
    rainSurcharge: number;
    nightSurcharge: number;
  };
} {
  const safeDistance = Math.max(0, distanceKm);
  const baseFare = config.baseFare;
  const distanceCharge = Math.round(safeDistance * config.perKmFare);
  const rainSurcharge =
    options?.isRainActive && config.rainSurchargeEnabled ? config.rainSurchargeAmount : 0;
  const nightSurcharge =
    options?.isNightRush && config.nightRushEnabled ? config.nightRushAmount : 0;

  const totalDeliveryFee = baseFare + distanceCharge + rainSurcharge + nightSurcharge;

  // FoodieLocal fair model: 100% of delivery fee + surcharges go directly to the courier!
  // Platform fair revenue comes strictly from a transparent 6.5% merchant commission.
  const courierEarningsAmount = totalDeliveryFee;
  const platformFairAmount = Math.round(subtotal * (config.platformFairCommissionPercent / 100));
  const poolContribution = Math.round(
    platformFairAmount * (config.courierPoolAllocationPercent / 100)
  );

  return {
    customerDeliveryFee: { amount: totalDeliveryFee, currency: 'ARS' },
    courierEarnings: { amount: courierEarningsAmount, currency: 'ARS' },
    platformFairTake: { amount: platformFairAmount, currency: 'ARS' },
    courierPoolContribution: { amount: poolContribution, currency: 'ARS' },
    breakdown: {
      baseFare,
      distanceCharge,
      rainSurcharge,
      nightSurcharge,
    },
  };
}

/**
 * Pure state reducer for resolving customer/merchant/courier disputes
 */
export function resolveDispute(
  dispute: DisputeTicket,
  action: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS',
  notes: string,
  customRefundAmount?: number
): DisputeTicket {
  let newStatus: DisputeStatus = 'PENDING';
  let refund: MoneyAmount | undefined = undefined;

  switch (action) {
    case 'REFUND':
      newStatus = 'REFUNDED';
      refund = {
        amount: customRefundAmount !== undefined ? customRefundAmount : dispute.amount.amount,
        currency: 'ARS',
      };
      break;
    case 'REASSIGN':
      newStatus = 'REASSIGNED';
      break;
    case 'COMPENSATE':
      newStatus = 'COMPENSATED';
      break;
    case 'DISMISS':
      newStatus = 'DISMISSED';
      break;
  }

  return {
    ...dispute,
    status: newStatus,
    actionTaken: action,
    resolutionNotes: notes.trim(),
    resolvedAt: new Date().toISOString(),
    ...(refund ? { refundAmount: refund } : {}),
  };
}

/**
 * Filter dispute tickets by status, priority, and search term
 */
export function filterDisputes(
  disputes: DisputeTicket[],
  filter: {
    status?: DisputeStatus | 'ALL';
    priority?: DisputePriority | 'ALL';
    query?: string;
  }
): DisputeTicket[] {
  return disputes.filter((item) => {
    // Status filter
    if (filter.status && filter.status !== 'ALL' && item.status !== filter.status) {
      return false;
    }

    // Priority filter
    if (filter.priority && filter.priority !== 'ALL' && item.priority !== filter.priority) {
      return false;
    }

    // Query filter (matches orderNumber, customer, merchant, courier, title)
    if (filter.query && filter.query.trim().length > 0) {
      const q = filter.query.toLowerCase().trim();
      const matchOrder = item.orderNumber.toString().includes(q);
      const matchCustomer = item.customerName.toLowerCase().includes(q);
      const matchMerchant = item.merchantName.toLowerCase().includes(q);
      const matchCourier = item.courierName?.toLowerCase().includes(q) || false;
      const matchTitle = item.title.toLowerCase().includes(q);

      if (!matchOrder && !matchCustomer && !matchMerchant && !matchCourier && !matchTitle) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Pure state updater for Partner Verification status
 */
export function updatePartnerStatus(
  partner: PartnerAuditRecord,
  newStatus: PartnerVerificationStatus,
  reason?: string
): PartnerAuditRecord {
  return {
    ...partner,
    verificationStatus: newStatus,
    rejectionReason: reason ? reason.trim() : undefined,
  };
}

/**
 * Filter partners by type, verification status, and query
 */
export function filterPartners(
  partners: PartnerAuditRecord[],
  filter: {
    type?: 'ALL' | 'MERCHANT' | 'COURIER';
    status?: PartnerVerificationStatus | 'ALL';
    query?: string;
  }
): PartnerAuditRecord[] {
  return partners.filter((p) => {
    if (filter.type && filter.type !== 'ALL' && p.type !== filter.type) {
      return false;
    }

    if (filter.status && filter.status !== 'ALL' && p.verificationStatus !== filter.status) {
      return false;
    }

    if (filter.query && filter.query.trim().length > 0) {
      const q = filter.query.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDoc = p.cuitOrDni.toLowerCase().includes(q);
      const matchEmail = p.contactEmail.toLowerCase().includes(q);
      const matchZone = p.zone.toLowerCase().includes(q);

      if (!matchName && !matchDoc && !matchEmail && !matchZone) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates rewards pool distribution breakdown across tiers
 */
export function calculatePoolDistribution(
  totalPool: number,
  tierRatios = { gold: 0.5, silver: 0.3, bronze: 0.2 },
  cadeteCounts = { gold: 3, silver: 7, bronze: 15 }
): {
  goldTierTotal: number;
  silverTierTotal: number;
  bronzeTierTotal: number;
  perGoldCadete: number;
  perSilverCadete: number;
  perBronzeCadete: number;
} {
  const goldTotal = Math.round(totalPool * tierRatios.gold);
  const silverTotal = Math.round(totalPool * tierRatios.silver);
  const bronzeTotal = Math.round(totalPool * tierRatios.bronze);

  return {
    goldTierTotal: goldTotal,
    silverTierTotal: silverTotal,
    bronzeTierTotal: bronzeTotal,
    perGoldCadete: cadeteCounts.gold > 0 ? Math.round(goldTotal / cadeteCounts.gold) : 0,
    perSilverCadete: cadeteCounts.silver > 0 ? Math.round(silverTotal / cadeteCounts.silver) : 0,
    perBronzeCadete: cadeteCounts.bronze > 0 ? Math.round(bronzeTotal / cadeteCounts.bronze) : 0,
  };
}

/**
 * Computes live marketplace health metrics
 */
export function calculateMarketplaceHealth(
  orders: { total: number; onTime: number; delayed: number; totalAmount: number; commissionPercent: number },
  couriers: { inTransit: number; available: number },
  merchants: { open: number; total: number },
  pendingDisputes: number,
  pendingAudits: number,
  rainActive: boolean
): MarketplaceMetrics {
  const onTimeRate = orders.total > 0 ? Math.round((orders.onTime / orders.total) * 1000) / 10 : 100;
  const platformRevenue = Math.round(orders.totalAmount * (orders.commissionPercent / 100));

  return {
    dailyGmv: { amount: orders.totalAmount, currency: 'ARS' },
    platformRevenue: { amount: platformRevenue, currency: 'ARS' },
    totalOrdersToday: orders.total,
    activeOrdersInTransit: couriers.inTransit,
    openMerchantsCount: merchants.open,
    totalMerchantsCount: merchants.total,
    activeCouriersInTransit: couriers.inTransit,
    availableCouriers: couriers.available,
    avgDeliveryMinutes: 28,
    onTimeDeliveryRate: onTimeRate,
    pendingDisputesCount: pendingDisputes,
    pendingAuditsCount: pendingAudits,
    rainSurchargeActive: rainActive,
  };
}

/**
 * Human-readable Spanish labels and semantic color tags for dispute status
 */
export function getDisputeBadge(status: DisputeStatus): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pendiente',
        bgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
        textClass: 'text-amber-800 dark:text-amber-300',
      };
    case 'INVESTIGATING':
      return {
        label: 'En Investigación',
        bgClass: 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700',
        textClass: 'text-blue-800 dark:text-blue-300',
      };
    case 'REFUNDED':
      return {
        label: 'Reembolsado',
        bgClass: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
        textClass: 'text-emerald-800 dark:text-emerald-300',
      };
    case 'REASSIGNED':
      return {
        label: 'Cadete Reasignado',
        bgClass: 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700',
        textClass: 'text-indigo-800 dark:text-indigo-300',
      };
    case 'COMPENSATED':
      return {
        label: 'Compensado',
        bgClass: 'bg-teal-100 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700',
        textClass: 'text-teal-800 dark:text-teal-300',
      };
    case 'DISMISSED':
      return {
        label: 'Desestimado',
        bgClass: 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700',
        textClass: 'text-gray-700 dark:text-zinc-300',
      };
  }
}

/**
 * Human-readable Spanish labels and semantic color tags for partner verification status
 */
export function getPartnerStatusBadge(status: PartnerVerificationStatus): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verificado y Aprobado',
        bgClass: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
        textClass: 'text-emerald-800 dark:text-emerald-300',
      };
    case 'PENDING_REVIEW':
      return {
        label: 'Revisión Pendiente',
        bgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
        textClass: 'text-amber-800 dark:text-amber-300',
      };
    case 'SUSPENDED':
      return {
        label: 'Suspendido / Rechazado',
        bgClass: 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700',
        textClass: 'text-rose-800 dark:text-rose-300',
      };
  }
}
