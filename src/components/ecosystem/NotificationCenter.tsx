/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { useAuth } from '../../context/AuthContext';
import { filterNotifications } from '../../utils/ecosystemLogic';
import { soundEffects } from '../../services/soundEffects';
import { AppNotification, NotificationType } from '../../types/ecosystem';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isNotificationCenterOpen,
    closeNotificationCenter,
    markAsRead,
    markAllAsRead,
    soundEnabled,
    toggleSound,
    addNotification,
  } = useEcosystem();

  const { role } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'role'>('all');

  if (!isNotificationCenterOpen) return null;

  const filteredNotifications = filterNotifications(notifications, {
    role: activeFilter === 'role' ? role : 'all',
    unreadOnly: activeFilter === 'unread',
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return { icon: 'moped', bg: 'bg-orange-500/10 text-orange-600' };
      case 'NEW_ORDER':
        return { icon: 'soup_kitchen', bg: 'bg-emerald-500/10 text-emerald-600' };
      case 'NEW_OFFER':
        return { icon: 'two_wheeler', bg: 'bg-blue-500/10 text-blue-600' };
      case 'WEATHER_ALERT':
        return { icon: 'rainy', bg: 'bg-cyan-500/10 text-cyan-600' };
      case 'LOYALTY_REWARD':
        return { icon: 'workspace_premium', bg: 'bg-amber-500/10 text-amber-600' };
      case 'REVIEW_REQUEST':
        return { icon: 'rate_review', bg: 'bg-purple-500/10 text-purple-600' };
      default:
        return { icon: 'notifications', bg: 'bg-slate-500/10 text-slate-600' };
    }
  };

  const handleSimulateIncomingPush = () => {
    const pushOptions = [
      {
        title: '¡Comanda #1044 lista para retiro!',
        message: 'Burger Station empaquetó tu pedido. El cadete está a 200 metros.',
        targetRole: 'customer' as const,
        type: 'ORDER_UPDATE' as const,
      },
      {
        title: '¡Nueva comanda express entrante!',
        message: 'Mesa 4 / Online: 2x Empanadas de carne cortada a cuchillo.',
        targetRole: 'merchant' as const,
        type: 'NEW_ORDER' as const,
      },
      {
        title: 'Tarifa Dinámica + Lluvia activa',
        message: 'CABA con llovizna. Bonificación de +$600 ARS por comanda para cadetes.',
        targetRole: 'courier' as const,
        type: 'WEATHER_ALERT' as const,
      },
    ];

    const pick = pushOptions[Math.floor(Math.random() * pushOptions.length)];
    addNotification(pick);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click listener */}
      <div className="flex-1" onClick={closeNotificationCenter} />

      {/* Slide-in Drawer */}
      <div
        className="w-full max-w-sm sm:max-w-md bg-[var(--surface)] text-[var(--text)] h-full shadow-2xl border-l border-[var(--border)] flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-center-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined text-[24px] text-[var(--brand)]">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--brand)] ring-2 ring-[var(--surface)]" />
              )}
            </div>
            <div>
              <h2 id="notification-center-title" className="text-base font-bold text-[var(--text)]">
                Centro de Avisos
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {unreadCount > 0
                  ? `${unreadCount} ${unreadCount === 1 ? 'nuevo aviso' : 'nuevos avisos'}`
                  : 'Todo al día en CABA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              title={soundEnabled ? 'Sonidos activos' : 'Sonidos silenciados'}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={closeNotificationCenter}
              aria-label="Cerrar avisos"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="px-4 py-2 bg-[var(--surface-alt)]/50 border-b border-[var(--border)] flex items-center justify-between text-xs">
          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Sin leer ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('role')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'role'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Mi rol ({role})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-[var(--brand)] hover:underline cursor-pointer"
            >
              Marcar todo
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[44px] mb-2 opacity-50">
                done_all
              </span>
              <p className="font-bold text-sm text-[var(--text)]">Sin notificaciones pendientes</p>
              <p className="text-xs mt-1">Los avisos de pedidos, cocina y cadetes aparecerán aquí.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const { icon, bg } = getNotificationIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    !notif.read
                      ? 'bg-[var(--surface)] border-[var(--brand)]/40 shadow-xs'
                      : 'bg-[var(--surface)]/60 border-[var(--border)] opacity-80'
                  } hover:border-[var(--brand)]`}
                >
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[var(--brand)] ring-2 ring-[var(--surface)]" />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-bold text-[var(--text)] leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-medium">
                        <span>{notif.timestamp}</span>
                        {notif.orderNumber && (
                          <>
                            <span>•</span>
                            <span className="font-mono font-bold text-[var(--brand)]">
                              #{notif.orderNumber}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">Rol: {notif.targetRole}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Testing Actions */}
        <div className="p-3 bg-[var(--surface-alt)]/60 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => soundEffects.playComandaChime()}
            className="flex-1 py-2 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] text-[11px] font-bold text-[var(--text)] flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[var(--brand)]">
              music_note
            </span>
            <span>Probar Sonido</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateIncomingPush}
            className="flex-1 py-2 px-2.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">add_alert</span>
            <span>Simular Push</span>
          </button>
        </div>
      </div>
    </div>
  );
};
