/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppNotification,
  BadgeAchievement,
  LoyaltyCoupon,
  LoyaltyTierInfo,
  LoyaltyTierName,
  ReviewFeedback,
  SimulationStep,
} from '../types/ecosystem';
import { OrderStatus, UserRole } from '../types';

export const LOYALTY_TIERS: Record<LoyaltyTierName, LoyaltyTierInfo> = {
  VECINO_NUEVO: {
    tier: 'VECINO_NUEVO',
    label: 'Vecino Nuevo',
    minPoints: 0,
    maxPoints: 499,
    cashbackPercent: 5,
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    badgeIcon: 'person',
    perks: ['Acumulá 1 punto cada $100 ARS', '5% de beneficio en comercios barriales'],
  },
  VECINO_HABITUAL: {
    tier: 'VECINO_HABITUAL',
    label: 'Vecino Habitual',
    minPoints: 500,
    maxPoints: 1499,
    cashbackPercent: 10,
    colorClass: 'text-slate-700 bg-slate-100 border-slate-300',
    badgeIcon: 'military_tech',
    perks: ['10% de beneficio en puntos', '1 Envío Bonificado al mes', 'Soporte prioritario'],
  },
  VECINO_NOTABLE: {
    tier: 'VECINO_NOTABLE',
    label: 'Vecino Notable',
    minPoints: 1500,
    maxPoints: undefined,
    cashbackPercent: 15,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    badgeIcon: 'workspace_premium',
    perks: [
      '15% de beneficio en puntos',
      'Envíos gratis ilimitados en locales adheridos',
      'Descuentos exclusivos en empanadas y asado',
      'Acceso beta a nuevas funciones',
    ],
  },
};

/**
 * Calculates earned points for an order.
 * Standard rate: 1 point per $100 ARS.
 * Applied with tier multiplier (e.g. 1.0 for Nuevo, 1.1 for Habitual, 1.25 for Notable).
 */
export function calculateLoyaltyPoints(
  orderTotalAmount: number,
  tierMultiplier: number = 1.0
): number {
  if (orderTotalAmount <= 0) return 0;
  const basePoints = Math.floor(orderTotalAmount / 100);
  const totalPoints = Math.floor(basePoints * Math.max(1, tierMultiplier));
  return totalPoints;
}

/**
 * Determines which tier a user belongs to based on points.
 */
export function getLoyaltyTier(points: number): LoyaltyTierInfo {
  const safePoints = Math.max(0, points);
  if (safePoints >= LOYALTY_TIERS.VECINO_NOTABLE.minPoints) {
    return LOYALTY_TIERS.VECINO_NOTABLE;
  }
  if (safePoints >= LOYALTY_TIERS.VECINO_HABITUAL.minPoints) {
    return LOYALTY_TIERS.VECINO_HABITUAL;
  }
  return LOYALTY_TIERS.VECINO_NUEVO;
}

/**
 * Calculates progress towards the next tier.
 */
export function calculateTierProgress(points: number): {
  currentTier: LoyaltyTierInfo;
  nextTier: LoyaltyTierInfo | null;
  pointsToNext: number;
  progressPercent: number;
} {
  const safePoints = Math.max(0, points);
  const currentTier = getLoyaltyTier(safePoints);

  if (currentTier.tier === 'VECINO_NOTABLE') {
    return {
      currentTier,
      nextTier: null,
      pointsToNext: 0,
      progressPercent: 100,
    };
  }

  const nextTier =
    currentTier.tier === 'VECINO_NUEVO'
      ? LOYALTY_TIERS.VECINO_HABITUAL
      : LOYALTY_TIERS.VECINO_NOTABLE;

  const pointsIntoCurrentTier = safePoints - currentTier.minPoints;
  const tierSpan = (currentTier.maxPoints ?? nextTier.minPoints) - currentTier.minPoints + 1;
  const pointsToNext = Math.max(0, nextTier.minPoints - safePoints);
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsIntoCurrentTier / tierSpan) * 100)));

  return {
    currentTier,
    nextTier,
    pointsToNext,
    progressPercent,
  };
}

/**
 * Redeems a loyalty coupon with balance checks.
 */
export function redeemCoupon(
  currentPoints: number,
  coupon: LoyaltyCoupon
): { success: boolean; newPoints: number; error?: string } {
  if (currentPoints < coupon.pointsCost) {
    return {
      success: false,
      newPoints: currentPoints,
      error: `Puntos insuficientes. Necesitás ${coupon.pointsCost} pts y tenés ${currentPoints} pts.`,
    };
  }

  return {
    success: true,
    newPoints: currentPoints - coupon.pointsCost,
  };
}

