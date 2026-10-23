/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/BottomNav';
import { CustomerHomeView } from './views/CustomerHomeView';
import { CustomerExploreView } from './views/CustomerExploreView';
import { CustomerOrdersView } from './views/CustomerOrdersView';
import { CustomerOffersView } from './views/CustomerOffersView';
import { CustomerProfileView } from './views/CustomerProfileView';
import { MerchantDetailView } from './views/MerchantDetailView';
import { CartCheckoutView } from './views/CartCheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AddressSelectorModal } from './views/AddressSelectorModal';
import { MerchantOverviewView } from './views/MerchantOverviewView';
import { CourierOverviewView } from './views/CourierOverviewView';
import { AdminOverviewView } from './views/AdminOverviewView';
import { mockMerchants, mockActiveOrder } from './data/mockData';
import { Merchant, OrderViewModel } from './types';
import { EcosystemProvider } from './context/EcosystemContext';
import { DataProvider, useData } from './context/DataContext';
import { ReviewModal } from './components/ecosystem/ReviewModal';
import { LoyaltyRewards } from './components/ecosystem/LoyaltyRewards';
import { NotificationCenter } from './components/ecosystem/NotificationCenter';
import { SimulationController } from './components/ecosystem/SimulationController';
import { LoginView } from './views/LoginView';

function MainApp() {
  const { isAuthenticated, role, activeAddress, setActiveAddress } = useAuth();
  const { merchants } = useData();
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');

  // Customer sub-view navigation states
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<OrderViewModel | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedMerchant, isCheckoutOpen, trackedOrder]);

  const handleSelectMerchantId = (merchantId: string) => {
    const found = merchants.find((m) => m.id === merchantId) || mockMerchants.find((m) => m.id === merchantId) || merchants[0] || mockMerchants[0];
    setSelectedMerchant(found);
  };

  const handleOrderCreated = (order: OrderViewModel) => {
    setIsCheckoutOpen(false);
    setSelectedMerchant(null);
    setTrackedOrder(order);
  };

  // Render Customer views
  const renderCustomerContent = () => {
    // 1. Live Order Tracking screen
    if (trackedOrder) {
      return (
        <OrderTrackingView
          order={trackedOrder}
          onBack={() => setTrackedOrder(null)}
        />
      );
    }

    // 2. Full Cart Checkout screen
    if (isCheckoutOpen) {
      return (
        <CartCheckoutView
          onBack={() => setIsCheckoutOpen(false)}
          onAddMoreItems={() => {
            setIsCheckoutOpen(false);
            if (!selectedMerchant) setSelectedMerchant(mockMerchants[0]);
          }}
          onOrderCreated={handleOrderCreated}
        />
      );
    }

    // 3. Merchant Detail & Catalog screen
    if (selectedMerchant) {
      return (
        <MerchantDetailView
          merchant={selectedMerchant}
          onBack={() => setSelectedMerchant(null)}
          onOpenCart={() => setIsCheckoutOpen(true)}
        />
      );
    }

    // 4. Default BottomNav Tabs
    switch (activeTab) {
      case 'inicio':
        return (
          <CustomerHomeView
            onSelectMerchant={handleSelectMerchantId}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'explorar':
        return <CustomerExploreView onSelectMerchant={handleSelectMerchantId} />;
      case 'pedidos':
        return <CustomerOrdersView />;
      case 'ofertas':
        return <CustomerOffersView />;
      case 'perfil':
        return (
          <CustomerProfileView
            onOpenAddresses={() => setIsAddressModalOpen(true)}
            onOpenPaymentMethods={() => setIsCheckoutOpen(true)}
          />
        );
      default:
        return (
          <CustomerHomeView
            onSelectMerchant={handleSelectMerchantId}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  const renderContentByRole = () => {
    switch (role) {
      case 'merchant':
        return <MerchantOverviewView />;
      case 'courier':
        return <CourierOverviewView />;
      case 'admin':
        return <AdminOverviewView />;
      case 'customer':
      default:
        return renderCustomerContent();
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'merchant':
        return 'Panel del Comercio';
      case 'courier':
        return 'Cadete Express';
      case 'admin':
        return 'Administración';
      case 'customer':
      default:
        return undefined; // TopAppBar defaults to brand logo & location
    }
  };

  // Determine if main layout bottom navigation should be suppressed (e.g. inside sub-flows like Cart or Tracking)
  const isSubPageOpen = Boolean(selectedMerchant || isCheckoutOpen || trackedOrder);

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedMerchant(null);
          setIsCheckoutOpen(false);
          setTrackedOrder(null);
          setActiveTab(tab);
        }}
        title={getRoleTitle()}
        hideNav={isSubPageOpen}
        hideTopBar={isSubPageOpen}
      >
        {renderContentByRole()}
      </AppLayout>

      {/* Global Address Selector Modal */}
      <AddressSelectorModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        activeAddress={activeAddress}
        onSelectAddress={setActiveAddress}
      />

      {/* Etapa 6 Ecosystem Modals & Overlays */}
      <ReviewModal />
      <LoyaltyRewards />
      <NotificationCenter />
      <SimulationController />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <EcosystemProvider>
              <MainApp />
            </EcosystemProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
