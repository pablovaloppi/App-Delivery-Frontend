/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Merchant, Product, OrderViewModel } from '../types';
import { apiClient, BackendHealth } from '../services/apiClient';
import { mockMerchants, mockProducts } from '../data/mockData';
import { merchantService } from '../services/api/merchantService';

interface DataContextType {
  merchants: Merchant[];
  isLoadingMerchants: boolean;
  backendHealth: BackendHealth;
  refreshMerchants: () => Promise<void>;
  fetchProductsByMerchantId: (merchantId: string) => Promise<Product[]>;
  orders: OrderViewModel[];
  refreshOrders: () => Promise<void>;
  addOrder: (newOrder: OrderViewModel) => void;
  isLiveBackend: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [isLoadingMerchants, setIsLoadingMerchants] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderViewModel[]>([]);
  const [backendHealth, setBackendHealth] = useState<BackendHealth>({
    isOnline: false,
    url: apiClient.getBaseUrl(),
  });

  const loadData = useCallback(async () => {
    setIsLoadingMerchants(true);
    try {
      // 1. Check health
      const health = await apiClient.checkHealth();
      setBackendHealth(health);

      // 2. Fetch merchants from backend
      const fetchedMerchants = await apiClient.getMerchants();
      if (fetchedMerchants && fetchedMerchants.length > 0) {
        setMerchants(fetchedMerchants);
      }

      // 3. Fetch real orders from merchant / backend service
      const fetchedOrders = await merchantService.getOrders();
      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      }
    } catch (err) {
      console.warn('[DataContext] Error initializing live backend data:', err);
    } finally {
      setIsLoadingMerchants(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshMerchants = async () => {
    const list = await apiClient.getMerchants();
    if (list && list.length > 0) {
      setMerchants(list);
    }
  };

  const refreshOrders = async () => {
    const list = await merchantService.getOrders();
    if (list && list.length > 0) {
      setOrders(list);
    }
  };

  const addOrder = (newOrder: OrderViewModel) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
      return exists ? prev : [newOrder, ...prev];
    });
    merchantService.addOrder(newOrder);
  };

  const fetchProductsByMerchantId = async (merchantId: string): Promise<Product[]> => {
    try {
      const prods = await apiClient.getMerchantProducts(merchantId);
      return prods && prods.length > 0 ? prods : mockProducts;
    } catch {
      return mockProducts;
    }
  };

  return (
    <DataContext.Provider
      value={{
        merchants,
        isLoadingMerchants,
        backendHealth,
        refreshMerchants,
        fetchProductsByMerchantId,
        orders,
        refreshOrders,
        addOrder,
        isLiveBackend: backendHealth.isOnline,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
