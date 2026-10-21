/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, user } = useAuth();

  const roles: { id: UserRole; label: string; icon: string }[] = [
    { id: 'customer', label: 'Cliente', icon: 'person' },
    { id: 'merchant', label: 'Comercio', icon: 'storefront' },
    { id: 'courier', label: 'Cadete', icon: 'two_wheeler' },
    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  ];

  return (
    <div className="bg-[var(--surface-alt)] border-b border-[var(--border)] px-3 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
          Rol activo:
        </span>
        <span className="font-extrabold text-[var(--brand)]">
          {roles.find((r) => r.id === role)?.label}
        </span>
        <span className="text-[var(--text-secondary)] hidden sm:inline">
          ({user.name})
        </span>
      </div>

      <div className="flex items-center gap-1">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`
              px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer
              ${
                role === r.id
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--border)]'
              }
            `}
          >
            <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
            <span className="hidden xs:inline">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
