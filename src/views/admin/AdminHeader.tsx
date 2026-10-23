/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdminSubTab } from '../../types/admin';

interface AdminHeaderProps {
  activeTab: AdminSubTab;
  onTabChange: (tab: AdminSubTab) => void;
  pendingDisputesCount: number;
  pendingAuditsCount: number;
  isRainActive: boolean;
  onToggleRain: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  pendingDisputesCount,
  pendingAuditsCount,
  isRainActive,
  onToggleRain,
}) => {
  return (
    <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
      {/* Top status bar */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border)]/60 bg-[var(--surface-alt)]/50">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-[var(--text)]">
            FoodieLocal Backoffice CABA
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] hidden sm:inline">
            • Algoritmo de Despacho & Gestión Operativa
          </span>
        </div>

        {/* Rain mode trigger button */}
        <button
          onClick={onToggleRain}
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
            isRainActive
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-blue-400'
          }`}
          title="Activar o desactivar recargo por lluvia automático"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRainActive ? 'thunderstorm' : 'water_drop'}
          </span>
          <span>{isRainActive ? 'Lluvia ACTIVA (+Tarifa)' : 'Modo Lluvia'}</span>
        </button>
      </div>

      {/* Admin Sub-tabs Navigation */}
      <nav className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onTabChange('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[var(--brand)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Panel General</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('disputes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative ${
            activeTab === 'disputes'
              ? 'bg-[var(--brand)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">report_problem</span>
          <span>Disputas e Incidentes</span>
          {pendingDisputesCount > 0 && (
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                activeTab === 'disputes' ? 'bg-white text-[var(--brand)]' : 'bg-rose-500 text-white'
              }`}
            >
              {pendingDisputesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative ${
            activeTab === 'audit'
              ? 'bg-[var(--brand)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>Auditoría de Comercios & Cadetes</span>
          {pendingAuditsCount > 0 && (
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                activeTab === 'audit' ? 'bg-white text-[var(--brand)]' : 'bg-amber-500 text-white'
              }`}
            >
              {pendingAuditsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[var(--brand)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Tarifas y Pozo Mensual</span>
        </button>
      </nav>
    </header>
  );
};
