/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/formatters';

export const CourierOverviewView: React.FC = () => {
  const { courierIsAvailable, setCourierIsAvailable } = useAuth();

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Courier Console: Availability & Metrics */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCourierIsAvailable(!courierIsAvailable)}
              className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label={courierIsAvailable ? 'Cambiar a no disponible' : 'Cambiar a disponible'}
            >
              <div
                className={`
                  w-12 h-7 rounded-full transition-colors relative
                  ${courierIsAvailable ? 'bg-[var(--success)]' : 'bg-[var(--surface-alt)]'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full bg-white absolute top-1 transition-transform shadow-xs
                    ${courierIsAvailable ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </div>
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    courierIsAvailable ? 'bg-[var(--success)] animate-pulse' : 'bg-stone-400'
                  }`}
                />
                <span className="font-bold text-sm text-[var(--text)]">
                  {courierIsAvailable ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {courierIsAvailable
                  ? 'Recibiendo ofertas por cola y proximidad'
                  : 'Desconectado de la cola de pedidos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[var(--surface-soft)] px-2.5 py-1 rounded-full border border-[var(--border)]">
            <span className="material-symbols-outlined text-[var(--success)] text-[14px] fill-icon">
              cell_tower
            </span>
            <span className="text-[10px] font-bold text-[var(--text)]">GPS Óptimo</span>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-3">
          <div className="bg-[var(--surface-alt)] rounded-xl p-2.5">
            <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
              Ganancias Hoy
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-[var(--text)]">
                {formatMoney(14200, false)}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-bold">ARS</span>
            </div>
            <span className="text-[10px] text-[var(--success)] flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> 6 envíos
            </span>
          </div>

          <div className="bg-[var(--surface-alt)] rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--brand)]">🏆 Pozo Mensual</span>
              <span className="material-symbols-outlined text-[var(--brand)] text-[14px]">
                arrow_forward
              </span>
            </div>
            <div className="mt-0.5">
              <span className="text-xs font-bold text-[var(--text)]">
                {formatMoney(51500, false)} <span className="text-[10px] text-[var(--text-secondary)]">ARS</span>
              </span>
              <span className="text-[10px] text-[var(--brand)] block font-semibold">
                +$5.200 hoy por metas
              </span>
            </div>
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
          Estructura base del panel de cadete configurada. En la <strong>Etapa 4</strong> se
          implementará la recepción de ofertas en tiempo real, el temporizador de 60 segundos,
          la gestión de tramos de entrega y el cálculo transparente de propinas.
        </p>
      </div>
    </div>
  );
};
