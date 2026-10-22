/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidMerchantTransition,
  filterOrdersByPipelineTab,
  calculateMerchantMetrics,
} from './merchantLogic';
import { OrderViewModel } from '../types';

test('isValidMerchantTransition enforces strictly authorized merchant state machine transitions', () => {
  // PENDING can transition to ACCEPTED or REJECTED
  assert.equal(isValidMerchantTransition('PENDING', 'ACCEPTED'), true);
  assert.equal(isValidMerchantTransition('PENDING', 'REJECTED'), true);
  assert.equal(isValidMerchantTransition('PENDING', 'DELIVERED'), false);

  // ACCEPTED can transition to PREPARING
  assert.equal(isValidMerchantTransition('ACCEPTED', 'PREPARING'), true);
  assert.equal(isValidMerchantTransition('ACCEPTED', 'READY_FOR_PICKUP'), false);

  // PREPARING can transition to READY_FOR_PICKUP
  assert.equal(isValidMerchantTransition('PREPARING', 'READY_FOR_PICKUP'), true);
  assert.equal(isValidMerchantTransition('PREPARING', 'DELIVERED'), false);

  // Completed or cancelled orders cannot be modified by merchant
  assert.equal(isValidMerchantTransition('DELIVERED', 'PREPARING'), false);
  assert.equal(isValidMerchantTransition('CANCELLED', 'ACCEPTED'), false);
});

test('filterOrdersByPipelineTab correctly groups orders into pipeline columns', () => {
  const dummyOrders: Partial<OrderViewModel>[] = [
    { id: '1', status: 'PENDING' },
    { id: '2', status: 'ACCEPTED' },
    { id: '3', status: 'PREPARING' },
    { id: '4', status: 'READY_FOR_PICKUP' },
    { id: '5', status: 'DELIVERED' },
    { id: '6', status: 'CANCELLED' },
  ];

  const newOrders = filterOrdersByPipelineTab(dummyOrders as OrderViewModel[], 'new');
  assert.equal(newOrders.length, 1);
  assert.equal(newOrders[0].id, '1');

  const kitchenOrders = filterOrdersByPipelineTab(dummyOrders as OrderViewModel[], 'kitchen');
  assert.equal(kitchenOrders.length, 2);

  const readyOrders = filterOrdersByPipelineTab(dummyOrders as OrderViewModel[], 'ready');
  assert.equal(readyOrders.length, 1);
  assert.equal(readyOrders[0].id, '4');

  const historyOrders = filterOrdersByPipelineTab(dummyOrders as OrderViewModel[], 'history');
  assert.equal(historyOrders.length, 2);
});

test('calculateMerchantMetrics aggregates operational counts and total sales', () => {
  const dummyOrders: Partial<OrderViewModel>[] = [
    { id: '1', status: 'PENDING', subtotal: { amount: 10000, currency: 'ARS' } },
    { id: '2', status: 'PREPARING', subtotal: { amount: 15000, currency: 'ARS' } },
    { id: '3', status: 'DELIVERED', subtotal: { amount: 20000, currency: 'ARS' } },
    { id: '4', status: 'CANCELLED', subtotal: { amount: 5000, currency: 'ARS' } },
  ];

  const metrics = calculateMerchantMetrics(dummyOrders as OrderViewModel[]);

  assert.equal(metrics.newCount, 1);
  assert.equal(metrics.kitchenCount, 1);
  assert.equal(metrics.completedCount, 1);
  // Total sales excludes CANCELLED (10000 + 15000 + 20000 = 45000)
  assert.equal(metrics.totalSales, 45000);
  // Average ticket: 45000 / 3 = 15000
  assert.equal(metrics.averageTicket, 15000);
});
