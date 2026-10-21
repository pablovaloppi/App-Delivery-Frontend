/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoneyAmount, OrderStatus } from '../types';

/**
 * Formats a monetary amount into Argentine Peso standard display ($12.500 ARS)
 */
export function formatMoney(amount: number | MoneyAmount, showCurrency = true): string {
  const value = typeof amount === 'number' ? amount : amount.amount;
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

  return showCurrency ? `$${formatted} ARS` : `$${formatted}`;
}

/**
 * Maps an order status code to an accessible Spanish label
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pendiente de confirmación';
    case 'ACCEPTED':
      return 'Confirmado';
    case 'PREPARING':
      return 'En preparación';
    case 'READY_FOR_PICKUP':
      return 'Listo para retiro';
    case 'ASSIGNED':
      return 'Cadete asignado';
    case 'PICKED_UP':
      return 'Retirado por cadete';
    case 'ON_THE_WAY':
      return 'En camino';
    case 'DELIVERED':
      return 'Entregado';
    case 'CANCELLED':
      return 'Cancelado';
    case 'REJECTED':
      return 'Rechazado';
    default:
      return status;
  }
}

/**
 * Returns the semantic badge style variants for a given order status
 */
export function getOrderStatusBadgeVariant(status: OrderStatus): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (status) {
    case 'DELIVERED':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: 'check_circle',
      };
    case 'ON_THE_WAY':
    case 'ASSIGNED':
    case 'PICKED_UP':
      return {
        bg: 'bg-[var(--brand-soft)]',
        text: 'text-[var(--brand)]',
        border: 'border-[var(--brand)]/30',
        icon: 'two_wheeler',
      };
    case 'PREPARING':
    case 'ACCEPTED':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'soup_kitchen',
      };
    case 'CANCELLED':
    case 'REJECTED':
      return {
        bg: 'bg-red-50 dark:bg-red-950/40',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        icon: 'cancel',
      };
    case 'PENDING':
    default:
      return {
        bg: 'bg-stone-100 dark:bg-stone-800',
        text: 'text-stone-700 dark:text-stone-300',
        border: 'border-stone-200 dark:border-stone-700',
        icon: 'schedule',
      };
  }
}

/**
 * Format distance in km or meters
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1).replace('.', ',')} km`;
}

/**
 * Format duration in minutes
 */
export function formatDurationMinutes(min: number, max?: number): string {
  if (max && max !== min) {
    return `${min}-${max} min`;
  }
  return `~${min} min`;
}
