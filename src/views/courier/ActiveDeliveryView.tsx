/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CourierOfferVM } from '../../types';
import { CourierDeliveryPhase } from '../../utils/courierLogic';
import { formatMoney } from '../../utils/formatters';

interface ActiveDeliveryViewProps {
  offer: CourierOfferVM;
  initialPhase: CourierDeliveryPhase;
  onAdvancePhase: () => Promise<CourierDeliveryPhase | null>;
  onFinishDelivery: () => void;
}

export const ActiveDeliveryView: React.FC<ActiveDeliveryViewProps> = ({
  offer,
  initialPhase,
  onAdvancePhase,
  onFinishDelivery,
}) => {
  const [phase, setPhase] = useState<CourierDeliveryPhase>(initialPhase);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalEarnings = offer.guaranteedPayment.amount + offer.tip.amount;

  const handleNextStep = async () => {
    setIsProcessing(true);
    try {
      const nextPhase = await onAdvancePhase();
      if (nextPhase === 'DELIVERED' || !nextPhase) {
        onFinishDelivery();
      } else {
        setPhase(nextPhase);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case 'TO_MERCHANT':
        return {
          stepNum: 1,
          stepTitle: 'Paso 1: Retiro en Comercio',
          bannerText: `Dirigiéndote a ${offer.merchantName}`,
          address: offer.merchantAddress,
          instruction: `Retirar comanda #${offer.orderNumber} empaquetada y lista.`,
          ctaLabel: 'Llegué al Local',
          ctaIcon: 'storefront',
          badge: 'Retiro',
        };
      case 'AT_MERCHANT':
        return {
          stepNum: 2,
          stepTitle: 'Paso 2: Confirmar Retiro',
          bannerText: `En mostrador de ${offer.merchantName}`,
          address: offer.merchantAddress,
          instruction: `Verificá que el número #${offer.orderNumber} coincida en el paquete antes de salir.`,
          ctaLabel: 'Confirmar Retiro e Iniciar Viaje',
          ctaIcon: 'two_wheeler',
          badge: 'En Cocina',
        };
      case 'TO_CUSTOMER':
      default:
        return {
          stepNum: 3,
          stepTitle: 'Paso 3: Entrega al Cliente',
          bannerText: `En camino a ${offer.customerZone}`,
          address: offer.customerAddress,
          instruction: 'Tocar timbre 3B al llegar. 100% de la propina incluida.',
          ctaLabel: `Confirmar Entrega y Cobrar (${formatMoney(totalEarnings)})`,
          ctaIcon: 'task_alt',
          badge: 'Último Tramo',
        };
    }
  };

  const info = getPhaseInfo();

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 select-none pb-24">
      {/* Active Service Status Card */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border-2 border-[var(--brand)] shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand)] animate-ping" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--brand)]">
              Servicio Activo • Pedido #{offer.orderNumber}
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[var(--success)] border border-emerald-300">
            {info.badge}
          </span>
        </div>

        {/* Phase progress visual */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-bold mb-1.5">
            <span>{info.stepTitle}</span>
            <span>{info.stepNum} de 3</span>
          </div>
          <div className="w-full bg-[var(--surface-alt)] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[var(--brand)] h-full transition-all duration-300 rounded-full"
              style={{
                width: phase === 'TO_MERCHANT' ? '33%' : phase === 'AT_MERCHANT' ? '66%' : '100%',
              }}
            />
          </div>
        </div>

        {/* Target Destination Box */}
        <div className="bg-[var(--surface-alt)] p-3 rounded-xl border border-[var(--border)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
            {phase === 'TO_CUSTOMER' ? 'Dirección de Entrega' : 'Punto de Retiro'}
          </span>
          <p className="text-sm font-extrabold text-[var(--text)]">{info.bannerText}</p>
          <p className="text-xs text-[var(--text-secondary)]">{info.address}</p>
          <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-[10px] text-[var(--text)] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[var(--brand)]">info</span>
            <span>{info.instruction}</span>
          </div>
        </div>

        {/* Guaranteed Payout Details */}
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-[var(--text-secondary)]">Ganancia garantizada:</span>
          <span className="font-black text-sm text-[var(--brand)]">
            {formatMoney(totalEarnings)}
          </span>
        </div>

        {/* Primary Phase CTA Button (48px height) */}
        <button
          type="button"
          onClick={handleNextStep}
          disabled={isProcessing}
          className="w-full h-12 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">{info.ctaIcon}</span>
              <span>{info.ctaLabel}</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
};
