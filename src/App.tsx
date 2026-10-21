/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/BottomNav';
import { CustomerHomeView } from './views/CustomerHomeView';
import { CustomerExploreView } from './views/CustomerExploreView';
import { CustomerOrdersView } from './views/CustomerOrdersView';
import { CustomerOffersView } from './views/CustomerOffersView';
import { CustomerProfileView } from './views/CustomerProfileView';
import { MerchantOverviewView } from './views/MerchantOverviewView';
import { CourierOverviewView } from './views/CourierOverviewView';
import { AdminOverviewView } from './views/AdminOverviewView';

function MainApp() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');

  // Customer sub-view routing
  const renderCustomerContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <CustomerHomeView
            onSelectMerchant={() => setActiveTab('explorar')}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'explorar':
        return <CustomerExploreView />;
      case 'pedidos':
        return <CustomerOrdersView />;
      case 'ofertas':
        return <CustomerOffersView />;
      case 'perfil':
        return <CustomerProfileView />;
      default:
        return <CustomerHomeView />;
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

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={getRoleTitle()}
    >
      {renderContentByRole()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
