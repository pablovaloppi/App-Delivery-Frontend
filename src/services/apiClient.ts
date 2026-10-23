/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Merchant, MoneyAmount, OrderStatus, OrderViewModel, Product } from '../types';
import { mockCategories, mockMerchants, mockProducts, mockActiveOrder } from '../data/mockData';

// Normalized Base URL from environment variable VITE_API_BASE_URL
const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
export const API_BASE_URL = RAW_BASE_URL.trim().replace(/\/+$/, '');

console.info(`[FoodieLocal API] Configured Base URL: "${API_BASE_URL || '(using local fallback)'}"`);

// Standard fallback food imagery for restaurants and products
const DEFAULT_COVERS: Record<string, string> = {
  pizza:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFdhWXKS7rIJdiT8VTzvo9PI7kE1XX9hB8NRxDXHhIUT_wDZNGZ8h02dA0SGp_-bFnE5mUbfU5hTekef3-gH0jaD2uYVCSEYxsa2C0ooz35vuqndM-XLtnJ9BGDq-3i2RM2p5ZBi4oaoYCP8-H1dJ7wb9BuYETEH5vLs0QstZhrjmIX9zF6VwqvGh0Dip7si7LA_KnHSQXqkeduq_hdyRFBsLUieJ-Yya3UV4gwU4sx3aE4ATHFb_G1Q',
  burger:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC95zY5mBfPUiOtfKFQ2-fJXwp3e6bPyVlkaXv54Aj4GGlVXItAGdGudqYjHjPxAuyMt0Tgp5eOWPfaeRccAURH9lZiJUG0Y_8Qj-YC9pmS8i3wBDm2CvjT77f2q5duaDdkWfCnW1t8y3joJ3liuWhxZN28-lCFey_7Mzb9uhe3QuoRK2Nrzl4Kc9iRvWjjAdD8VWKxjTEr2RizQrA9hwvl0wc7hNLpN6ij5w8XTgyIDhlKBswa5Ol5UA',
  super:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvuOSS1Kz4qd9h5FlrIU6wO1oE9_QXAtdEksL0f1pDLeCnKVX9SUw5Uyj0Vso65dlYGtE8XFE5WFxOZg-Q_RKWGWp1SThpIV2XYu1bQYc9Ts7dYpOCscXOZqklAFsVW4eL7D50BKI7JteckOMIJYwj_Eg8_7KeHpSDbWOw1D2Uoxm-3sFDcxaR9M5WQwHINB3J4UJdc8IcuRbBEUDx-1s7eNDMYRLyVT5szUWIh-qGSmYz45R-dl5pog',
  general:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGjzQ-bYrJVYNidU6bbwrvPVJFkuQHOJmqz4GHoJ4K2M7BAMO94P2NZEAfGDdn4UbMPVESxb9eA6sUEYx7eMri11-uw8VOUzwWubymLOEQUVBETK0S5IGQOIJFTbjgjJz702eRfREg49rbeg1iF6HBgXqI-oY7uyOaFs_7OQSKINEiabYfNxyMuINBtVeJSpWVx3KjeJ6pwqPQ_AHqMS5J4NdyAn2Ls6VtzE5Q34qlgaxg-W5A-w7Fw',
};

const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  pizza:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZZQX_2SdjXLLpS1K1lpkBmPoILFymMbDnJAhbOJbi8e79ov-i6JDJhWiZW9nQNTWJzM-LisYcc68tK2nMQBFTkkflX5Bjq0WJCvfMLxRlVk6_1dk4b5tMmjvmzqAObtpkxSpBrlFhzg0YHYFo5VrXXg7Zi-O4vgkyZ4tjtaKaT2weWQb0PuNawJ5pIMn7uJQChWQP9RUfv2yn_X-eqIUS9C_7i5dmpMAdNm9sSAjwy1rxVAzVAraVgw',
  empanada:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiYpE40KOsxI366UrH1pghQ8iGLrhCeQ9nXlQqXWav1HBmAdlL_WSBsgfhEHXQvrNxNkn4R4YqL7aC1jrVrFCf07NTUkGY1mEoGC5AcNnS-HKpUP3zENdabWPVRD0EiYYEj9Z_BrFWRM3kRBfvHsBQIVMmiK06drCMT_-aLzpiBI0ehNJ4xtJkbLzwr4vEp2Khx17UIUQ8X_YZWnJ7ZArfSV43RI-_z_8hm-GqFkih_n7PVyGW3QXliQ',
  burger:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9i3e1wR4K_4YvW-N0hV_hZ8oI422s7kO6729l82P4pZ0s_h18_q9b7A7i5p_40Z6M2r7k-f_8N7i-K5q_W6M4b8p7z0a8h2p4_7k0r4o7b9s_w-9Q',
  drink:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBKFKkaPgyyh2qSAxtc4LMA13wvaaEevj4X-QnQY-pJQ2VOCSw_e_FfwteknWV1NtaNNhbwWvzdDJCexRuDSZVz7pnoMv7sgOZiqog4ztAwxVau12n0NZ7zl1LyNF5gnhzsUt4-AlT-OPas20fQs95jeADYJrCIkYIDWHthxBT2z4QOISHsdCr77hUo7f04ejxbgX-ILSsHmj7Sevl2kxdis0OeGxk_4XS5dMnFqfSXztTEv-VZ3Br50g',
};