/**
 * Aggregates review metrics: average star rating, rating distribution, and most common tags.
 */
export function aggregateReviewStats(reviews: ReviewFeedback[]): {
  averageRating: number;
  totalCount: number;
  ratingDistribution: Record<number, number>;
  topTags: { tag: string; count: number }[];
} {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const tagCounts: Record<string, number> = {};

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalCount: 0,
      ratingDistribution: distribution,
      topTags: [],
    };
  }

  let totalStars = 0;
  for (const r of reviews) {
    const clampedRating = Math.max(1, Math.min(5, Math.round(r.rating)));
    distribution[clampedRating] = (distribution[clampedRating] || 0) + 1;
    totalStars += r.rating;

    if (r.tags && Array.isArray(r.tags)) {
      for (const t of r.tags) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }
  }

  const averageRating = Number((totalStars / reviews.length).toFixed(1));

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    averageRating,
    totalCount: reviews.length,
    ratingDistribution: distribution,
    topTags,
  };
}

/**
 * Filters notifications by target role and unread state.
 */
export function filterNotifications(
  notifications: AppNotification[],
  filter: {
    role?: UserRole | 'all';
    unreadOnly?: boolean;
    type?: string;
  }
): AppNotification[] {
  return notifications.filter((item) => {
    if (filter.unreadOnly && item.read) {
      return false;
    }
    if (filter.role && filter.role !== 'all') {
      if (item.targetRole !== 'all' && item.targetRole !== filter.role) {
        return false;
      }
    }
    if (filter.type && filter.type !== 'ALL' && item.type !== filter.type) {
      return false;
    }
    return true;
  });
}

/**
 * Counts unread notifications relevant to a role.
 */
export function countUnreadNotifications(
  notifications: AppNotification[],
  role?: UserRole
): number {
  return notifications.filter((n) => {
    if (n.read) return false;
    if (!role) return true;
    return n.targetRole === 'all' || n.targetRole === role;
  }).length;
}

/**
 * Full End-to-End simulation steps definition.
 */
export const SIMULATION_STEPS: SimulationStep[] = [
  {
    stepIndex: 0,
    role: 'customer',
    title: 'Pedido Creado por Cliente',
    description: 'El cliente Martín envía su pedido de Pizza Napolitana con propina del 100% para el cadete.',
    orderStatus: 'PENDING',
    badgeText: '1. Pedido Emitido',
  },
  {
    stepIndex: 1,
    role: 'merchant',
    title: 'Aceptación en Cocina (KDS)',
    description: 'La cocina de la pizzería escucha el timbre sonoro y acepta la comanda #1043.',
    orderStatus: 'ACCEPTED',
    badgeText: '2. Comanda Aceptada',
  },
  {
    stepIndex: 2,
    role: 'merchant',
    title: 'En Preparación / Horno',
    description: 'El maestro pizzero estira la masa madre y coloca la pizza al horno de leña.',
    orderStatus: 'PREPARING',
    badgeText: '3. Al Horno',
  },
  {
    stepIndex: 3,
    role: 'courier',
    title: 'Comanda Lista y Asignación',
    description: 'Comida empaquetada. El cadete Carlos acepta la oferta con tarifa garantizada y retira el paquete.',
    orderStatus: 'READY_FOR_PICKUP',
    badgeText: '4. Listo para Retiro',
  },
  {
    stepIndex: 4,
    role: 'courier',
    title: 'Cadete En Camino por CABA',
    description: 'Carlos viaja por Av. Corrientes en moto. Mapa interactivo muestra ETA y telemetría en vivo.',
    orderStatus: 'ON_THE_WAY',
    badgeText: '5. En Camino',
  },
  {
    stepIndex: 5,
    role: 'customer',
    title: 'Entrega Exitosa y Calificación Dual',
    description: 'Carlos toma foto comprobante de entrega. Cliente recibe notificación, califica con 5 estrellas y suma Puntos Porteños.',
    orderStatus: 'DELIVERED',
    badgeText: '6. Entregado & Calificado',
  },
];

/**
 * Gets the next simulation step given a current step index.
 */
export function getNextSimulationStep(currentStepIndex: number): {
  nextIndex: number;
  step: SimulationStep;
  isComplete: boolean;
} {
  const nextIndex = (currentStepIndex + 1) % SIMULATION_STEPS.length;
  const isComplete = nextIndex === 0 && currentStepIndex === SIMULATION_STEPS.length - 1;
  return {
    nextIndex,
    step: SIMULATION_STEPS[nextIndex],
    isComplete,
  };
}
