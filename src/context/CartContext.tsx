/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Merchant, Product } from '../types';
import { calculateCartTotals, CartCalculationResult } from '../utils/cartCalculations';
import { mockMerchants, mockProducts } from '../data/mockData';

interface CartContextType {
  items: CartItem[];
  merchant: Merchant | null;
  addItem: (
    product: Product,
    quantity?: number,
    options?: { size?: string; extras?: string[] },
    notes?: string,
  ) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  tip: number;
  setTip: (amount: number) => void;
  couponCode: string;
  couponDiscount: number;
  couponSuccessMessage: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  totals: CartCalculationResult;
  selectedPaymentMethod: 'card' | 'mercadopago' | 'cash';
  setSelectedPaymentMethod: (method: 'card' | 'mercadopago' | 'cash') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial default seed items
const initialSeedItems: CartItem[] = mockProducts[0]
  ? [
      {
        product: mockProducts[0],
        quantity: 1,
        selectedOptions: {
          size: 'Mediana',
          extras: ['Extra Queso Mozzarella (+$1.500 ARS)'],
        },
      },
      {
        product: mockProducts[1] || mockProducts[0],
        quantity: 1,
      },
    ]
  : [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(mockMerchants[0]);
  const [items, setItems] = useState<CartItem[]>(initialSeedItems);
  const [tip, setTip] = useState<number>(1000); // $1.000 ARS suggested
  const [couponCode, setCouponCode] = useState<string>('PIZZA2000');
  const [couponDiscount, setCouponDiscount] = useState<number>(2000);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<string | null>(
    '¡Cupón PIZZA2000 aplicado exitosamente (-$2.000 ARS)!',
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'mercadopago' | 'cash'>('card');

  const deliveryFee = merchant ? merchant.deliveryFee.amount || 1450 : 1450;
  const freeThreshold = merchant?.freeDeliveryThreshold?.amount;

  const totals = calculateCartTotals(items, deliveryFee, freeThreshold, tip, couponDiscount);

  const addItem = (
    product: Product,
    quantity = 1,
    options?: { size?: string; extras?: string[] },
    notes?: string,
  ) => {
    // Check if adding from different merchant
    if (merchant && merchant.id !== product.merchantId) {
      const targetMerchant = mockMerchants.find((m) => m.id === product.merchantId) || mockMerchants[0];
      setMerchant(targetMerchant);
      setItems([{ product, quantity, selectedOptions: options, notes }]);
      return;
    }

    if (!merchant) {
      const targetMerchant = mockMerchants.find((m) => m.id === product.merchantId) || mockMerchants[0];
      setMerchant(targetMerchant);
    }

    setItems((prev) => {
      // Check if identical item (same product and same options) exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedOptions?.size === options?.size &&
          JSON.stringify(i.selectedOptions?.extras || []) === JSON.stringify(options?.extras || []),
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, quantity, selectedOptions: options, notes }];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], quantity };
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PIZZA2000') {
      setCouponCode('PIZZA2000');
      setCouponDiscount(2000);
      setCouponSuccessMessage('¡Cupón PIZZA2000 aplicado exitosamente (-$2.000 ARS)!');
      return true;
    }
    if (cleanCode === 'ENVIOGRATIS') {
      setCouponCode('ENVIOGRATIS');
      setCouponDiscount(deliveryFee);
      setCouponSuccessMessage('¡Cupón ENVIOGRATIS aplicado! Envío bonificado al 100%.');
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponSuccessMessage(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        merchant,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        tip,
        setTip,
        couponCode,
        couponDiscount,
        couponSuccessMessage,
        applyCoupon,
        removeCoupon,
        totals,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
