/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartItemPrice, calculateCartTotals } from './cartCalculations';
import { CartItem } from '../types';

test('calculateCartItemPrice calculates base price with quantity', () => {
  const price = calculateCartItemPrice(12500, 0, [], 2);
  assert.equal(price, 25000);
});

test('calculateCartItemPrice handles size adjustment and extras', () => {
  // Mediana 12500 + Extra Mozzarella 1500 = 14000
  const price = calculateCartItemPrice(12500, 12500, [1500], 1);
  assert.equal(price, 14000);
});

test('calculateCartTotals calculates subtotal, tip, delivery fee and discount correctly', () => {
  const mockItem: CartItem = {
    product: {
      id: 'prod-1',
      merchantId: 'merch-1',
      name: 'Pizza Margherita Especial',
      description: 'Masa madre',
      price: { amount: 12500, currency: 'ARS' },
      imageUrl: '',
      category: 'Populares',
      isAvailable: true,
    },
    quantity: 1,
    selectedOptions: {
      size: 'Mediana',
      extras: ['Extra Mozzarella (+$1.500 ARS)'],
    },
  };

  const totals = calculateCartTotals([mockItem], 1450, 20000, 1000, 2000);

  // Subtotal = 14000 (12500 + 1500)
  assert.equal(totals.subtotal.amount, 14000);
  assert.equal(totals.deliveryFee.amount, 1450);
  assert.equal(totals.tip.amount, 1000);
  assert.equal(totals.discount.amount, 2000);
  // Total = 14000 + 1450 + 1000 - 2000 = 14450
  assert.equal(totals.total.amount, 14450);
});

test('calculateCartTotals applies free delivery when threshold reached', () => {
  const mockItem: CartItem = {
    product: {
      id: 'prod-1',
      merchantId: 'merch-1',
      name: 'Pizza Familiar',
      description: 'Masa madre',
      price: { amount: 16900, currency: 'ARS' },
      imageUrl: '',
      category: 'Populares',
      isAvailable: true,
    },
    quantity: 2, // 33800
  };

  const totals = calculateCartTotals([mockItem], 1450, 10000, 0, 0);

  assert.equal(totals.subtotal.amount, 33800);
  assert.equal(totals.deliveryFee.amount, 0); // Free delivery applied
  assert.equal(totals.total.amount, 33800);
});
