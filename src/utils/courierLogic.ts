/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CourierDeliveryPhase =
  | 'OFFER'
  | 'TO_MERCHANT'
  | 'AT_MERCHANT'
  | 'TO_CUSTOMER'
  | 'DELIVERED';

/**
 * Calculates remaining seconds from an expiration ISO timestamp.
 */
export function calculateSecondsRemaining(expiresAtIso: string, currentTimeMs = Date.now()): number {
  const expiresAtMs = new Date(expiresAtIso).getTime();
  const diffSec = Math.floor((expiresAtMs - currentTimeMs) / 1000);
  return Math.max(0, diffSec);
}

/**
 * Validates next courier operational transition.
 */
export function getNextCourierDeliveryPhase(
  currentPhase: CourierDeliveryPhase,
): CourierDeliveryPhase | null {
  switch (currentPhase) {
    case 'OFFER':
      return 'TO_MERCHANT';
    case 'TO_MERCHANT':
      return 'AT_MERCHANT';
    case 'AT_MERCHANT':
      return 'TO_CUSTOMER';
    case 'TO_CUSTOMER':
      return 'DELIVERED';
    case 'DELIVERED':
    default:
      return null;
  }
}

/**
 * Calculates guaranteed total payout for courier (base delivery + 100% tip).
 */
export function calculateCourierTotalPayout(baseFee: number, tip: number): number {
  return Math.max(0, baseFee) + Math.max(0, tip);
}
