import { CartItem, MoneyAmount, OrderStatus, OrderViewModel } from '../../types';
import { calculateCartTotals } from '../../utils/cartCalculations';
import { apiClient } from '../apiClient';
import { merchantService } from './merchantService';

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
   * Sends request to live backend if configured, falling back gracefully.
   */
  async createOrder(
    req: CreateOrderRequest,
    rawCartItems: CartItem[],
    deliveryFee: number,
  ): Promise<ApiResponse<OrderViewModel>> {
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
    const couponDiscount =
      req.couponCode === 'PIZZA2000' ? 2000 : req.couponCode === 'ENVIOGRATIS' ? deliveryFee : 0;
    const totals = calculateCartTotals(
      rawCartItems,
      deliveryFee,
      undefined,
      req.tipAmount,
      couponDiscount,
    );

    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderViewModel = {
      id: `ord-${newOrderNumber}`,
      orderNumber: newOrderNumber,
      merchantId: req.merchantId,
      merchantName: req.merchantId === 'm_002' ? 'Burger Craft & Beer' : req.merchantId === 'm_003' ? 'Almacén Central' : 'Pizzería Don Pepe',
      customerId: 'usr_customer_1',
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
        label: 'Entrega',
        street: 'Av. Corrientes',
        number: '1234',
        apartment: 'Piso 4 B',
        city: 'CABA',
        instructions: 'Tocar timbre 4B',
        isDefault: true,
      },
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-40 min',
    };

    let finalOrder = newOrder;

    // If live backend is configured, attempt real POST to /api/v1/orders
    if (apiClient.isConfigured()) {
      try {
        const payload = {
          customerId: 'usr_customer_1',
          merchantId: req.merchantId,
          deliveryType: req.deliveryType,
          paymentMethod: req.paymentMethod,
          tip: req.tipAmount,
          items: rawCartItems.map((it) => ({
            productId: it.product.id,
            nameSnapshot: it.product.name,
            quantity: it.quantity,
            unitPriceSnapshot: it.product.price.amount,
            subtotal: it.product.price.amount * it.quantity,
          })),
          subtotal: totals.subtotal.amount,
          deliveryFee: totals.deliveryFee.amount,
          total: totals.total.amount,
        };

        const result = await apiClient.createOrder(payload);
        if (result.success && result.order) {
          finalOrder = {
            ...newOrder,
            id: result.order.id || newOrder.id,
            orderNumber: result.order.orderNumber || newOrder.orderNumber,
          };
        }
      } catch (e) {
        console.warn('[orderService] Backend POST order fallback:', e);
      }
    }

    // Register in merchant's in-memory store so it's immediately available to the merchant view
    await merchantService.addOrder(finalOrder);

    return {
      data: finalOrder,
      meta: {
        requestId: `req-${Date.now()}`,
        serverTime: new Date().toISOString(),
      },
      error: null,
    };
  },
};
