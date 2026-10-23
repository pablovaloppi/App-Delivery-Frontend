/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CourierOfferVM } from '../../types';
import {
  courierService,
  CompletedDelivery,
  RewardsPoolData,
} from '../../services/api/courierService';
import { formatMoney } from '../../utils/formatters';
import { CourierOfferCard } from './CourierOfferCard';
import { ActiveDeliveryView } from './ActiveDeliveryView';
import { CourierRewardsModal } from './CourierRewardsModal';
import { useAuth } from '../../context/AuthContext';

export const CourierDashboardView: React.FC = () => {
  const { courierIsAvailable, setCourierIsAvailable } = useAuth();
  const [offer, setOffer] = useState<CourierOfferVM | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [completedList, setCompletedList] = useState<CompletedDelivery[]>([]);
  const [earningsToday, setEarningsToday] = useState<number>(14200);
  const [completedCount, setCompletedCount] = useState<number>(6);
  const [rewardsPool, setRewardsPool] = useState<RewardsPoolData | null>(null);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

  const loadData = async () => {
    const currentOffer = await courierService.getCurrentOffer();
    setOffer(currentOffer);

    const active = await courierService.getActiveDelivery();
    setActiveDelivery(active);

    const stats = await courierService.getTodayStats();
    setEarningsToday(stats.earningsToday);
    setCompletedCount(stats.completedDeliveriesCount);

    const completed = await courierService.getTodayCompletedList();
    setCompletedList(completed);

    const pool = await courierService.getRewardsPool();
    setRewardsPool(pool);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptOffer = async (offerId: string) => {
    await courierService.acceptOffer(offerId);
    await loadData();
  };

  const handleRejectOffer = async (offerId: string) => {
    await courierService.rejectOffer(offerId);
    await loadData();
  };

  const handleExpireOffer = async () => {
    if (offer) {
      await courierService.rejectOffer(offer.id);
      await loadData();
    }
  };

  const handleAdvancePhase = async () => {
    const res = await courierService.advanceActiveDeliveryPhase();
    return res;
  };

  const handleFinishDelivery = async () => {
    await loadData();
  };

  const handleResetOffer = () => {
    courierService.resetDemoOffer();
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 select-none pb-24">
      {/* CADETE CONTROL CONSOLE: Toggle Estado & Ganancias */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          {/* Switch de Disponibilidad */}
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
                <span className="font-extrabold text-sm text-[var(--text)]">
                  {courierIsAvailable ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {courierIsAvailable
                  ? 'Recibiendo pedidos por proximidad'
                  : 'Desconectado de la cola de repartos'}
              </p>
            </div>
          </div>

          {/* GPS / Señal Badge */}
          <div className="flex items-center gap-1 bg-[var(--surface-soft)] px-2.5 py-1 rounded-full border border-[var(--border)]">
            <span className="material-symbols-outlined text-[var(--success)] text-[14px] fill-icon">
              cell_tower
            </span>
            <span className="text-[10px] font-bold text-[var(--text)]">GPS Óptimo</span>
          </div>
        </div>

        {/* Métricas Rápidas: Ganancias del Día + Pozo de Recompensas */}
        <div className="grid grid-cols-2 gap-2 pt-3">
          <div className="bg-[var(--surface-alt)] rounded-xl p-2.5">
            <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
              Ganancias Hoy
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-[var(--text)]">
                {formatMoney(earningsToday, false)}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-bold">ARS</span>
            </div>
            <span className="text-[10px] text-[var(--success)] flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>{' '}
              {completedCount} envíos completados
            </span>
          </div>

          <div
            onClick={() => setIsRewardsModalOpen(true)}
            className="bg-[var(--brand-soft)] rounded-xl p-2.5 border border-[var(--brand)]/20 flex flex-col justify-between cursor-pointer hover:border-[var(--brand)]/50 transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--brand)] font-extrabold">🏆 Pozo Mensual</span>
              <span className="material-symbols-outlined text-[var(--brand)] text-[14px]">
                arrow_forward
              </span>
            </div>
            <div className="mt-0.5">
              <div className="text-xs font-black text-[var(--text)] leading-tight">
                {rewardsPool ? formatMoney(rewardsPool.currentPool.amount, false) : '$51.500'}{' '}
                <span className="text-[10px] text-[var(--text-secondary)] font-normal">ARS</span>
              </div>
              <span className="text-[10px] text-[var(--brand)] font-extrabold">
                +${rewardsPool ? rewardsPool.todayGrowth.amount.toLocaleString('es-AR') : '5.200'} hoy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DISPATCH STAGE: Active Delivery OR Active Offer OR Radar Searching State */}
      {activeDelivery ? (
        <ActiveDeliveryView
          offer={activeDelivery.offer}
          initialPhase={activeDelivery.phase}
          onAdvancePhase={handleAdvancePhase}
          onFinishDelivery={handleFinishDelivery}
        />
      ) : offer && courierIsAvailable ? (
        <CourierOfferCard
          offer={offer}
          onAccept={handleAcceptOffer}
          onReject={handleRejectOffer}
          onExpire={handleExpireOffer}
        />
      ) : (
        /* Radar Searching State when idle */
        <section className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mx-auto animate-pulse">
            <span className="material-symbols-outlined text-[32px]">radar</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">
              {courierIsAvailable
                ? 'Buscando nuevos pedidos cercanos...'
                : 'Conectate para recibir pedidos'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto mt-1 leading-relaxed">
              {courierIsAvailable
                ? 'Te avisaremos con sonido y notificación tan pronto un local cercano solicite retiro.'
                : 'Activá el switch Disponible para volver a ingresar a la cola de distribución.'}
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleResetOffer}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--brand-soft)] hover:bg-[var(--brand)] text-[var(--brand)] hover:text-white border border-[var(--brand)]/30 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Simular Nueva Oferta de Reparto (Demo)
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN INFERIOR: RESUMEN DE ENTREGAS COMPLETADAS HOY */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow-xs space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--brand)] text-[20px]">
              task_alt
            </span>
            <h2 className="text-xs font-extrabold text-[var(--text)] uppercase tracking-wider">
              Completados Hoy ({completedList.length})
            </h2>
          </div>
          <span className="text-xs text-[var(--brand)] font-bold">100% cobrado</span>
        </div>

        <div className="space-y-2.5">
          {completedList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--text)] block truncate">
                    {item.merchantName}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] truncate block">
                    {item.timeAgo} • {item.customerZone}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-black text-[var(--text)] block">
                  {formatMoney(item.payment, false)}
                </span>
                <span className="text-[10px] text-[var(--success)] font-bold">
                  +{formatMoney(item.tip, false)} propina
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Asistencia y Soporte Inmediato al Cadete */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[16px]">headset_mic</span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-semibold">
              ¿Inconvenientes en ruta?
            </span>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-[var(--brand)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Soporte 24/7</span>
          </button>
        </div>
      </section>

      {/* Rewards Pool Modal */}
      {rewardsPool && (
        <CourierRewardsModal
          isOpen={isRewardsModalOpen}
          onClose={() => setIsRewardsModalOpen(false)}
          poolData={rewardsPool}
        />
      )}
    </div>
  );
};
