/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CourierOfferVM } from '../../types';
import { formatMoney } from '../../utils/formatters';
import { calculateSecondsRemaining } from '../../utils/courierLogic';

interface CourierOfferCardProps {
  offer: CourierOfferVM;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onExpire: () => void;
}

export const CourierOfferCard: React.FC<CourierOfferCardProps> = ({
  offer,
  onAccept,
  onReject,
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    calculateSecondsRemaining(offer.expiresAt),
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const totalSeconds = 60;

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateSecondsRemaining(offer.expiresAt);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offer.expiresAt, onExpire]);

  const percentage = Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100));
  const isUrgent = secondsLeft < 15;
  const totalAmount = offer.guaranteedPayment.amount + offer.tip.amount;

  const handleAcceptClick = () => {
    setIsAccepting(true);
    onAccept(offer.id);
  };

  const handleConfirmReject = () => {
    setShowRejectConfirm(false);
    onReject(offer.id);
  };

  return (
    <section
      id="activeOfferCard"
      aria-label="Nueva oferta de entrega"
      className="bg-[var(--surface)] rounded-2xl border-2 border-[var(--brand)] shadow-xl overflow-hidden relative select-none animate-in fade-in duration-200"
    >
      {/* Header de Alerta & Temporizador de 60 Segundos */}
      <div className="bg-[var(--brand-soft)] px-4 py-2.5 border-b border-[var(--brand)]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--brand)]" />
          </span>
          <span className="text-xs font-extrabold text-[var(--brand)] tracking-tight uppercase">
            NUEVA OFERTA DE ENTREGA
          </span>
        </div>

        {/* Countdown Pill Con Icono */}
        <div
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xs transition-colors
            ${
              isUrgent
                ? 'bg-red-50 text-[var(--error)] border-red-300'
                : 'bg-[var(--surface)] text-[var(--brand)] border-[var(--brand)]/30'
            }
          `}
        >
          <span
            className={`material-symbols-outlined text-[15px] ${
              isUrgent ? 'animate-bounce' : 'animate-spin'
            }`}
            style={{ animationDuration: isUrgent ? '0.5s' : '4s' }}
          >
            hourglass_top
          </span>
          <span className="text-xs font-black tracking-wider">
            {secondsLeft > 0 ? `${secondsLeft}s` : 'Expirado'}
          </span>
        </div>
      </div>

      {/* Barra visual regresiva animada de 60s */}
      <div className="w-full bg-[var(--surface-alt)] h-1.5 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-r-full ${
            isUrgent ? 'bg-[var(--error)]' : 'bg-[var(--brand)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="p-4 space-y-3.5">
        {/* Compensación Principal Destacada (Monto Hero) */}
        <div className="flex items-end justify-between bg-[var(--surface-alt)] p-3 rounded-xl border border-[var(--border)]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block">
              Total a cobrar garantizado
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[var(--brand)]">
                {formatMoney(totalAmount, false)}
              </span>
              <span className="text-xs font-bold text-[var(--text)]">ARS</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[13px] fill-icon">verified</span>
              Pago directo
            </span>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold">
              Incluye 100% de propina
            </p>
          </div>
        </div>

        {/* Trayecto y Nodos de Ruta (Retiro -> Entrega) */}
        <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
          {/* Nodo 1: Retiro (Comercio) */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center ring-4 ring-[var(--surface)] shadow-xs">
              <span className="material-symbols-outlined text-[11px]">storefront</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[var(--text)]">
                  {offer.merchantName}
                </span>
                <span className="text-[9px] bg-[var(--surface-alt)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-bold">
                  Listo en cocina
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {offer.merchantAddress} • Retiro de comanda #{offer.orderNumber}
              </p>
            </div>
          </div>

          {/* Nodo 2: Destino (Cliente) */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[var(--success)] text-white flex items-center justify-center ring-4 ring-[var(--surface)] shadow-xs">
              <span className="material-symbols-outlined text-[11px]">home_pin</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[var(--text)]">
                  {offer.customerZone}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
                  (a {offer.distanceKm} km del local)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {offer.customerAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Métricas del Viaje: Distancia + Tiempo estimado */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[16px]">route</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Distancia total</span>
              <span className="font-bold text-[var(--text)]">{offer.distanceKm} km</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Tiempo estimado</span>
              <span className="font-bold text-[var(--text)]">~{offer.estimatedMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Desglose transparente de ganancias */}
        <div className="bg-[var(--surface-soft)] p-2.5 rounded-xl border border-[var(--border)] space-y-1 text-xs">
          <div className="flex justify-between items-center text-[var(--text-secondary)]">
            <span>Ganancia de entrega base:</span>
            <span className="font-bold text-[var(--text)]">
              {formatMoney(offer.guaranteedPayment)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--success)] font-bold flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[13px]">volunteer_activism</span>
              Propina 100% para vos:
            </span>
            <span className="font-bold text-[var(--success)]">+{formatMoney(offer.tip)}</span>
          </div>
        </div>

        {/* Microcopy de Libertad y Transparencia */}
        <div className="flex items-start gap-2 bg-[var(--surface-alt)]/70 p-2.5 rounded-xl border border-[var(--border)]">
          <span className="material-symbols-outlined text-[var(--text-secondary)] text-[15px] shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
            Las ofertas se distribuyen considerando cola y proximidad. Rechazar o dejar expirar no
            penaliza tu reputación.
          </p>
        </div>

        {/* Modal de confirmación de rechazo */}
        {showRejectConfirm ? (
          <div className="p-3 bg-[var(--surface-alt)] rounded-xl border border-[var(--border)] space-y-2">
            <p className="text-xs font-bold text-[var(--text)]">
              ¿Deseas omitir esta oferta?
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              No afecta tu reputación ni tu calificación de cadete. Continuarás en la cola para
              nuevos pedidos cercanos.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text)] cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-lg bg-stone-700 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer"
              >
                Omitir Oferta
              </button>
            </div>
          </div>
        ) : (
          /* Acciones Principales (Min 44px Touch Targets) */
          <div className="space-y-2 pt-1">
            <button
              type="button"
              id="btnAccept"
              onClick={handleAcceptClick}
              disabled={isAccepting || secondsLeft <= 0}
              className="w-full min-h-[48px] bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isAccepting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Asignando pedido...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Aceptar Entrega ({formatMoney(totalAmount)})</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btnReject"
              onClick={() => setShowRejectConfirm(true)}
              className="w-full min-h-[44px] bg-transparent hover:bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-secondary)] active:scale-[0.98] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>Rechazar Oferta</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
