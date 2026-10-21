/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showLocation?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  onBack,
  showLocation = true,
}) => {
  const { activeAddress, notificationsCount, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border)] transition-colors">
      <div className="flex items-center justify-between px-4 py-2.5">
        {onBack ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver atrás"
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-base font-bold text-[var(--text)] leading-tight">
                {title || 'FoodieLocal'}
              </h1>
              {subtitle && (
                <p className="text-xs text-[var(--text-secondary)] leading-none mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--brand)] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px] fill-icon">
                {role === 'courier' ? 'two_wheeler' : role === 'merchant' ? 'storefront' : 'restaurant'}
              </span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[var(--brand)]">
                Foodie<span className="text-[var(--text)]">Local</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--brand)] ring-2 ring-[var(--surface)]" />
            )}
          </button>
        </div>
      </div>

      {/* Location Dropdown Row (when in customer discovery mode) */}
      {showLocation && !onBack && role === 'customer' && (
        <div className="px-4 pb-2.5 pt-0.5 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1.5 text-left group max-w-[80%] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[var(--brand)] text-[20px] shrink-0 fill-icon">
              location_on
            </span>
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Entregar en
              </span>
              <div className="flex items-center gap-1 truncate">
                <span className="text-xs font-bold text-[var(--text)] truncate">
                  {activeAddress.street} {activeAddress.number}, {activeAddress.city}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[var(--text-secondary)] group-hover:translate-y-0.5 transition-transform">
                  expand_more
                </span>
              </div>
            </div>
          </button>

          <span className="px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] text-[10px] font-bold">
            15-25 min
          </span>
        </div>
      )}
    </header>
  );
};
