/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLoyaltyPoints,
  getLoyaltyTier,
  calculateTierProgress,
  redeemCoupon,
  aggregateReviewStats,
  filterNotifications,
  countUnreadNotifications,
  getNextSimulationStep,
  SIMULATION_STEPS,
} from './ecosystemLogic';
import { AppNotification, LoyaltyCoupon, ReviewFeedback } from '../types/ecosystem';

test('calculateLoyaltyPoints calculates 1 point per $100 ARS spent and applies multiplier', () => {
  // $15,300 ARS -> 153 points base
  assert.equal(calculateLoyaltyPoints(15300), 153);
  // With multiplier 1.1x -> 153 * 1.1 = 168.3 -> 168
  assert.equal(calculateLoyaltyPoints(15300, 1.1), 168);
  // Zero or negative total
  assert.equal(calculateLoyaltyPoints(0), 0);
  assert.equal(calculateLoyaltyPoints(-500), 0);
  // Sub-$100 ARS purchases
  assert.equal(calculateLoyaltyPoints(99), 0);
  assert.equal(calculateLoyaltyPoints(199), 1);
});

test('getLoyaltyTier assigns correct tier based on threshold points', () => {
  assert.equal(getLoyaltyTier(0).tier, 'VECINO_NUEVO');
  assert.equal(getLoyaltyTier(250).tier, 'VECINO_NUEVO');
  assert.equal(getLoyaltyTier(499).tier, 'VECINO_NUEVO');
  assert.equal(getLoyaltyTier(500).tier, 'VECINO_HABITUAL');
  assert.equal(getLoyaltyTier(1499).tier, 'VECINO_HABITUAL');
  assert.equal(getLoyaltyTier(1500).tier, 'VECINO_NOTABLE');
  assert.equal(getLoyaltyTier(4000).tier, 'VECINO_NOTABLE');
  // Negative points clamp to 0
  assert.equal(getLoyaltyTier(-50).tier, 'VECINO_NUEVO');
});

test('calculateTierProgress calculates percentage progress towards next tier correctly', () => {
  // Start of Vecino Nuevo: 0 pts, next is 500
  const progress0 = calculateTierProgress(0);
  assert.equal(progress0.currentTier.tier, 'VECINO_NUEVO');
  assert.equal(progress0.nextTier?.tier, 'VECINO_HABITUAL');
  assert.equal(progress0.pointsToNext, 500);
  assert.equal(progress0.progressPercent, 0);

  // Mid Vecino Nuevo: 250 pts
  const progressMid = calculateTierProgress(250);
  assert.equal(progressMid.pointsToNext, 250);
  assert.equal(progressMid.progressPercent, 50);

  // Vecino Notable (top tier)
  const progressTop = calculateTierProgress(2000);
  assert.equal(progressTop.currentTier.tier, 'VECINO_NOTABLE');
  assert.equal(progressTop.nextTier, null);
  assert.equal(progressTop.pointsToNext, 0);
  assert.equal(progressTop.progressPercent, 100);
});

test('redeemCoupon prevents overdraft and decrements balance when valid', () => {
  const coupon: LoyaltyCoupon = {
    id: 'coup-1',
    code: 'PIZZA20',
    title: '$1.500 OFF en Pizzas',
    description: 'Descuento barrial',
    pointsCost: 300,
    discountAmount: { amount: 1500, currency: 'ARS' },
    minSpend: { amount: 6000, currency: 'ARS' },
  };

  // Insufficient points
  const failResult = redeemCoupon(250, coupon);
  assert.equal(failResult.success, false);
  assert.equal(failResult.newPoints, 250);
  assert.ok(failResult.error?.includes('insuficientes'));

  // Sufficient points
  const successResult = redeemCoupon(500, coupon);
  assert.equal(successResult.success, true);
  assert.equal(successResult.newPoints, 200);
});

test('aggregateReviewStats computes average ratings, star distribution, and frequent tags', () => {
  // Empty list
  const emptyStats = aggregateReviewStats([]);
  assert.equal(emptyStats.averageRating, 5.0);
  assert.equal(emptyStats.totalCount, 0);
  assert.equal(emptyStats.topTags.length, 0);

  const sampleReviews: ReviewFeedback[] = [
    {
      id: 'rev-1',
      orderId: 'ord-101',
      orderNumber: 101,
      targetType: 'merchant',
      targetId: 'merch-1',
      targetName: 'Pizzería Napolitana',
      authorId: 'usr-1',
      authorName: 'Martín',
      rating: 5,
      tags: ['Comida caliente', 'Empaque impecable'],
      createdAt: '2026-10-21T20:00:00Z',
    },
    {
      id: 'rev-2',
      orderId: 'ord-102',
      orderNumber: 102,
      targetType: 'merchant',
      targetId: 'merch-1',
      targetName: 'Pizzería Napolitana',
      authorId: 'usr-2',
      authorName: 'Lucía',
      rating: 4,
      tags: ['Comida caliente', 'Puntual'],
      createdAt: '2026-10-21T21:00:00Z',
    },
  ];

  const stats = aggregateReviewStats(sampleReviews);
  assert.equal(stats.totalCount, 2);
  assert.equal(stats.averageRating, 4.5);
  assert.equal(stats.ratingDistribution[5], 1);
  assert.equal(stats.ratingDistribution[4], 1);
  assert.equal(stats.ratingDistribution[1], 0);

  // 'Comida caliente' appeared twice, should be top tag
  assert.equal(stats.topTags[0].tag, 'Comida caliente');
  assert.equal(stats.topTags[0].count, 2);
});

test('filterNotifications and countUnreadNotifications filter by role and read status', () => {
  const notifications: AppNotification[] = [
    {
      id: 'n-1',
      title: 'Comanda lista',
      message: 'Comanda #1042 lista',
      targetRole: 'customer',
      type: 'ORDER_UPDATE',
      timestamp: '2026-10-22T19:00:00Z',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Nueva oferta',
      message: 'Viaje disponible $2.400',
      targetRole: 'courier',
      type: 'NEW_OFFER',
      timestamp: '2026-10-22T19:05:00Z',
      read: true,
    },
    {
      id: 'n-3',
      title: 'Alerta de Lluvia',
      message: 'Lluvia en CABA',
      targetRole: 'all',
      type: 'WEATHER_ALERT',
      timestamp: '2026-10-22T19:10:00Z',
      read: false,
    },
  ];

  // Count unread for customer: n-1 (customer) + n-3 (all) = 2
  assert.equal(countUnreadNotifications(notifications, 'customer'), 2);
  // Count unread for courier: n-3 (all) = 1 (n-2 is already read)
  assert.equal(countUnreadNotifications(notifications, 'courier'), 1);

  // Filter unread only
  const unreadOnly = filterNotifications(notifications, { unreadOnly: true });
  assert.equal(unreadOnly.length, 2);

  // Filter courier role
  const courierItems = filterNotifications(notifications, { role: 'courier' });
  assert.equal(courierItems.length, 2); // n-2 (courier) + n-3 (all)
});

test('getNextSimulationStep cycles smoothly through full lifecycle steps', () => {
  assert.equal(SIMULATION_STEPS.length, 6);

  const step0 = getNextSimulationStep(0);
  assert.equal(step0.nextIndex, 1);
  assert.equal(step0.step.orderStatus, 'ACCEPTED');
  assert.equal(step0.isComplete, false);

  const stepLast = getNextSimulationStep(5);
  assert.equal(stepLast.nextIndex, 0);
  assert.equal(stepLast.step.orderStatus, 'PENDING');
  assert.equal(stepLast.isComplete, true);
});
