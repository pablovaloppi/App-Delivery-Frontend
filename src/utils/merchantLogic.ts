/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderStatus, OrderViewModel } from '../types';

export type MerchantPipelineTab = 'new' | 'kitchen' | 'ready' | 'history';

/**
 * Validates whether a requested order status transition is allowed for a Merchant.
 */
export function isValidMerchantTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
): boolean {
  switch (currentStatus) {
    case 'PENDING':
      return targetStatus === 'ACCEPTED' || targetStatus === 'REJECTED';
    case 'ACCEPTED':
      return targetStatus === 'PREPARING';
    case 'PREPARING':
      return targetStatus === 'READY_FOR_PICKUP';
    case 'READY_FOR_PICKUP':
      // Handoff to courier (usually triggered by courier or merchant handoff confirmation)
      return targetStatus === 'PICKED_UP';
    default:
      return false;
  }
}

/**
 * Categorizes orders into the merchant dashboard pipeline tabs.
 */
export function filterOrdersByPipelineTab(
  orders: OrderViewModel[],
  tab: MerchantPipelineTab,
): OrderViewModel[] {
  switch (tab) {
    case 'new':
      return orders.filter((o) => o.status === 'PENDING');
    case 'kitchen':
      return orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING');
    case 'ready':
      return orders.filter((o) => o.status === 'READY_FOR_PICKUP');
    case 'history':
      return orders.filter(
        (o) =>
          o.status === 'PICKED_UP' ||
          o.status === 'ON_THE_WAY' ||
          o.status === 'DELIVERED' ||
          o.status === 'CANCELLED' ||
          o.status === 'REJECTED',
      );
    default:
      return orders;
  }
}

/**
 * Calculates daily sales and operational performance metrics.
 */
export function calculateMerchantMetrics(orders: OrderViewModel[]): {
  totalSales: number;
  newCount: number;
  kitchenCount: number;
  readyCount: number;
  completedCount: number;
  averageTicket: number;
} {
  const newCount = orders.filter((o) => o.status === 'PENDING').length;
  const kitchenCount = orders.filter(
    (o) => o.status === 'ACCEPTED' || o.status === 'PREPARING',
  ).length;
  const readyCount = orders.filter((o) => o.status === 'READY_FOR_PICKUP').length;
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED');

  const validSalesOrders = orders.filter(
    (o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED',
  );

  const totalSales = validSalesOrders.reduce((sum, o) => sum + o.subtotal.amount, 0);
  const averageTicket =
    validSalesOrders.length > 0 ? Math.round(totalSales / validSalesOrders.length) : 0;

  return {
    totalSales,
    newCount,
    kitchenCount,
    readyCount,
    completedCount: completedOrders.length,
    averageTicket,
  };
}
