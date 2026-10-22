/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MerchantDashboardView } from './merchant/MerchantDashboardView';
import { MerchantCatalogView } from './merchant/MerchantCatalogView';
import { MerchantSettingsView } from './merchant/MerchantSettingsView';

export type MerchantSection = 'orders' | 'catalog' | 'settings';

export const MerchantOverviewView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<MerchantSection>('orders');

  return (
    <div className="flex-1 flex flex-col">
      {/* Merchant Section Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 flex items-center justify-around text-xs shadow-xs select-none">
        <button
          type="button"
          onClick={() => setActiveSection('orders')}
          className={`
            flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer
            ${
              activeSection === 'orders'
                ? 'bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Comandas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('catalog')}
          className={`
            flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer
            ${
              activeSection === 'catalog'
                ? 'bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Catálogo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('settings')}
          className={`
            flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer
            ${
              activeSection === 'settings'
                ? 'bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>Ajustes</span>
        </button>
      </div>

      {/* Render Active Merchant Section */}
      {activeSection === 'orders' && <MerchantDashboardView />}
      {activeSection === 'catalog' && <MerchantCatalogView />}
      {activeSection === 'settings' && <MerchantSettingsView />}
    </div>
  );
};
