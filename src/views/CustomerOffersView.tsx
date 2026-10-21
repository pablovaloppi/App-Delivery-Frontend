/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { formatMoney } from '../utils/formatters';

export const CustomerOffersView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-pressed)] text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[20px] fill-icon">local_offer</span>
          <span className="text-xs uppercase font-extrabold tracking-wider">Cupones y Descuentos</span>
        </div>
        <h2 className="text-xl font-extrabold leading-tight">Ahorrá hasta 35% OFF</h2>
        <p className="text-xs text-white/90 mt-1">
          Promociones válidas para comercios adheridos de tu zona.
        </p>
      </div>

      {/* Available Coupons */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text)]">Cupones Activos</h3>

        {/* Coupon 1 */}
        <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[var(--brand-soft)] text-[var(--brand)] font-extrabold text-xs tracking-wider border border-[var(--brand)]/30 font-mono">
                PIZZA2000
              </span>
              <span className="text-[10px] text-[var(--success)] font-bold">Válido</span>
            </div>
            <p className="text-xs font-bold text-[var(--text)]">
              Descuento directo de {formatMoney(2000, false)} ARS
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">En pedidos superiores a $12.000 ARS</p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--border)] text-xs font-bold text-[var(--text)] active:scale-95 transition-all cursor-pointer"
          >
            Copiar
          </button>
        </div>

        {/* Coupon 2 */}
        <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[var(--brand-soft)] text-[var(--brand)] font-extrabold text-xs tracking-wider border border-[var(--brand)]/30 font-mono">
                ENVIOGRATIS
              </span>
              <span className="text-[10px] text-[var(--success)] font-bold">Válido</span>
            </div>
            <p className="text-xs font-bold text-[var(--text)]">
              100% de descuento en costo de envío
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">En compras mayores a $10.000 ARS</p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--border)] text-xs font-bold text-[var(--text)] active:scale-95 transition-all cursor-pointer"
          >
            Copiar
          </button>
        </div>
      </section>
    </div>
  );
};
