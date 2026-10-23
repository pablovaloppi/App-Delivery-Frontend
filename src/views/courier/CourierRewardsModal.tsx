/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RewardsPoolData } from '../../services/api/courierService';
import { formatMoney } from '../../utils/formatters';

interface CourierRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolData: RewardsPoolData;
}

export const CourierRewardsModal: React.FC<CourierRewardsModalProps> = ({
  isOpen,
  onClose,
  poolData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pool-modal-title"
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-xs select-none"
    >
      <div className="w-full max-w-[430px] bg-[var(--bg)] max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col relative shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">emoji_events</span>
            <h2 id="pool-modal-title" className="text-base font-bold text-[var(--text)]">
              Pozo de Recompensas Mensual
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] text-[var(--text)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-br from-[var(--surface-soft)] to-[var(--surface-alt)] p-4 rounded-2xl border-2 border-[var(--brand)]/30 text-center space-y-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[var(--brand)]">
              Pozo Acumulado • {poolData.periodLabel}
            </span>
            <div className="text-3xl font-black text-[var(--brand)]">
              {formatMoney(poolData.currentPool)}
            </div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] text-[10px] font-extrabold border border-emerald-300">
              +{formatMoney(poolData.todayGrowth)} hoy por entregas cumplidas
            </span>
          </div>

          {/* Courier Position */}
          <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center font-extrabold text-sm">
                #{poolData.courierRankPosition}
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text)] block">Tu posición actual</span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  De {poolData.totalActiveCouriers} cadetes activos en tu zona
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[var(--brand)] uppercase">Nivel Diamante</span>
          </div>

          {/* Milestones */}
          <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] space-y-2">
            <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
              Objetivos del Mes
            </h3>
            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Próximo hito del pozo:</span>
                <span className="font-bold text-[var(--text)]">
                  {formatMoney(poolData.nextMilestone)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tope máximo mensual:</span>
                <span className="font-bold text-[var(--text)]">
                  {formatMoney(poolData.maxPoolCap)}
                </span>
              </div>
            </div>
          </div>

          {/* Transparency Rules */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
              <span className="material-symbols-outlined text-[16px] text-[var(--brand)]">verified</span>
              <span>Reglas Claras y Transparentes</span>
            </div>
            <ul className="text-[10px] space-y-1 list-disc pl-4 leading-relaxed">
              <li>Rechazar o dejar expirar ofertas no reduce tu puntaje ni tu posición.</li>
              <li>100% de las propinas son directas e independientes del pozo mensual.</li>
              <li>El pozo se liquida de forma garantizada el último día hábil del mes.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[var(--brand)] text-white text-xs font-bold cursor-pointer active:scale-98 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
