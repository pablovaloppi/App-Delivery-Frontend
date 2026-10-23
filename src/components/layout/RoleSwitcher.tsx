/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const RoleSwitcher: React.FC = () => {
  const { role, user, logout } = useAuth();

  const roleLabels: Record<string, { label: string; icon: string; color: string }> = {
    admin: { label: 'Administrador', icon: 'admin_panel_settings', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    merchant: { label: 'Comercio', icon: 'storefront', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    courier: { label: 'Cadete Express', icon: 'two_wheeler', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    customer: { label: 'Cliente', icon: 'person', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  };

  const badge = roleLabels[role] || roleLabels.customer;

  return (
    <div className="bg-[var(--surface-alt)] border-b border-[var(--border)] px-3 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2 truncate pr-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${badge.color}`}>
          <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
        <span className="font-bold text-[var(--text)] truncate text-[11px]">
          {user.name}
        </span>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        title="Cerrar Sesión"
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface)] hover:bg-rose-500/10 hover:text-rose-600 border border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)] transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <span className="material-symbols-outlined text-[14px]">logout</span>
        <span className="hidden xs:inline">Salir</span>
      </button>
    </div>
  );
};
