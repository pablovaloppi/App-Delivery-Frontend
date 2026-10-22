/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { merchantService, StoreSettings } from '../../services/api/merchantService';
import { Button } from '../../components/ui/Button';

export const MerchantSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    isOpen: true,
    estimatedPrepTimeMin: 20,
    estimatedPrepTimeMax: 30,
    acceptsAutomatedDispatch: true,
    alertSoundEnabled: true,
    autoAcceptOrders: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    merchantService.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await merchantService.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 select-none pb-24">
      {/* Operating Status Banner */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Disponibilidad del Local
          </h2>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              settings.isOpen
                ? 'bg-emerald-50 text-[var(--success)] border border-emerald-300'
                : 'bg-stone-100 text-[var(--text-secondary)] border border-stone-300'
            }`}
          >
            {settings.isOpen ? 'Abierto al Público' : 'Cerrado Temporalmente'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text)]">Recepción de Pedidos en App</p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Permitir que clientes de la zona agreguen al carrito
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings((s) => ({ ...s, isOpen: !s.isOpen }))}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
              settings.isOpen ? 'bg-[var(--success)]' : 'bg-[var(--surface-alt)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                settings.isOpen ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Kitchen Prep Time Settings */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Tiempos de Cocina
          </h2>
          <span className="material-symbols-outlined text-[18px] text-[var(--brand)]">timer</span>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="prep-time-select" className="text-xs font-bold text-[var(--text)] block">
            Tiempo estimado de preparación:
          </label>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Afecta el ETA dinámico que ven los clientes y el momento de despacho al cadete.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { min: 15, max: 25 },
              { min: 20, max: 30 },
              { min: 30, max: 45 },
            ].map((t) => {
              const isSelected =
                settings.estimatedPrepTimeMin === t.min && settings.estimatedPrepTimeMax === t.max;
              return (
                <button
                  key={`${t.min}-${t.max}`}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      estimatedPrepTimeMin: t.min,
                      estimatedPrepTimeMax: t.max,
                    }))
                  }
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
                      : 'border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-secondary)]'
                  }`}
                >
                  {t.min}-{t.max} min
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Automation & Sound Preferences */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pb-2 border-b border-[var(--border)]">
          Alertas & Despacho
        </h2>

        <div className="space-y-3 divide-y divide-[var(--border)] text-xs">
          {/* Sound Alerts */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-bold text-[var(--text)]">Sonido de Nueva Comanda</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Timbre continuo hasta que la cocina acepte el pedido
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((s) => ({ ...s, alertSoundEnabled: !s.alertSoundEnabled }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.alertSoundEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--surface-alt)]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.alertSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Automated Dispatch */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-[var(--text)]">Solicitar Cadete Automáticamente</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Emitir oferta al pasar el pedido a preparación
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  acceptsAutomatedDispatch: !s.acceptsAutomatedDispatch,
                }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.acceptsAutomatedDispatch ? 'bg-[var(--brand)]' : 'bg-[var(--surface-alt)]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.acceptsAutomatedDispatch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="pt-2">
        <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
          {savedSuccess ? '¡Cambios Guardados Exitosamente!' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
};
