/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { formatMoney } from '../utils/formatters';
import { useEcosystem } from '../context/EcosystemContext';
import { mockActiveOrder } from '../data/mockData';

export const CustomerOrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const { openReviewModal } = useEcosystem();

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Segmented Tab Bar */}
      <div className="p-1 bg-[var(--surface-alt)] rounded-xl flex items-center justify-between border border-[var(--border)]/60">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`
            flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer
            ${
              activeTab === 'current'
                ? 'bg-[var(--surface)] text-[var(--brand)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span>En curso</span>
          <span className="bg-[var(--brand)] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            1
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`
            flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer
            ${
              activeTab === 'history'
                ? 'bg-[var(--surface)] text-[var(--brand)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          <span>Historial</span>
        </button>
      </div>

      {/* Active Ongoing Order Card */}
      {activeTab === 'current' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Orden en preparación y ruta
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--brand)] font-bold">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-ping" />
              EN VIVO
            </span>
          </div>

          <article className="bg-[var(--surface)] rounded-2xl p-4 border-2 border-[var(--brand)]/30 shadow-md relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[var(--surface-alt)] border border-[var(--border)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF3xpIpQOkkFvrE-DxH3-6H85GrFANoFNX0xJzD8Eovo6vTtze2h1PiG_hGVHLE49FlPXnlttETQVTlF_Us61TG7Yefr-DWhp0G06S7MYnpAmMwvznnPe6WhVV-JpoDyRfXL-KXJv4gC26ZjNg_Qo-BdwfOdla-CJ7xfb9yDyWK_Nfp1onQM_s4jgqxTWGVhk4X-i5s6GnLrpivNxGla0AnGZTjMi_OPwbaml6zhyCqYvvmAo68VnSEw"
                  alt="Pizzería Napolitana Gourmet"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-bold text-sm text-[var(--text)] truncate">
                    Pizzería Napolitana Gourmet
                  </h3>
                  <span className="text-[10px] text-[var(--text-secondary)] shrink-0 font-bold">
                    #1042
                  </span>
                </div>
                <p className="text-xs text-[var(--brand)] font-bold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] animate-pulse">moped</span>
                  <span>En camino • Llegada aprox. 18 min</span>
                </p>

                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-[var(--surface-alt)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--brand)] h-full rounded-full w-3/4 transition-all duration-500" />
                </div>
                <div className="flex justify-between items-center mt-1 text-[10px] text-[var(--text-secondary)] font-medium">
                  <span>Despachado</span>
                  <span className="text-[var(--text)] font-bold">En tu zona</span>
                  <span>Entrega</span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] block">
                  Repartidor asignado
                </span>
                <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[var(--text-secondary)]">
                    sports_motorsports
                  </span>
                  <span>Carlos G.</span>
                  <span className="material-symbols-outlined text-[13px] text-amber-500 fill-icon">star</span>
                  <span>4.9</span>
                </span>
              </div>

              <button
                type="button"
                className="h-10 px-4 bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Rastrear</span>
                <span className="material-symbols-outlined text-[16px]">location_searching</span>
              </button>
            </div>
          </article>
        </section>
      )}

      {/* Historical Orders List */}
      <section className="space-y-3 pb-2">
        <h2 className="text-sm font-bold text-[var(--text)]">Pedidos anteriores</h2>

        {/* Previous Order 1 */}
        <article className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-start justify-between pb-2.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--surface-alt)] shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzi3lvVFx6x5AWJdyQ162BZlQ2w6a4BKGyra4RxJCC8edGMPU6EsRqZWPIn_0l9uyn75duh1VWsNzghAyRVH5_XEnx2bUBeRIYiydxHFKzfVEKj0u2VzxivF9dRp5jrRx1dNhyf_BpuIYy3jq5Ekzjl2dWl3t5urcXsf_u8HwBfbXGJx7D1UsQssqZYUCFnl-UvUVGl6qxaWSKX2nuNAvgd5mavN5AtIwEHdtHGaNkpeF6oka2BSh-4w"
                  alt="Pizzería Napolitana"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] truncate">
                  Pizzería Napolitana Gourmet
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Pedido #1038 • Ayer, 21:15 hs</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              <span className="material-symbols-outlined text-[12px] fill-icon">check_circle</span>
              Entregado
            </span>
          </div>

          <div className="space-y-1 text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>1x Pizza Margherita Especial</span>
              <span className="text-[var(--text)] font-semibold">{formatMoney(12500, false)}</span>
            </div>
            <div className="flex justify-between">
              <span>1x Coca-Cola Sin Azúcar 1.5L</span>
              <span className="text-[var(--text)] font-semibold">{formatMoney(2700, false)}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Monto total</span>
              <span className="text-sm font-extrabold text-[var(--text)]">
                {formatMoney(15200)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openReviewModal({ ...mockActiveOrder, orderNumber: 1038, id: 'ord-1038' }, 'merchant')}
                className="h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-icon">
                  star
                </span>
                <span>Valorar (+50 pts)</span>
              </button>
              <button
                type="button"
                className="h-9 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                <span>Repetir</span>
              </button>
            </div>
          </div>
        </article>

        {/* Previous Order 2 */}
        <article className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-start justify-between pb-2.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--surface-alt)] shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlOFJavvyfzpUXVazftTgVkrnk8vVhPr2CmKAde9AEmAdqjZiAbHZZB-mqTuVV72Cs92GnvE31oxSerUXCpQ8Qe9yUEEWuNJ8sBlwNp_FKfSXNZRoJTMZ9yUj6FdRsc2Lvo1ag28qIUxnIECKxUwzsXK0Tyc3bJaphno2t7_gPK5CDoGQAJovG90B9MQEoNi3MfqXRrUOciWck8URlxy_ZLBd4bT8DZblfh2iAFnLOE-2OPmeIsfkR1w"
                  alt="Burger Station"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] truncate">Burger Station</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Pedido #1012 • 14 Sep, 13:40 hs</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              <span className="material-symbols-outlined text-[12px] fill-icon">check_circle</span>
              Entregado
            </span>
          </div>

          <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Monto total</span>
              <span className="text-sm font-extrabold text-[var(--text)]">
                {formatMoney(18400)}
              </span>
            </div>
            <button
              type="button"
              className="h-9 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">replay</span>
              <span>Repetir</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
};
