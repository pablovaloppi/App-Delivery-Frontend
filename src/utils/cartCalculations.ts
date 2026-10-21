/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartItem, MoneyAmount } from '../types';

export interface CartCalculationResult {
  itemsCount: number;
  subtotal: MoneyAmount;
  deliveryFee: MoneyAmount;
  tip: MoneyAmount;
  discount: MoneyAmount;
  total: MoneyAmount;
}

export function calculateCartItemPrice(
  basePrice: number,
  sizePriceAdjustment: number = 0,
  extrasPrices: number[] = [],
  quantity: number = 1,
): number {
  const unitPrice = (sizePriceAdjustment > 0 ? sizePriceAdjustment : basePrice) +
    extrasPrices.reduce((acc, curr) => acc + curr, 0);
  return Math.max(0, unitPrice * Math.max(1, quantity));
}

export function calculateCartTotals(
  items: CartItem[],
  deliveryFeeAmount: number,
  freeDeliveryThresholdAmount: number | undefined,
  tipAmount: number,
  couponDiscountAmount: number = 0,
): CartCalculationResult {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalAmount = items.reduce((acc, item) => {
    let sizeAdj = 0;
    if (item.selectedOptions?.size === 'Chica') sizeAdj = 9800;
    else if (item.selectedOptions?.size === 'Mediana') sizeAdj = 12500;
    else if (item.selectedOptions?.size === 'Familiar') sizeAdj = 16900;

    const extrasPrices = (item.selectedOptions?.extras || []).map((extra) => {
      if (extra.includes('1.500')) return 1500;
      if (extra.includes('1.200')) return 1200;
      if (extra.includes('2.200')) return 2200;
      if (extra.includes('900')) return 900;
      return 0;
    });

    const itemPrice = calculateCartItemPrice(
      item.product.price.amount,
      sizeAdj,
      extrasPrices,
      item.quantity,
    );
    return acc + itemPrice;
  }, 0);

  // Free delivery threshold check
  const isFreeDelivery =
    freeDeliveryThresholdAmount !== undefined &&
    freeDeliveryThresholdAmount > 0 &&
    subtotalAmount >= freeDeliveryThresholdAmount;

  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFeeAmount;
  const effectiveDiscount = Math.min(couponDiscountAmount, subtotalAmount);
  const totalAmount = Math.max(
    0,
    subtotalAmount + effectiveDeliveryFee + tipAmount - effectiveDiscount,
  );

  return {
    itemsCount,
    subtotal: { amount: subtotalAmount, currency: 'ARS' },
    deliveryFee: { amount: effectiveDeliveryFee, currency: 'ARS' },
    tip: { amount: tipAmount, currency: 'ARS' },
    discount: { amount: effectiveDiscount, currency: 'ARS' },
    total: { amount: totalAmount, currency: 'ARS' },
  };
}
