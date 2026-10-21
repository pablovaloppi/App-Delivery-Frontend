/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/formatters';

export const MerchantOverviewView: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Store Control Console Header */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover border border-[var(--border)]"
            />
            <div>
              <h2 className="text-sm font-bold text-[var(--text)] line-clamp-1">{user.name}</h2>
              <span className="text-xs text-[var(--text-secondary)]">Panel de Cocina & Pedidos</span>
            </div>
          </div>

          {/* Open/Close Store Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer
                ${
                  isOpen
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300'
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                }`}
              />
              <span>{isOpen ? 'Abierto' : 'Cerrado'}</span>
            </button>
          </div>
        </div>

        {/* Quick Operations Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div className="bg-[var(--surface-alt)] p-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Nuevos
            </span>
            <span className="text-lg font-extrabold text-[var(--brand)]">2</span>
          </div>
          <div className="bg-[var(--surface-alt)] p-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              En Cocina
            </span>
            <span className="text-lg font-extrabold text-amber-600">3</span>
          </div>
          <div className="bg-[var(--surface-alt)] p-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Ventas Hoy
            </span>
            <span className="text-sm font-extrabold text-[var(--text)]">
              {formatMoney(42600, false)}
            </span>
          </div>
        </div>
      </section>

      {/* Notice regarding roadmap etapas */}
      <div className="p-3.5 rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)]/20 text-xs text-[var(--text)]">
        <div className="flex items-center gap-2 font-bold text-[var(--brand)] mb-1">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Etapa 1: Arquitectura y Sistema Visual</span>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Estructura base del panel de comercio configurada. En la <strong>Etapa 3</strong> se
          implementará el flujo completo de pedidos en tiempo real, transiciones de cocina y gestión
          de catálogo según especificaciones del SRS.
        </p>
      </div>
    </div>
  );
};
