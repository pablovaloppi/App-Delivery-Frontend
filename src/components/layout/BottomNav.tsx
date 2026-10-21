/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export type NavTab = 'inicio' | 'explorar' | 'pedidos' | 'ofertas' | 'perfil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { activeOrderCount } = useAuth();

  const destinations: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'explorar', label: 'Explorar', icon: 'search' },
    { id: 'pedidos', label: 'Pedidos', icon: 'receipt_long', badge: activeOrderCount },
    { id: 'ofertas', label: 'Ofertas', icon: 'local_offer' },
    { id: 'perfil', label: 'Perfil', icon: 'person' },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 px-2 bg-[var(--surface)] border-t border-[var(--border)] max-w-[430px] mx-auto shadow-lg select-none"
    >
      {destinations.map((dest) => {
        const isActive = activeTab === dest.id;

        return (
          <button
            key={dest.id}
            type="button"
            onClick={() => onTabChange(dest.id)}
            className={`
              flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all duration-150 active:scale-95 cursor-pointer
              ${
                isActive
                  ? 'text-[var(--brand)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--brand)]'
              }
            `}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-icon' : ''}`}
              >
                {dest.icon}
              </span>
              {dest.badge && dest.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-[var(--brand)] text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-[var(--surface)]">
                  {dest.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {dest.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
