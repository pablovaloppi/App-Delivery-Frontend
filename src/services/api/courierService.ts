/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CourierOfferVM, MoneyAmount } from '../../types';
import { CourierDeliveryPhase } from '../../utils/courierLogic';
import { mockCourierOffer } from '../../data/mockData';

export interface CompletedDelivery {
  id: string;
  orderNumber: number;
  merchantName: string;
  customerZone: string;
  distanceKm: number;
  timeAgo: string;
  payment: MoneyAmount;
  tip: MoneyAmount;
  icon: string;
}

export interface RewardsPoolData {
  currentPool: MoneyAmount;
  todayGrowth: MoneyAmount;
  nextMilestone: MoneyAmount;
  maxPoolCap: MoneyAmount;
  periodLabel: string;
  courierRankPosition: number;
  totalActiveCouriers: number;
}

// Initial mock state
let inMemoryOffer: CourierOfferVM | null = {
  ...mockCourierOffer,
  expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  secondsRemaining: 60,
};

let inMemoryActiveDelivery: {
  offer: CourierOfferVM;
  phase: CourierDeliveryPhase;
} | null = null;

let inMemoryEarningsToday = 14200;
let inMemoryCompletedCount = 6;

const completedDeliveriesSeed: CompletedDelivery[] = [
  {
    id: 'comp-1',
    orderNumber: 9382,
    merchantName: 'Pizza Palace',
    customerZone: 'Recoleta (1.8 km)',
    distanceKm: 1.8,
    timeAgo: 'Hace 32 min',
    payment: { amount: 2650, currency: 'ARS' },
    tip: { amount: 400, currency: 'ARS' },
    icon: 'local_pizza',
  },
  {
    id: 'comp-2',
    orderNumber: 9370,
    merchantName: 'Sushi House & Wok',
    customerZone: 'Retiro (2.4 km)',
    distanceKm: 2.4,
    timeAgo: 'Hace 1h 10m',
    payment: { amount: 3100, currency: 'ARS' },
    tip: { amount: 600, currency: 'ARS' },
    icon: 'lunch_dining',
  },
];

let inMemoryCompletedList: CompletedDelivery[] = [...completedDeliveriesSeed];

export const courierService = {
  async getCurrentOffer(): Promise<CourierOfferVM | null> {
    return inMemoryOffer;
  },

  async acceptOffer(offerId: string): Promise<{ success: boolean; error?: string }> {
    if (!inMemoryOffer || inMemoryOffer.id !== offerId) {
      return { success: false, error: 'La oferta ya no está disponible o ha expirado.' };
    }

    inMemoryActiveDelivery = {
      offer: inMemoryOffer,
      phase: 'TO_MERCHANT',
    };
    inMemoryOffer = null;

    return { success: true };
  },

  async rejectOffer(offerId: string): Promise<{ success: boolean }> {
    if (inMemoryOffer && inMemoryOffer.id === offerId) {
      inMemoryOffer = null;
    }
    return { success: true };
  },

  async getActiveDelivery() {
    return inMemoryActiveDelivery;
  },

  async advanceActiveDeliveryPhase(): Promise<CourierDeliveryPhase | null> {
    if (!inMemoryActiveDelivery) return null;

    if (inMemoryActiveDelivery.phase === 'TO_MERCHANT') {
      inMemoryActiveDelivery.phase = 'AT_MERCHANT';
      return 'AT_MERCHANT';
    }

    if (inMemoryActiveDelivery.phase === 'AT_MERCHANT') {
      inMemoryActiveDelivery.phase = 'TO_CUSTOMER';
      return 'TO_CUSTOMER';
    }

    if (inMemoryActiveDelivery.phase === 'TO_CUSTOMER') {
      // Complete delivery
      const completedOffer = inMemoryActiveDelivery.offer;
      const totalEarned =
        completedOffer.guaranteedPayment.amount + completedOffer.tip.amount;

      inMemoryEarningsToday += totalEarned;
      inMemoryCompletedCount += 1;

      inMemoryCompletedList = [
        {
          id: `comp-${Date.now()}`,
          orderNumber: completedOffer.orderNumber,
          merchantName: completedOffer.merchantName,
          customerZone: `${completedOffer.customerZone} (${completedOffer.distanceKm} km)`,
          distanceKm: completedOffer.distanceKm,
          timeAgo: 'Recién completado',
          payment: completedOffer.guaranteedPayment,
          tip: completedOffer.tip,
          icon: 'sports_motorsports',
        },
        ...inMemoryCompletedList,
      ];

      inMemoryActiveDelivery = null;
      return 'DELIVERED';
    }

    return null;
  },

  async getTodayStats() {
    return {
      earningsToday: inMemoryEarningsToday,
      completedDeliveriesCount: inMemoryCompletedCount,
    };
  },

  async getTodayCompletedList(): Promise<CompletedDelivery[]> {
    return [...inMemoryCompletedList];
  },

  async getRewardsPool(): Promise<RewardsPoolData> {
    return {
      currentPool: { amount: 51500, currency: 'ARS' },
      todayGrowth: { amount: 5200, currency: 'ARS' },
      nextMilestone: { amount: 100000, currency: 'ARS' },
      maxPoolCap: { amount: 175000, currency: 'ARS' },
      periodLabel: 'Octubre 2026',
      courierRankPosition: 4,
      totalActiveCouriers: 42,
    };
  },

  // Helper to generate a new offer for demo/testing
  resetDemoOffer() {
    inMemoryOffer = {
      ...mockCourierOffer,
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
      secondsRemaining: 60,
    };
    inMemoryActiveDelivery = null;
  },
};
