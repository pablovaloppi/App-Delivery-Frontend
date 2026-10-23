/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEcosystem } from '../context/EcosystemContext';

interface CustomerProfileViewProps {
  onOpenAddresses?: () => void;
  onOpenPaymentMethods?: () => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  onOpenAddresses,
  onOpenPaymentMethods,
}) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { loyaltyProfile, openLoyaltyModal } = useEcosystem();

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 pb-4">
      {/* Profile Summary Bento Card */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--brand-soft)]/60 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar with Edit Badge */}
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[var(--brand)]/30 p-0.5"
            />
            <button
              type="button"
              aria-label="Editar foto de perfil"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--brand)] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">edit</span>
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base font-bold text-[var(--text)] truncate">{user.name}</h2>
              <span className="material-symbols-outlined text-[16px] text-[var(--brand)] fill-icon">
                verified
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{user.email}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{user.phone}</p>

            <button
              type="button"
              onClick={openLoyaltyModal}
              className="mt-2 inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 hover:bg-amber-500/25 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] fill-icon">
                workspace_premium
              </span>
              <span className="text-[10px] font-black">
                {loyaltyProfile.currentTier === 'VECINO_HABITUAL' ? 'Vecino Habitual' : 'Vecino Notable'} • {loyaltyProfile.totalPoints} pts
              </span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Ribbon (3 columns) */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] grid grid-cols-3 divide-x divide-[var(--border)] text-center">
          <div className="px-1">
            <span className="block text-base font-bold text-[var(--text)]">28</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Pedidos totales</span>
          </div>
          <div className="px-1">
            <div className="flex items-center justify-center gap-0.5 text-base font-bold text-[var(--text)]">
              <span>4.9</span>
              <span className="material-symbols-outlined text-[14px] text-amber-500 fill-icon">
                star
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">Reputación</span>
          </div>
          <div className="px-1">
            <span className="block text-base font-extrabold text-amber-600 dark:text-amber-400">
              {loyaltyProfile.totalPoints}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)]">Puntos Porteños</span>
          </div>
        </div>
      </section>

      {/* Etapa 6: Comunidad Porteña Club CTA Card */}
      <section
        onClick={openLoyaltyModal}
        className="bg-gradient-to-r from-amber-600/10 via-[var(--surface)] to-amber-600/10 rounded-2xl p-4 border border-amber-500/30 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/60 transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[var(--text)]">Club Comunidad Porteña</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase">
                Activo
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
              {loyaltyProfile.unlockedBadges.filter((b) => b.unlocked).length} insignias • Envíos bonificados y cupones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
          <span>Ver Club</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>
      </section>

      {/* Section: Mi Cuenta */}
      <section className="space-y-1">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] px-1">
          Mi Cuenta
        </h3>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {/* Mis Direcciones */}
          <button
            type="button"
            onClick={onOpenAddresses}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[var(--surface-alt)] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined fill-icon">location_on</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text)]">Mis Direcciones</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--surface-alt)] text-[var(--brand)] border border-[var(--border)] font-bold">
                    3 guardadas
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  Casa, Oficina, Casa de Mamá
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[var(--text-secondary)] text-[18px]">
              chevron_right
            </span>
          </button>

          {/* Métodos de Pago */}
          <button
            type="button"
            onClick={onOpenPaymentMethods}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[var(--surface-alt)] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-[var(--text)] block">Métodos de Pago</span>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  Visa •••• 4821, Mercado Pago
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[var(--text-secondary)] text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Section: Preferencias */}
      <section className="space-y-1">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] px-1">
          Preferencias
        </h3>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {/* Modo Oscuro */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--text)] block">Modo Oscuro</span>
                <p className="text-xs text-[var(--text-secondary)]">Ajustar tema visual</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
              className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isDark ? 'bg-[var(--brand)]' : 'bg-[var(--surface-alt)]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Section: Soporte y Seguridad */}
      <section className="space-y-1">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] px-1">
          Soporte y Seguridad
        </h3>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between p-3.5 hover:bg-[var(--surface-alt)] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text)]">Contactar Soporte 24/7</span>
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              </div>
            </div>
            <span className="material-symbols-outlined text-[var(--text-secondary)] text-[18px]">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* Logout button */}
      <section className="pt-2 pb-4 text-center space-y-2">
        <button
          type="button"
          className="w-full h-11 rounded-xl border border-[var(--error)]/30 bg-[var(--surface)] text-[var(--error)] hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar Sesión</span>
        </button>

        <p className="text-[10px] text-[var(--text-secondary)]">
          FoodieLocal v2.4 • Marketplace Local de Delivery
        </p>
      </section>
    </div>
  );
};
