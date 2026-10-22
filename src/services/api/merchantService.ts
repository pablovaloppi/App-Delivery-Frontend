/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderStatus, OrderViewModel, Product } from '../../types';
import { mockProducts } from '../../data/mockData';
import { isValidMerchantTransition } from '../../utils/merchantLogic';

export interface StoreSettings {
  isOpen: boolean;
  estimatedPrepTimeMin: number;
  estimatedPrepTimeMax: number;
  acceptsAutomatedDispatch: boolean;
  alertSoundEnabled: boolean;
  autoAcceptOrders: boolean;
}

// Initial mock orders for the merchant kitchen pipeline
const initialMerchantOrders: OrderViewModel[] = [
  {
    id: 'ord-1045',
    orderNumber: 1045,
    merchantId: 'merch-1',
    merchantName: 'Pizzería Napolitana Gourmet',
    customerId: 'usr-customer-2',
    status: 'PENDING',
    deliveryType: 'platform',
    items: [
      {
        productId: 'prod-1',
        name: 'Pizza Margherita Especial (Mediana)',
        quantity: 2,
        unitPrice: { amount: 12500, currency: 'ARS' },
        totalPrice: { amount: 25000, currency: 'ARS' },
        notes: 'Bien cocida por favor, sin orégano.',
      },
    ],
    subtotal: { amount: 25000, currency: 'ARS' },
    deliveryFee: { amount: 0, currency: 'ARS' }, // Free delivery threshold
    tip: { amount: 1000, currency: 'ARS' },
    discount: { amount: 2000, currency: 'ARS' },
    total: { amount: 24000, currency: 'ARS' },
    deliveryAddress: {
      id: 'addr-c2',
      label: 'Oficina',
      street: 'Av. Pueyrredón',
      number: '1850',
      apartment: 'Piso 7 A',
      city: 'Recoleta, CABA',
      instructions: 'Dejar en recepción.',
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '30-40 min',
  },
  {
    id: 'ord-1044',
    orderNumber: 1044,
    merchantId: 'merch-1',
    merchantName: 'Pizzería Napolitana Gourmet',
    customerId: 'usr-customer-3',
    status: 'PREPARING',
    deliveryType: 'platform',
    items: [
      {
        productId: 'prod-2',
        name: 'Pizza Cuatro Quesos (Mediana)',
        quantity: 1,
        unitPrice: { amount: 14200, currency: 'ARS' },
        totalPrice: { amount: 14200, currency: 'ARS' },
      },
      {
        productId: 'prod-5',
        name: 'Coca Cola 1.5L',
        quantity: 1,
        unitPrice: { amount: 2800, currency: 'ARS' },
        totalPrice: { amount: 2800, currency: 'ARS' },
      },
    ],
    subtotal: { amount: 17000, currency: 'ARS' },
    deliveryFee: { amount: 1450, currency: 'ARS' },
    tip: { amount: 800, currency: 'ARS' },
    discount: { amount: 0, currency: 'ARS' },
    total: { amount: 19250, currency: 'ARS' },
    deliveryAddress: {
      id: 'addr-c3',
      label: 'Casa',
      street: 'Mansilla',
      number: '2800',
      city: 'Palermo, CABA',
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '25-35 min',
  },
  {
    id: 'ord-1042',
    orderNumber: 1042,
    merchantId: 'merch-1',
    merchantName: 'Pizzería Napolitana Gourmet',
    customerId: 'usr-customer-1',
    courierId: 'usr-courier-1',
    courierName: 'Carlos Gómez',
    status: 'READY_FOR_PICKUP',
    deliveryType: 'platform',
    items: [
      {
        productId: 'prod-3',
        name: 'Pizza Fugazzeta Rellena',
        quantity: 1,
        unitPrice: { amount: 15000, currency: 'ARS' },
        totalPrice: { amount: 15000, currency: 'ARS' },
      },
      {
        productId: 'prod-6',
        name: 'Cerveza Moretti 330ml',
        quantity: 1,
        unitPrice: { amount: 3200, currency: 'ARS' },
        totalPrice: { amount: 3200, currency: 'ARS' },
      },
    ],
    subtotal: { amount: 18200, currency: 'ARS' },
    deliveryFee: { amount: 0, currency: 'ARS' },
    tip: { amount: 1000, currency: 'ARS' },
    discount: { amount: 0, currency: 'ARS' },
    total: { amount: 19200, currency: 'ARS' },
    deliveryAddress: {
      id: 'addr-1',
      label: 'Casa',
      street: 'Av. Corrientes',
      number: '1234',
      apartment: 'Piso 4 B',
      city: 'CABA',
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '18 min',
  },
  {
    id: 'ord-1038',
    orderNumber: 1038,
    merchantId: 'merch-1',
    merchantName: 'Pizzería Napolitana Gourmet',
    customerId: 'usr-customer-1',
    courierId: 'usr-courier-1',
    courierName: 'Carlos Gómez',
    status: 'DELIVERED',
    deliveryType: 'platform',
    items: [
      {
        productId: 'prod-1',
        name: 'Pizza Margherita Especial',
        quantity: 1,
        unitPrice: { amount: 12500, currency: 'ARS' },
        totalPrice: { amount: 12500, currency: 'ARS' },
      },
      {
        productId: 'prod-5',
        name: 'Coca Cola 1.5L',
        quantity: 1,
        unitPrice: { amount: 2700, currency: 'ARS' },
        totalPrice: { amount: 2700, currency: 'ARS' },
      },
    ],
    subtotal: { amount: 15200, currency: 'ARS' },
    deliveryFee: { amount: 1450, currency: 'ARS' },
    tip: { amount: 1000, currency: 'ARS' },
    discount: { amount: 2000, currency: 'ARS' },
    total: { amount: 15650, currency: 'ARS' },
    deliveryAddress: {
      id: 'addr-1',
      label: 'Casa',
      street: 'Av. Corrientes',
      number: '1234',
      apartment: 'Piso 4 B',
      city: 'CABA',
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: 'Entregado a tiempo',
  },
];

// Persistent state storage for development and session testing
let inMemoryOrders: OrderViewModel[] = [...initialMerchantOrders];
let inMemoryProducts: Product[] = [...mockProducts];
let inMemorySettings: StoreSettings = {
  isOpen: true,
  estimatedPrepTimeMin: 20,
  estimatedPrepTimeMax: 30,
  acceptsAutomatedDispatch: true,
  alertSoundEnabled: true,
  autoAcceptOrders: false,
};

export const merchantService = {
  async getOrders(): Promise<OrderViewModel[]> {
    return [...inMemoryOrders];
  },

  async updateOrderStatus(
    orderId: string,
    targetStatus: OrderStatus,
  ): Promise<{ success: boolean; error?: string; order?: OrderViewModel }> {
    const orderIndex = inMemoryOrders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, error: 'Pedido no encontrado' };
    }

    const currentStatus = inMemoryOrders[orderIndex].status;
    if (!isValidMerchantTransition(currentStatus, targetStatus)) {
      return {
        success: false,
        error: `Transición de estado no autorizada para el comercio (${currentStatus} -> ${targetStatus})`,
      };
    }

    inMemoryOrders[orderIndex] = {
      ...inMemoryOrders[orderIndex],
      status: targetStatus,
    };

    return { success: true, order: inMemoryOrders[orderIndex] };
  },

  async rejectOrder(
    orderId: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    const orderIndex = inMemoryOrders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return { success: false, error: 'Pedido no encontrado' };
    }

    inMemoryOrders[orderIndex] = {
      ...inMemoryOrders[orderIndex],
      status: 'REJECTED',
    };

    return { success: true };
  },

  async getProducts(): Promise<Product[]> {
    return [...inMemoryProducts];
  },

  async toggleProductAvailability(productId: string): Promise<Product | null> {
    const index = inMemoryProducts.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      isAvailable: !inMemoryProducts[index].isAvailable,
    };

    return inMemoryProducts[index];
  },

  async updateProductPrice(productId: string, newAmount: number): Promise<Product | null> {
    const index = inMemoryProducts.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      price: { amount: newAmount, currency: 'ARS' },
    };

    return inMemoryProducts[index];
  },

  async addProduct(newProduct: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
    };
    inMemoryProducts = [product, ...inMemoryProducts];
    return product;
  },

  async getSettings(): Promise<StoreSettings> {
    return { ...inMemorySettings };
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    inMemorySettings = {
      ...inMemorySettings,
      ...updates,
    };
    return { ...inMemorySettings };
  },
};
