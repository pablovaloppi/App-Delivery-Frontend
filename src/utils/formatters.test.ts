/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMoney,
  getOrderStatusLabel,
  getOrderStatusBadgeVariant,
  formatDistance,
  formatDurationMinutes,
} from './formatters';

test('formatMoney formats integers in Argentine ARS format', () => {
  const formattedWithCurrency = formatMoney(12500);
  assert.equal(formattedWithCurrency, '$12.500 ARS');

  const formattedObject = formatMoney({ amount: 19500, currency: 'ARS' });
  assert.equal(formattedObject, '$19.500 ARS');

  const formattedWithoutCurrency = formatMoney(5400, false);
  assert.equal(formattedWithoutCurrency, '$5.400');
});

test('getOrderStatusLabel returns human-friendly Spanish labels', () => {
  assert.equal(getOrderStatusLabel('PENDING'), 'Pendiente de confirmación');
  assert.equal(getOrderStatusLabel('ACCEPTED'), 'Confirmado');
  assert.equal(getOrderStatusLabel('PREPARING'), 'En preparación');
  assert.equal(getOrderStatusLabel('READY_FOR_PICKUP'), 'Listo para retiro');
  assert.equal(getOrderStatusLabel('ON_THE_WAY'), 'En camino');
  assert.equal(getOrderStatusLabel('DELIVERED'), 'Entregado');
  assert.equal(getOrderStatusLabel('CANCELLED'), 'Cancelado');
});

test('getOrderStatusBadgeVariant returns semantic tokens for delivered, active and cancelled', () => {
  const delivered = getOrderStatusBadgeVariant('DELIVERED');
  assert.equal(delivered.icon, 'check_circle');

  const onTheWay = getOrderStatusBadgeVariant('ON_THE_WAY');
  assert.equal(onTheWay.icon, 'two_wheeler');

  const cancelled = getOrderStatusBadgeVariant('CANCELLED');
  assert.equal(cancelled.icon, 'cancel');
});

test('formatDistance handles meters and kilometers', () => {
  assert.equal(formatDistance(0.45), '450 m');
  assert.equal(formatDistance(1.2), '1,2 km');
  assert.equal(formatDistance(3.0), '3,0 km');
});

test('formatDurationMinutes formats range or single estimate', () => {
  assert.equal(formatDurationMinutes(20, 30), '20-30 min');
  assert.equal(formatDurationMinutes(15), '~15 min');
});
