/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketplaceMetrics, ZoneDeliveryStats, AdminSubTab } from '../../types/admin';
import { formatMoney } from '../../utils/formatters';

interface AdminMetricsOverviewProps {
  metrics: MarketplaceMetrics;
  zones: ZoneDeliveryStats[];
  onNavigateTab: (tab: AdminSubTab) => void;
  onToggleRain: () => void;
}

export const AdminMetricsOverview: React.FC<AdminMetricsOverviewProps> = ({
  metrics,
  zones,
  onNavigateTab,
  onToggleRain,
}) => {
  return (
    <div className="space-y-4">
      {/* Rain Alert Banner */}
      {metrics.rainSurchargeActive ? (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">thunderstorm</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                Alerta de Clima Adverso Activa (CABA)
              </h4>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-bold">
                +$450 ARS Recargo Automático
              </span>
            </div>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300 mt-0.5 leading-relaxed">
              El recargo por lluvia se traslada 100% como incentivo a los cadetes en calle para
              garantizar disponibilidad y frenado seguro en calzada mojada.
            </p>
          </div>
          <button
            onClick={onToggleRain}
            type="button"
            className="text-xs text-blue-700 dark:text-blue-300 font-bold hover:underline shrink-0"
          >
            Desactivar
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
            <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
            <span>Clima Normal: Tarifas estándar y flujo regular de cadetes en CABA.</span>
          </div>
          <button
            onClick={onToggleRain}
            type="button"
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Activar Lluvia
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* GMV */}
        <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Volumen Total (GMV)</span>
            <span className="material-symbols-outlined text-[18px] text-[var(--brand)]">
              payments
            </span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text)]">
            {formatMoney(metrics.dailyGmv.amount, false)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[12px]">trending_up</span>
            {metrics.totalOrdersToday} comandas procesadas hoy
          </span>
        </div>

        {/* Platform Fair Revenue */}
        <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Comisión Justa (6.5%)</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              account_balance_wallet
            </span>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatMoney(metrics.platformRevenue.amount, false)}
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">
            Retención ética transparente
          </span>
        </div>

        {/* Active Couriers */}
        <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cadetes en Flota</span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">
              two_wheeler
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-[var(--text)]">
              {metrics.activeCouriersInTransit + metrics.availableCouriers}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">conectados</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[10px]">
            <span className="text-amber-600 font-bold">{metrics.activeCouriersInTransit} en viaje</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">{metrics.availableCouriers} libres</span>
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">A Tiempo</span>
            <span className="material-symbols-outlined text-[18px] text-[var(--success)]">
              verified
            </span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text)]">
            {metrics.onTimeDeliveryRate}%
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">
            Promedio {metrics.avgDeliveryMinutes} min por entrega
          </span>
        </div>
      </section>

      {/* Urgent Operations Bar */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Pending Disputes Alert */}
        <div
          onClick={() => onNavigateTab('disputes')}
          className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] hover:border-[var(--brand)] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600">
              <span className="material-symbols-outlined text-[22px]">emergency_home</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-[var(--text)]">Disputas e Incidentes</h4>
                {metrics.pendingDisputesCount > 0 && (
                  <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.2 rounded-full">
                    {metrics.pendingDisputesCount} pendientes
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Reembolsos, comidas dañadas o reasignaciones urgentes.
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[var(--text-secondary)] group-hover:text-[var(--brand)] transition-colors">
            chevron_right
          </span>
        </div>

        {/* Partner Approvals Alert */}
        <div
          onClick={() => onNavigateTab('audit')}
          className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] hover:border-[var(--brand)] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-[var(--text)]">Auditoría de Comercios & Cadetes</h4>
                {metrics.pendingAuditsCount > 0 && (
                  <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.2 rounded-full">
                    {metrics.pendingAuditsCount} en revisión
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Bromatología, CUIT, DNI y pólizas de seguro de cadetes.
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[var(--text-secondary)] group-hover:text-[var(--brand)] transition-colors">
            chevron_right
          </span>
        </div>
      </section>

      {/* CABA Operational Zones Heatmap */}
      <section className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand)] text-[20px]">
              map
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Estado de Zonas Operativas (CABA)
            </h3>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {metrics.openMerchantsCount} de {metrics.totalMerchantsCount} comercios abiertos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {zones.map((zone) => {
            const isSurge = zone.demandLevel === 'SURGE';
            const isHigh = zone.demandLevel === 'HIGH';

            return (
              <div
                key={zone.zoneName}
                className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)] truncate">
                    {zone.zoneName}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      isSurge
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : isHigh
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {zone.demandLevel === 'SURGE' ? 'Alta Demanda' : zone.demandLevel === 'HIGH' ? 'Foco Activo' : 'Normal'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>{zone.activeOrders} en curso</span>
                  <span>{zone.availableCouriers} cadetes libres</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border)]/50">
                  <span className="material-symbols-outlined text-[13px] text-amber-500">
                    schedule
                  </span>
                  <span>ETA promedio: {zone.avgEtaMinutes} min</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
