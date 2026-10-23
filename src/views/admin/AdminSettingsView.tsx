/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlatformFeeConfig } from '../../types/admin';
import { formatMoney } from '../../utils/formatters';
import { calculateOrderPricing, calculatePoolDistribution } from '../../utils/adminLogic';

interface AdminSettingsViewProps {
  config: PlatformFeeConfig;
  onSaveConfig: (updated: Partial<PlatformFeeConfig>) => Promise<void>;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<PlatformFeeConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Dynamic Fare Simulator State
  const [simDistance, setSimDistance] = useState<number>(2.8);
  const [simSubtotal, setSimSubtotal] = useState<number>(14500);
  const [simIsRain, setSimIsRain] = useState<boolean>(formData.rainSurchargeEnabled);
  const [simIsNight, setSimIsNight] = useState<boolean>(formData.nightRushEnabled);

  const poolDistribution = calculatePoolDistribution(formData.courierRewardsPoolCurrent);

  const simulatedPricing = calculateOrderPricing(simDistance, simSubtotal, formData, {
    isRainActive: simIsRain,
    isNightRush: simIsNight,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(formData);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const poolPercent = Math.min(
    100,
    Math.round((formData.courierRewardsPoolCurrent / formData.courierRewardsPoolMonthlyTarget) * 100)
  );

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {saveToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Reglas operativas y tarifas actualizadas en toda la plataforma.</span>
        </div>
      )}

      {/* Monthly Courier Rewards Pool Gauge */}
      <section className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[22px]">
              emoji_events
            </span>
            <div>
              <h3 className="text-xs font-extrabold text-[var(--text)]">
                Fondo Solidario y Pozo Mensual de Cadetes (CABA)
              </h3>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Financiado de manera transparente con el 2% de la comisión del marketplace
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-extrabold text-[var(--brand)]">
            {formatMoney(formData.courierRewardsPoolCurrent, false)} /{' '}
            {formatMoney(formData.courierRewardsPoolMonthlyTarget, false)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Progreso de recaudación mensual</span>
            <span className="font-bold text-[var(--text)]">{poolPercent}% alcanzado</span>
          </div>
          <div className="h-2.5 bg-[var(--surface-alt)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-[var(--brand)] rounded-full transition-all duration-500"
              style={{ width: `${poolPercent}%` }}
            />
          </div>
        </div>

        {/* Reward Tiers Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>Nivel Oro (Top 3)</span>
            </div>
            <div className="text-sm font-extrabold text-amber-900 dark:text-amber-100">
              {formatMoney(poolDistribution.perGoldCadete, false)}
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400">por cadete (50% pozo)</span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">military_tech</span>
              <span>Nivel Plata (Siguientes 7)</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {formatMoney(poolDistribution.perSilverCadete, false)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">por cadete (30% pozo)</span>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/40 p-2.5 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-1.5 text-orange-800 dark:text-orange-300 font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>Nivel Bronce (15 cadetes)</span>
            </div>
            <div className="text-sm font-extrabold text-orange-900 dark:text-orange-100">
              {formatMoney(poolDistribution.perBronzeCadete, false)}
            </div>
            <span className="text-[10px] text-orange-700 dark:text-orange-400">por cadete (20% pozo)</span>
          </div>
        </div>
      </section>

      {/* Configuration Form */}
      <form
        onSubmit={handleSave}
        className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">
              price_change
            </span>
            <h3 className="text-xs font-extrabold text-[var(--text)]">
              Políticas de Tarifas y Recargos en CABA
            </h3>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] font-mono">
            Versión Operativa 2026.1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Base Fare */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text)] block">
              Tarifa Base de Despacho (ARS):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                $
              </span>
              <input
                type="number"
                value={formData.baseFare}
                onChange={(e) =>
                  setFormData({ ...formData, baseFare: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">Cubre el arranque inicial del cadete</span>
          </div>

          {/* Per Km Fare */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text)] block">
              Precio por Kilómetro Adicional:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                $
              </span>
              <input
                type="number"
                value={formData.perKmFare}
                onChange={(e) =>
                  setFormData({ ...formData, perKmFare: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-7 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">Calculado por GPS en tiempo real</span>
          </div>

          {/* Platform Fair Commission */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text)] block">
              Comisión Justa al Comercio (%):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={formData.platformFairCommissionPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platformFairCommissionPercent: Number(e.target.value),
                  })
                }
                className="w-full pl-3 pr-8 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                %
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Vs. 25-30% de plataformas monopólicas
            </span>
          </div>

          {/* Rain Surcharge Amount & Toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[var(--text)]">
                Recargo por Lluvia (ARS):
              </label>
              <input
                type="checkbox"
                checked={formData.rainSurchargeEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, rainSurchargeEnabled: e.target.checked })
                }
                className="rounded accent-[var(--brand)] cursor-pointer"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                $
              </span>
              <input
                type="number"
                value={formData.rainSurchargeAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rainSurchargeAmount: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full pl-7 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">
              {formData.rainSurchargeEnabled ? 'Activo cuando llueve' : 'Deshabilitado'}
            </span>
          </div>

          {/* Night Rush Amount & Toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[var(--text)]">
                Recargo Nocturno / Pico (ARS):
              </label>
              <input
                type="checkbox"
                checked={formData.nightRushEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, nightRushEnabled: e.target.checked })
                }
                className="rounded accent-[var(--brand)] cursor-pointer"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                $
              </span>
              <input
                type="number"
                value={formData.nightRushAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nightRushAmount: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full pl-7 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">
              {formData.nightRushEnabled ? 'Horario 20:00 a 00:00' : 'Deshabilitado'}
            </span>
          </div>

          {/* Pool Contribution % */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text)] block">
              Aporte al Pozo Cadetes (% com):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={formData.courierPoolAllocationPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courierPoolAllocationPercent: Number(e.target.value),
                  })
                }
                className="w-full pl-3 pr-8 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">
                %
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">
              Del total retenido por la plataforma
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{isSaving ? 'Guardando...' : 'Aplicar y Guardar Reglas'}</span>
          </button>
        </div>
      </form>

      {/* Live Interactive Delivery Fee Simulator */}
      <section className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
          <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">
            calculate
          </span>
          <div>
            <h3 className="text-xs font-extrabold text-[var(--text)]">
              Simulador en Tiempo Real del Modelo Justo FoodieLocal
            </h3>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Probá cómo se distribuyen los fondos entre cliente, cadete y plataforma según distancia y clima
            </p>
          </div>
        </div>

        {/* Simulator controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Distance slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[var(--text)]">
              <span>Distancia de entrega:</span>
              <span className="text-[var(--brand)]">{simDistance} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={simDistance}
              onChange={(e) => setSimDistance(Number(e.target.value))}
              className="w-full accent-[var(--brand)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
              <span>0.5 km (Cercanía)</span>
              <span>10 km (Interbarrial)</span>
            </div>
          </div>

          {/* Subtotal slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[var(--text)]">
              <span>Subtotal comanda:</span>
              <span className="text-[var(--brand)]">{formatMoney(simSubtotal, false)}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="35000"
              step="500"
              value={simSubtotal}
              onChange={(e) => setSimSubtotal(Number(e.target.value))}
              className="w-full accent-[var(--brand)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
              <span>$3.000</span>
              <span>$35.000</span>
            </div>
          </div>
        </div>

        {/* Surge checkboxes */}
        <div className="flex items-center gap-4 text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simIsRain}
              onChange={(e) => setSimIsRain(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span className="font-semibold text-[var(--text)] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-blue-500">
                thunderstorm
              </span>
              Lluvia (+${formData.rainSurchargeAmount})
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simIsNight}
              onChange={(e) => setSimIsNight(e.target.checked)}
              className="rounded accent-purple-600"
            />
            <span className="font-semibold text-[var(--text)] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-purple-500">
                nightlight
              </span>
              Horario Pico (+${formData.nightRushAmount})
            </span>
          </label>
        </div>

        {/* Simulator Results Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="bg-[var(--surface-alt)] p-3 rounded-xl border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
              Tarifa Envío Cliente
            </span>
            <div className="text-lg font-extrabold text-[var(--text)] mt-0.5">
              {formatMoney(simulatedPricing.customerDeliveryFee.amount, false)}
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">
              Base: ${simulatedPricing.breakdown.baseFare} + Distancia: $
              {simulatedPricing.breakdown.distanceCharge}
            </span>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Pago Directo al Cadete
            </span>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatMoney(simulatedPricing.courierEarnings.amount, false)}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
              100% de la tarifa sin retenciones
            </span>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-xl border border-orange-200 dark:border-orange-800">
            <span className="text-[10px] uppercase font-bold text-orange-800 dark:text-orange-300 block">
              Comisión Ética Plataforma ({formData.platformFairCommissionPercent}%)
            </span>
            <div className="text-lg font-extrabold text-[var(--brand)] mt-0.5">
              {formatMoney(simulatedPricing.platformFairTake.amount, false)}
            </div>
            <span className="text-[10px] text-orange-700 dark:text-orange-400">
              Aporte Pozo Cadetes: {formatMoney(simulatedPricing.courierPoolContribution.amount, false)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
