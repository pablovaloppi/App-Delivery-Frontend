/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartItem, MoneyAmount, OrderStatus, OrderViewModel } from '../../types';
import { calculateCartTotals } from '../../utils/cartCalculations';

export interface CreateOrderRequest {
  merchantId: string;
  items: {
    productId: string;
    quantity: number;
    selectedOptions?: {
      size?: string;
      extras?: string[];
    };
    notes?: string;
  }[];
  deliveryAddressId: string;
  deliveryType: 'platform' | 'merchant' | 'pickup';
  paymentMethod: 'card' | 'mercadopago' | 'cash';
  tipAmount: number;
  couponCode?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: {
    requestId: string;
    serverTime: string;
  };
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
}

/**
 * Order service adapter. Sends checkout requests and delegates price calculation
 * and state transitions to the server authority.
 */
export const orderService = {
  /**
   * Submit an order for creation.
   * Simulates server validation and authoritative calculation while maintaining API contract envelope.
   */
  async createOrder(
    req: CreateOrderRequest,
    rawCartItems: CartItem[],
    deliveryFee: number,
  ): Promise<ApiResponse<OrderViewModel>> {
    // Artificial latency for realistic server confirmation & double-submit test
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!req.items || req.items.length === 0) {
      return {
        data: null,
        meta: { requestId: `req-${Date.now()}`, serverTime: new Date().toISOString() },
        error: {
          code: 'CART_EMPTY',
          message: 'El carrito no contiene artículos para procesar.',
        },
      };
    }

    if (!req.deliveryAddressId) {
      return {
        data: null,
        meta: { requestId: `req-${Date.now()}`, serverTime: new Date().toISOString() },
        error: {
          code: 'INVALID_ADDRESS',
          message: 'Debes seleccionar una dirección de entrega válida.',
        },
      };
    }

    // Backend authoritative calculation
    const couponDiscount = req.couponCode === 'PIZZA2000' ? 2000 : 0;
    const totals = calculateCartTotals(
      rawCartItems,
      deliveryFee,
      10000,
      req.tipAmount,
      couponDiscount,
    );

    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderViewModel = {
      id: `ord-${newOrderNumber}`,
      orderNumber: newOrderNumber,
      merchantId: req.merchantId,
      merchantName: 'Pizzería Napolitana Gourmet',
      customerId: 'usr-customer-1',
      status: 'PENDING',
      deliveryType: req.deliveryType,
      items: rawCartItems.map((item) => ({
        productId: item.product.id,
        name: `${item.product.name}${
          item.selectedOptions?.size ? ` (${item.selectedOptions.size})` : ''
        }`,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: {
          amount: item.product.price.amount * item.quantity,
          currency: 'ARS',
        },
        notes: item.notes,
      })),
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      tip: totals.tip,
      discount: totals.discount,
      total: totals.total,
      deliveryAddress: {
        id: req.deliveryAddressId,
        label: 'Casa',
        street: 'Av. Corrientes',
        number: '1234',
        apartment: 'Piso 4 B',
        city: 'CABA',
        instructions: 'Tocar timbre 4B (interfono directo)',
        isDefault: true,
      },
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-35 min',
    };

    return {
      data: newOrder,
      meta: { requestId: `req-${Date.now()}`, serverTime: new Date().toISOString() },
      error: null,
    };
  },
};