function pickCoverImage(name: string, description: string = ''): string {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes('pizz') || text.includes('pasta')) return DEFAULT_COVERS.pizza;
  if (text.includes('burg') || text.includes('lomito')) return DEFAULT_COVERS.burger;
  if (text.includes('super') || text.includes('almacén') || text.includes('almacen'))
    return DEFAULT_COVERS.super;
  return DEFAULT_COVERS.general;
}

function pickProductImage(name: string): string {
  const text = name.toLowerCase();
  if (text.includes('empanada')) return DEFAULT_PRODUCT_IMAGES.empanada;
  if (text.includes('pizza') || text.includes('fugazzeta')) return DEFAULT_PRODUCT_IMAGES.pizza;
  if (text.includes('coca') || text.includes('cerveza') || text.includes('bebida'))
    return DEFAULT_PRODUCT_IMAGES.drink;
  if (text.includes('burger') || text.includes('lomito')) return DEFAULT_PRODUCT_IMAGES.burger;
  return DEFAULT_PRODUCT_IMAGES.pizza;
}

export interface BackendHealth {
  isOnline: boolean;
  service?: string;
  version?: string;
  mode?: string;
  url: string;
}

export const apiClient = {
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  isConfigured(): boolean {
    return Boolean(API_BASE_URL && API_BASE_URL.startsWith('http'));
  },

  /**
   * Health check against /api/health
   */
  async checkHealth(): Promise<BackendHealth> {
    if (!this.isConfigured()) {
      return { isOnline: false, url: API_BASE_URL };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          isOnline: true,
          service: data.service,
          version: data.version,
          mode: data.mode,
          url: API_BASE_URL,
        };
      }
      return { isOnline: false, url: API_BASE_URL };
    } catch {
      return { isOnline: false, url: API_BASE_URL };
    }
  },

  /**
   * Fetch merchants from GET /api/v1/merchants
   */
  async getMerchants(): Promise<Merchant[]> {
    if (!this.isConfigured()) {
      return mockMerchants;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/merchants`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        console.warn(`[API] /api/v1/merchants returned ${res.status}, using fallback.`);
        return mockMerchants;
      }

      const json = await res.json();
      const rawList = Array.isArray(json.items) ? json.items : Array.isArray(json) ? json : [];

      if (rawList.length === 0) return mockMerchants;

      // Adapt backend merchant schema to frontend Merchant interface
      const adapted: Merchant[] = rawList.map((m: any, index: number) => {
        const street = m.address?.street || m.address || 'Av. Corrientes';
        const number = m.address?.number || '1234';
        const city = m.address?.city || 'CABA';
        const addressStr = typeof m.address === 'string' ? m.address : `${street} ${number}, ${city}`;

        const category =
          m.categoryIds?.includes('cat_super')
            ? 'Supermercado'
            : m.categoryIds?.includes('cat_cafe')
            ? 'Cafetería'
            : 'Restaurantes';

        const tags = m.description
          ? m.description.split(',').map((s: string) => s.trim())
          : ['Comida casera', 'Platos del día'];

        return {
          id: String(m.id || `merch-${index + 1}`),
          name: m.name || 'Comercio Local',
          category,
          tags: tags.slice(0, 3),
          isOpen: m.isOpen !== false,
          rating: Number(m.ratingAverage || m.rating || 4.8),
          reviewCount: Number(m.ratingCount || m.reviewCount || 100),
          deliveryTimeMin: Number(m.preparationTimeMin || 20),
          deliveryTimeMax: Number(m.preparationTimeMax || 35),
          deliveryFee: {
            amount: typeof m.deliveryFee === 'number' ? m.deliveryFee : 1200,
            currency: 'ARS',
          },
          freeDeliveryThreshold: { amount: 10000, currency: 'ARS' },
          distanceKm: Number((1.0 + (index * 0.6) % 3.0).toFixed(1)),
          coverImage: m.coverImage || pickCoverImage(m.name, m.description),
          logoImage: m.logoImage || undefined,
          address: addressStr,
          isSponsored: index === 2,
        };
      });

      return adapted;
    } catch (err) {
      console.warn('[API] Failed to fetch merchants from backend:', err);
      return mockMerchants;
    }
  },

  /**
   * Fetch products for a merchant from GET /api/v1/merchants/:id/products
   */
  async getMerchantProducts(merchantId: string): Promise<Product[]> {
    if (!this.isConfigured()) {
      return mockProducts;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/merchants/${merchantId}/products`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        console.warn(`[API] /api/v1/merchants/${merchantId}/products returned ${res.status}`);
        return mockProducts;
      }

      const json = await res.json();
      const rawProducts = Array.isArray(json.items) ? json.items : Array.isArray(json) ? json : [];

      if (rawProducts.length === 0) return mockProducts;

      const adapted: Product[] = rawProducts.map((p: any, idx: number) => ({
        id: String(p.id || `prod-${idx}`),
        merchantId: String(p.merchantId || merchantId),
        name: p.name || 'Plato Especial',
        description: p.description || '',
        price: {
          amount: typeof p.price === 'number' ? p.price : p.price?.amount || 10000,
          currency: 'ARS',
        },
        imageUrl: p.imageUrl || pickProductImage(p.name),
        category: p.categoryId === 'cat_pizza' ? 'Pizzas' : 'Populares',
        isAvailable: p.available !== false,
        isBestseller: idx === 0,
      }));

      return adapted;
    } catch (err) {
      console.warn(`[API] Failed to fetch products for merchant ${merchantId}:`, err);
      return mockProducts;
    }
  },

  /**
   * Fetch orders from GET /api/v1/admin/orders
   */
  async getOrders(): Promise<OrderViewModel[]> {
    if (!this.isConfigured()) {
      return [mockActiveOrder];
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return [mockActiveOrder];
      }

      const json = await res.json();
      const rawOrders = Array.isArray(json.items) ? json.items : Array.isArray(json) ? json : [];

      if (rawOrders.length === 0) return [mockActiveOrder];

      const adapted: OrderViewModel[] = rawOrders.map((o: any) => {
        const items = Array.isArray(o.items)
          ? o.items.map((it: any) => ({
              productId: String(it.productId || 'p_1'),
              name: it.nameSnapshot || it.name || 'Ítem de comanda',
              quantity: Number(it.quantity || 1),
              unitPrice: {
                amount: Number(it.unitPriceSnapshot || it.price || 10000),
                currency: 'ARS' as const,
              },
              totalPrice: {
                amount: Number(it.subtotal || (it.unitPriceSnapshot || 10000) * (it.quantity || 1)),
                currency: 'ARS' as const,
              },
            }))
          : mockActiveOrder.items;

        return {
          id: String(o.id),
          orderNumber: Number(o.orderNumber || 1000),
          merchantId: String(o.merchantId || 'm_001'),
          merchantName: o.merchantName || 'Pizzería Don Pepe',
          customerId: String(o.customerId || 'usr_customer_1'),
          courierId: o.courierId ? String(o.courierId) : undefined,
          courierName: o.courierId ? 'Carlos Gómez' : undefined,
          status: (o.status as OrderStatus) || 'PENDING',
          deliveryType: o.deliveryType || 'platform',
          items,
          subtotal: { amount: Number(o.subtotal || 15000), currency: 'ARS' },
          deliveryFee: { amount: Number(o.deliveryFee || 2200), currency: 'ARS' },
          tip: { amount: Number(o.tip || 300), currency: 'ARS' },
          discount: { amount: 0, currency: 'ARS' },
          total: { amount: Number(o.total || 17500), currency: 'ARS' },
          deliveryAddress: {
            id: 'addr-live',
            label: 'Entrega',
            street: o.deliveryAddress?.street || 'Av. San Martín',
            number: String(o.deliveryAddress?.number || '100'),
            city: o.deliveryAddress?.city || 'Ciudad de Perico',
            instructions: o.deliveryAddress?.notes,
            isDefault: true,
          },
          createdAt: o.createdAt || new Date().toISOString(),
          estimatedDeliveryTime: '20-30 min',
        };
      });

      return adapted;
    } catch (err) {
      console.warn('[API] Failed to fetch orders from backend:', err);
      return [mockActiveOrder];
    }
  },

  /**
   * Send new order to POST /api/v1/orders
   */
  async createOrder(payload: any): Promise<{ success: boolean; order?: OrderViewModel; error?: string }> {
    if (!this.isConfigured()) {
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: json.error?.message || `Error del servidor HTTP ${res.status}`,
        };
      }

      return {
        success: true,
        order: json.order || json,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Error de conexión con el backend',
      };
    }
  },
};
