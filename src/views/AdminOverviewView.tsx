/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { formatMoney } from '../utils/formatters';

export const AdminOverviewView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Admin Operations Metric Card */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">
              admin_panel_settings
            </span>
            <h2 className="text-sm font-bold text-[var(--text)]">Consola de Operaciones</h2>
          </div>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
            En línea
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Pedidos Activos
            </span>
            <span className="text-xl font-extrabold text-[var(--brand)]">8</span>
          </div>
          <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Cadetes Conectados
            </span>
            <span className="text-xl font-extrabold text-emerald-600">12</span>
          </div>
          <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Comercios Abiertos
            </span>
            <span className="text-xl font-extrabold text-[var(--text)]">24</span>
          </div>
          <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Volumen Hoy
            </span>
            <span className="text-sm font-extrabold text-[var(--text)]">
              {formatMoney(248900, false)}
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
          Estructura base del panel de administración configurada. En la <strong>Etapa 5</strong> se
          implementará la auditoría operativa integral, control de incidencias y gestión de reglas
          conforme al contrato backend.
        </p>
      </div>
    </div>
  );
};
