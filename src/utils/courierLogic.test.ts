/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSecondsRemaining,
  getNextCourierDeliveryPhase,
  calculateCourierTotalPayout,
} from './courierLogic';

test('calculateSecondsRemaining returns remaining seconds and clamps to 0 when expired', () => {
  const now = 1000000;
  const in30s = new Date(now + 30 * 1000).toISOString();
  assert.equal(calculateSecondsRemaining(in30s, now), 30);

  const past = new Date(now - 10 * 1000).toISOString();
  assert.equal(calculateSecondsRemaining(past, now), 0);
});

test('getNextCourierDeliveryPhase strictly guides courier route progression', () => {
  assert.equal(getNextCourierDeliveryPhase('OFFER'), 'TO_MERCHANT');
  assert.equal(getNextCourierDeliveryPhase('TO_MERCHANT'), 'AT_MERCHANT');
  assert.equal(getNextCourierDeliveryPhase('AT_MERCHANT'), 'TO_CUSTOMER');
  assert.equal(getNextCourierDeliveryPhase('TO_CUSTOMER'), 'DELIVERED');
  assert.equal(getNextCourierDeliveryPhase('DELIVERED'), null);
});

test('calculateCourierTotalPayout guarantees 100% of tip goes directly to the courier', () => {
  // $2.400 base + $800 propina = $3.200 ARS
  assert.equal(calculateCourierTotalPayout(2400, 800), 3200);
  assert.equal(calculateCourierTotalPayout(2500, 0), 2500);
});
