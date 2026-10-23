/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Merchant, Product, CourierOfferVM, OrderViewModel } from '../types';

export const mockCategories = [
  { id: 'cat-1', name: 'Restaurantes', iconName: 'lunch_dining' },
  { id: 'cat-2', name: 'Supermercado', iconName: 'shopping_basket' },
  { id: 'cat-3', name: 'Cafetería', iconName: 'local_cafe' },
  { id: 'cat-4', name: 'Farmacia', iconName: 'medication' },
  { id: 'cat-5', name: 'Verdulería', iconName: 'nutrition' },
  { id: 'cat-6', name: 'Mascotas', iconName: 'pets' },
];

export const mockMerchants: Merchant[] = [
  {
    id: 'm_001',
    name: 'Pizzería Don Pepe',
    category: 'Restaurantes',
    tags: ['Pizzas a la leña', 'Empanadas Salteñas', 'Comida Tradicional'],
    isOpen: true,
    rating: 4.8,
    reviewCount: 340,
    deliveryTimeMin: 15,
    deliveryTimeMax: 30,
    deliveryFee: { amount: 0, currency: 'ARS' },
    freeDeliveryThreshold: { amount: 10000, currency: 'ARS' },
    distanceKm: 0.8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFdhWXKS7rIJdiT8VTzvo9PI7kE1XX9hB8NRxDXHhIUT_wDZNGZ8h02dA0SGp_-bFnE5mUbfU5hTekef3-gH0jaD2uYVCSEYxsa2C0ooz35vuqndM-XLtnJ9BGDq-3i2RM2p5ZBi4oaoYCP8-H1dJ7wb9BuYETEH5vLs0QstZhrjmIX9zF6VwqvGh0Dip7si7LA_KnHSQXqkeduq_hdyRFBsLUieJ-Yya3UV4gwU4sx3aE4ATHFb_G1Q',
    logoImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkyT7lLmF9ZsL-SMNaUrRVgfPAF-OPX9-ezHFrEH9oXJ_ge_PpsoJ6tgQ-Mg97tTmkRMd7FAeMHIil2b8ugt5b46USLUPhNW-tPLdmLTUsX4iQ6tBvz9jYYm5bfJFdSSnjZKAGP-zL7DL84iCgBRMd9aqDlukbbt6U30xfrLr7ZnVsYJ-IcLwv4sZPqKoCck39uOOEqXpUjqwZXOg2XfBjZv-jdSiNUwbascsVniXY5ZMDnhxF8qy_0w',
    address: 'Av. San Martín 450, Ciudad de Perico',
    isSponsored: false,
  },
  {
    id: 'merch-2',
    name: 'Burger Station Perico',
    category: 'Restaurantes',
    tags: ['Smash burgers', 'Papas rústicas', 'Dips especiales'],
    isOpen: true,
    rating: 4.7,
    reviewCount: 220,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    deliveryFee: { amount: 1200, currency: 'ARS' },
    distanceKm: 1.8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC95zY5mBfPUiOtfKFQ2-fJXwp3e6bPyVlkaXv54Aj4GGlVXItAGdGudqYjHjPxAuyMt0Tgp5eOWPfaeRccAURH9lZiJUG0Y_8Qj-YC9pmS8i3wBDm2CvjT77f2q5duaDdkWfCnW1t8y3joJ3liuWhxZN28-lCFey_7Mzb9uhe3QuoRK2Nrzl4Kc9iRvWjjAdD8VWKxjTEr2RizQrA9hwvl0wc7hNLpN6ij5w8XTgyIDhlKBswa5Ol5UA',
    address: 'Av. Italia 120, Ciudad de Perico',
    isSponsored: false,
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p_001',
    merchantId: 'm_001',
    name: 'Pizza Especial Muzza y Jamón',
    description:
      'Masa madre, salsa casera, 350g muzzarella premium, jamón cocido, orégano y aceitunas.',
    price: { amount: 15000, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZZQX_2SdjXLLpS1K1lpkBmPoILFymMbDnJAhbOJbi8e79ov-i6JDJhWiZW9nQNTWJzM-LisYcc68tK2nMQBFTkkflX5Bjq0WJCvfMLxRlVk6_1dk4b5tMmjvmzqAObtpkxSpBrlFhzg0YHYFo5VrXXg7Zi-O4vgkyZ4tjtaKaT2weWQb0PuNawJ5pIMn7uJQChWQP9RUfv2yn_X-eqIUS9C_7i5dmpMAdNm9sSAjwy1rxVAzVAraVgw',
    category: 'Pizzas',
    isAvailable: true,
    isBestseller: true,
  },
  {
    id: 'p_002',
    merchantId: 'm_001',
    name: 'Docena de Empanadas Salteñas',
    description:
      'Cortadas a cuchillo, papa, cebolla de verdeo, comino y masa casera horneada.',
    price: { amount: 12000, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCiYpE40KOsxI366UrH1pghQ8iGLrhCeQ9nXlQqXWav1HBmAdlL_WSBsgfhEHXQvrNxNkn4R4YqL7aC1jrVrFCf07NTUkGY1mEoGC5AcNnS-HKpUP3zENdabWPVRD0EiYYEj9Z_BrFWRM3kRBfvHsBQIVMmiK06drCMT_-aLzpiBI0ehNJ4xtJkbLzwr4vEp2Khx17UIUQ8X_YZWnJ7ZArfSV43RI-_z_8hm-GqFkih_n7PVyGW3QXliQ',
    category: 'Empanadas',
    isAvailable: true,
    isBestseller: true,
  },
  {
    id: 'p_003',
    merchantId: 'm_001',
    name: 'Pizza Fugazzeta Rellena',
    description:
      'Doble masa rellena de queso cuartirolo y muzzarella con abundante cebolla confitada.',
    price: { amount: 17500, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB21f8PoPqNb1UggvvkaGR5akjSMCBBoP3-mGp9PuVv9MA9Hinz3qG0tBR49vaF7EROx3UqgjVGY-JjeljorAzK9rUpRHBaPb0UDqKbGUUckY5Zvt9NqA_QMvco7AER7zoKxlXJPB2kpKJ2t0-eVDUbjJMooIUuWCEuJmZyFUZ4heJzvQMUO-_e0L4xb-JBagcCh85zr0Y1LVW5Dq2P54YOEbUhje_4XUFsdv725e9i3J-l0pee7uORUQ',
    category: 'Pizzas',
    isAvailable: true,
    isBestseller: false,
  },
];

export const mockActiveOrder: OrderViewModel = {
  id: 'ord-1042',
  orderNumber: 1042,
  merchantId: 'm_001',
  merchantName: 'Pizzería Don Pepe',
  customerId: 'usr_customer_1',
  courierId: 'usr_courier_1',
  courierName: 'Carlos Gómez',
  status: 'ON_THE_WAY',
  deliveryType: 'platform',
  items: [
    {
      productId: 'p_001',
      name: 'Pizza Especial Muzza y Jamón',
      quantity: 1,
      unitPrice: { amount: 15000, currency: 'ARS' },
      totalPrice: { amount: 15000, currency: 'ARS' },
      notes: 'Sin orégano',
    },
  ],
  subtotal: { amount: 15000, currency: 'ARS' },
  deliveryFee: { amount: 2200, currency: 'ARS' },
  tip: { amount: 500, currency: 'ARS' },
  discount: { amount: 0, currency: 'ARS' },
  total: { amount: 17700, currency: 'ARS' },
  deliveryAddress: {
    id: 'addr-1',
    label: 'Casa',
    street: 'Av. Corrientes',
    number: '1234',
    apartment: 'Piso 4 B',
    city: 'Ciudad de Perico',
    instructions: 'Tocar timbre 4B (interfono directo)',
    isDefault: true,
  },
  createdAt: '2026-10-23T14:30:00Z',
  estimatedDeliveryTime: '20-30 min',
};

export const mockCourierOffer: CourierOfferVM = {
  id: 'offer-9402',
  orderId: 'ord-9402',
  orderNumber: 9402,
  merchantName: 'Pizzería Don Pepe',
  merchantAddress: 'Av. San Martín 450',
  customerZone: 'Ciudad de Perico',
  customerAddress: 'Av. Italia 120',
  distanceKm: 1.2,
  estimatedMinutes: 14,
  guaranteedPayment: { amount: 2000, currency: 'ARS' },
  tip: { amount: 500, currency: 'ARS' },
  expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  secondsRemaining: 60,
};
