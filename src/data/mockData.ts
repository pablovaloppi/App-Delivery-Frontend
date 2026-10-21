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
    id: 'merch-1',
    name: 'Pizzería Napolitana Gourmet',
    category: 'Restaurantes',
    tags: ['Pizzas a la leña', 'Pastas caseras', 'Italiana'],
    isOpen: true,
    rating: 4.8,
    reviewCount: 340,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    deliveryFee: { amount: 0, currency: 'ARS' },
    freeDeliveryThreshold: { amount: 10000, currency: 'ARS' },
    distanceKm: 1.2,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFdhWXKS7rIJdiT8VTzvo9PI7kE1XX9hB8NRxDXHhIUT_wDZNGZ8h02dA0SGp_-bFnE5mUbfU5hTekef3-gH0jaD2uYVCSEYxsa2C0ooz35vuqndM-XLtnJ9BGDq-3i2RM2p5ZBi4oaoYCP8-H1dJ7wb9BuYETEH5vLs0QstZhrjmIX9zF6VwqvGh0Dip7si7LA_KnHSQXqkeduq_hdyRFBsLUieJ-Yya3UV4gwU4sx3aE4ATHFb_G1Q',
    logoImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkyT7lLmF9ZsL-SMNaUrRVgfPAF-OPX9-ezHFrEH9oXJ_ge_PpsoJ6tgQ-Mg97tTmkRMd7FAeMHIil2b8ugt5b46USLUPhNW-tPLdmLTUsX4iQ6tBvz9jYYm5bfJFdSSnjZKAGP-zL7DL84iCgBRMd9aqDlukbbt6U30xfrLr7ZnVsYJ-IcLwv4sZPqKoCck39uOOEqXpUjqwZXOg2XfBjZv-jdSiNUwbascsVniXY5ZMDnhxF8qy_0w',
    address: 'Av. Santa Fe 2100, Palermo',
    isSponsored: false,
  },
  {
    id: 'merch-2',
    name: 'Burger Station',
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
    address: 'Av. Corrientes 3400, Almagro',
    isSponsored: false,
  },
  {
    id: 'merch-3',
    name: 'Sushi House & Nikkei',
    category: 'Restaurantes',
    tags: ['Sushi Nikkei', 'Ceviches', 'Gyozas al vapor'],
    isOpen: true,
    rating: 4.9,
    reviewCount: 410,
    deliveryTimeMin: 30,
    deliveryTimeMax: 40,
    deliveryFee: { amount: 0, currency: 'ARS' },
    freeDeliveryThreshold: { amount: 12000, currency: 'ARS' },
    distanceKm: 2.4,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGjzQ-bYrJVYNidU6bbwrvPVJFkuQHOJmqz4GHoJ4K2M7BAMO94P2NZEAfGDdn4UbMPVESxb9eA6sUEYx7eMri11-uw8VOUzwWubymLOEQUVBETK0S5IGQOIJFTbjgjJz702eRfREg49rbeg1iF6HBgXqI-oY7uyOaFs_7OQSKINEiabYfNxyMuINBtVeJSpWVx3KjeJ6pwqPQ_AHqMS5J4NdyAn2Ls6VtzE5Q34qlgaxg-W5A-w7Fw',
    address: 'Honduras 4900, Palermo',
    isSponsored: true,
  },
  {
    id: 'merch-4',
    name: 'Green Bowl & Poke Fresh',
    category: 'Restaurantes',
    tags: ['Poke Bowls', 'Ensaladas', 'Orgánico & Saludable'],
    isOpen: true,
    rating: 4.7,
    reviewCount: 180,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryFee: { amount: 450, currency: 'ARS' },
    distanceKm: 0.8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvuOSS1Kz4qd9h5FlrIU6wO1oE9_QXAtdEksL0f1pDLeCnKVX9SUw5Uyj0Vso65dlYGtE8XFE5WFxOZg-Q_RKWGWp1SThpIV2XYu1bQYc9Ts7dYpOCscXOZqklAFsVW4eL7D50BKI7JteckOMIJYwj_Eg8_7KeHpSDbWOw1D2Uoxm-3sFDcxaR9M5WQwHINB3J4UJdc8IcuRbBEUDx-1s7eNDMYRLyVT5szUWIh-qGSmYz45R-dl5pog',
    address: 'Thames 1600, Palermo',
    isSponsored: false,
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    merchantId: 'merch-1',
    name: 'Pizza Margherita Especial',
    description:
      'Masa madre fermentada por 48 hs, salsa pomodoro San Marzano, mozzarella fior di latte fundida, hojas de albahaca fresca y aceite de oliva virgen extra.',
    price: { amount: 12500, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZZQX_2SdjXLLpS1K1lpkBmPoILFymMbDnJAhbOJbi8e79ov-i6JDJhWiZW9nQNTWJzM-LisYcc68tK2nMQBFTkkflX5Bjq0WJCvfMLxRlVk6_1dk4b5tMmjvmzqAObtpkxSpBrlFhzg0YHYFo5VrXXg7Zi-O4vgkyZ4tjtaKaT2weWQb0PuNawJ5pIMn7uJQChWQP9RUfv2yn_X-eqIUS9C_7i5dmpMAdNm9sSAjwy1rxVAzVAraVgw',
    category: 'Populares',
    isAvailable: true,
    isBestseller: true,
  },
  {
    id: 'prod-2',
    merchantId: 'merch-1',
    name: 'Pizza Cuatro Quesos',
    description:
      'Mozzarella fundida, gorgonzola cremoso, provolone artesanal y parmesano reggiano de 24 meses.',
    price: { amount: 14200, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUVeBlUxfnU4RJNEAUwk9JLI3YUWEXt62Ns82L3koRaWjmzPrMgoCYOlH0xSIJx0JV980XNk3JfOoNgPwZJkm6rLuffZ6bO7qx1MZl6ONG0S9D7rjjXzc7cqxnjGhagsF0ZJ-7x7Yw63M8JPcUgyQuTHjCkHcvqgCyFhtU4xAjJPEw1dnTEv1Im8vKjweT11_1DVCu94Sn8WmcRWwE4-weLjJJusimlkszvWomrJlRoC26jgTDB1E41A',
    category: 'Populares',
    isAvailable: true,
    isBestseller: false,
  },
  {
    id: 'prod-3',
    merchantId: 'merch-1',
    name: 'Pizza Fugazzeta Rellena',
    description:
      'Doble masa dorada rellena con 500g de mozzarella hilada, cubierta con cebollas confitadas y orégano de montaña.',
    price: { amount: 15000, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB21f8PoPqNb1UggvvkaGR5akjSMCBBoP3-mGp9PuVv9MA9Hinz3qG0tBR49vaF7EROx3UqgjVGY-JjeljorAzK9rUpRHBaPb0UDqKbGUUckY5Zvt9NqA_QMvco7AER7zoKxlXJPB2kpKJ2t0-eVDUbjJMooIUuWCEuJmZyFUZ4heJzvQMUO-_e0L4xb-JBagcCh85zr0Y1LVW5Dq2P54YOEbUhje_4XUFsdv725e9i3J-l0pee7uORUQ',
    category: 'Populares',
    isAvailable: true,
    isBestseller: false,
  },
  {
    id: 'prod-4',
    merchantId: 'merch-1',
    name: 'Volcán de Chocolate Tibio',
    description:
      'Bizcocho suave de chocolate belga con corazón líquido humeante, acompañado de frutos rojos frescos.',
    price: { amount: 4200, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAh78bIrYZJcS4E-Vi2hS5aerijdapPZo5doRdbKe3xCgH2T5EbI9svhRWXsiZFOXoTfTRE7YfZFYk2cSd4w4imH7EB5jC-73XoWTgnXdRW-IkHCFKVlfztPYlnazEURe68AN0Xn2PGe4SNdMEKHA1_E5cclKmK-7s3HmtAzbL2UYp4jb5MHkNf5yx8i6fMd8IxLR1fOCA7BuZQ9juR4stkNM3b7A-UXu9A2XIgNhZcJi4PxU0dlLr3wQ',
    category: 'Postres',
    isAvailable: true,
    isBestseller: false,
  },
  {
    id: 'prod-5',
    merchantId: 'merch-1',
    name: 'Coca Cola 1.5L',
    description: 'Fría • Envase Pet retornable o descartable.',
    price: { amount: 2800, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKFKkaPgyyh2qSAxtc4LMA13wvaaEevj4X-QnQY-pJQ2VOCSw_e_FfwteknWV1NtaNNhbwWvzdDJCexRuDSZVz7pnoMv7sgOZiqog4ztAwxVau12n0NZ7zl1LyNF5gnhzsUt4-AlT-OPas20fQs95jeADYJrCIkYIDWHthxBT2z4QOISHsdCr77hUo7f04ejxbgX-ILSsHmj7Sevl2kxdis0OeGxk_4XS5dMnFqfSXztTEv-VZ3Br50g',
    category: 'Bebidas',
    isAvailable: true,
  },
  {
    id: 'prod-6',
    merchantId: 'merch-1',
    name: 'Cerveza Moretti 330ml',
    description: 'Porrón frío importado de Italia, cerveza rubia artesanal.',
    price: { amount: 3200, currency: 'ARS' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKickfjK2nkVPWyNtJB5xYetnbYNGyYTeEYyzsAZqTI58HUm6WQPY7ed9BiOxBZKLo8raJGddGWdYdOhVnNzBG76xbe4Osig3XkuufxzZYSFjAaRNgtbcsHnXVwZgtfOLMluZfFOXgG7LRSTqciycjilrMOcOgv4Ag_YqdxLtBjqKAL5Unfl1y-Znd_lAaoo26JSEzczNtrgRiAG01pLv0HHwwY1Hc-f__4dvBPqQfjI5y0-2ZHwM2ag',
    category: 'Bebidas',
    isAvailable: true,
  },
];

export const mockActiveOrder: OrderViewModel = {
  id: 'ord-1042',
  orderNumber: 1042,
  merchantId: 'merch-1',
  merchantName: 'Pizzería Napolitana Gourmet',
  customerId: 'usr-customer-1',
  courierId: 'usr-courier-1',
  courierName: 'Carlos Gómez',
  status: 'ON_THE_WAY',
  deliveryType: 'platform',
  items: [
    {
      productId: 'prod-1',
      name: 'Pizza Margherita Especial',
      quantity: 1,
      unitPrice: { amount: 12500, currency: 'ARS' },
      totalPrice: { amount: 12500, currency: 'ARS' },
      notes: 'Sin orégano',
    },
    {
      productId: 'prod-5',
      name: 'Coca Cola 1.5L',
      quantity: 1,
      unitPrice: { amount: 2800, currency: 'ARS' },
      totalPrice: { amount: 2800, currency: 'ARS' },
    },
  ],
  subtotal: { amount: 15300, currency: 'ARS' },
  deliveryFee: { amount: 1450, currency: 'ARS' },
  tip: { amount: 1000, currency: 'ARS' },
  discount: { amount: 0, currency: 'ARS' },
  total: { amount: 17750, currency: 'ARS' },
  deliveryAddress: {
    id: 'addr-1',
    label: 'Casa',
    street: 'Av. Corrientes',
    number: '1234',
    apartment: 'Piso 4 B',
    city: 'CABA',
    instructions: 'Tocar timbre 4B (interfono directo)',
    isDefault: true,
  },
  createdAt: '2026-10-20T21:15:00Z',
  estimatedDeliveryTime: '21:45 hs',
};

export const mockCourierOffer: CourierOfferVM = {
  id: 'offer-9402',
  orderId: 'ord-9402',
  orderNumber: 9402,
  merchantName: 'Burger Station',
  merchantAddress: 'Av. Santa Fe 2100',
  customerZone: 'Palermo Soho',
  customerAddress: 'Thames 1400, Piso 3 Depto B',
  distanceKm: 3.2,
  estimatedMinutes: 14,
  guaranteedPayment: { amount: 2400, currency: 'ARS' },
  tip: { amount: 800, currency: 'ARS' },
  expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  secondsRemaining: 60,
};
