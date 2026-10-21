/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OrderViewModel } from '../types';
import { formatMoney } from '../utils/formatters';

interface OrderTrackingViewProps {
  order: OrderViewModel;
  onBack: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onBack }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col relative select-none pb-8 bg-[var(--bg)]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-2 flex items-center justify-between bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver atrás"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight text-[var(--text)]">Seguimiento en vivo</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] text-[10px] font-extrabold uppercase">
                #{order.orderNumber}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {order.deliveryAddress.street} {order.deliveryAddress.number}, {order.deliveryAddress.city}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Soporte y ayuda"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--surface-alt)] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">support_agent</span>
        </button>
      </header>

      {/* Map Canvas & Visual Tracking Stage */}
      <div className="relative w-full h-[360px] bg-[#1a1c23] dark:bg-[#121318] overflow-hidden">
        {/* Street grid vector pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-tracking" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#2e3442" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#1a1d26" />
          <rect width="100%" height="100%" fill="url(#grid-tracking)" />
          <path d="M-20 60 L410 260" stroke="#33394a" strokeWidth="16" strokeLinecap="round" />
          <path d="M-40 310 L410 40" stroke="#292e3c" strokeWidth="12" />
          <path d="M120 -10 L140 400" stroke="#33394a" strokeWidth="10" />
          <path d="M260 -10 L280 400" stroke="#292e3c" strokeWidth="8" />
        </svg>

        {/* Active Delivery Route SVG Path (Glowing Primary Warm Orange #FF6500) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 390 360">
          <path
            d="M 64 280 L 110 276 L 126 198 L 228 190 L 255 110 L 314 96"
            fill="none"
            stroke="#ff6500"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-25 blur-sm"
          />
          <path
            d="M 64 280 L 110 276 L 126 198 L 228 190 L 255 110 L 314 96"
            fill="none"
            stroke="#ff6500"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 64 280 L 110 276 L 126 198 L 180 194"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="3 4"
            className="opacity-80"
          />
        </svg>

        {/* Pin A: Origin (Pizzería) */}
        <div className="absolute left-[44px] top-[258px] z-20 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-stone-900 border-2 border-white text-amber-400 flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[18px] fill-icon">restaurant</span>
          </div>
          <span className="mt-1 px-2 py-0.5 bg-black/80 text-white text-[9px] rounded font-bold whitespace-nowrap">
            {order.merchantName}
          </span>
        </div>

        {/* Live Courier Marker (Carlos) */}
        <div className="absolute left-[175px] top-[170px] z-25 flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-11 h-11 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-black/90 text-white flex items-center space-x-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-bold">Carlos • 1.4 km</span>
          </div>
        </div>

        {/* Pin B: Destination (Customer) */}
        <div className="absolute left-[295px] top-[74px] z-20 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[var(--brand)] text-white border-2 border-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[18px] fill-icon">home</span>
          </div>
          <span className="mt-1 px-2 py-0.5 bg-black/80 text-white text-[9px] rounded font-bold whitespace-nowrap">
            Tu ubicación
          </span>
        </div>

        {/* Top Floating Stage Pill */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-md">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span className="text-[11px] font-bold text-[var(--text)]">
              Tramo B: En camino a tu dirección
            </span>
          </div>

          <button
            type="button"
            aria-label="Centrar mapa en repartidor"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--border)] shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none z-10" />
      </div>

      {/* Floating Bottom Sheet */}
      <div className="relative -mt-6 z-30 flex-1 px-4 flex flex-col">
        <div className="bg-[var(--surface)] rounded-t-[28px] rounded-b-2xl border border-[var(--border)] shadow-xl p-4 space-y-4">
          <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto -mt-1 mb-1" />

          {/* Headline & ETA */}
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center space-x-1 text-[var(--brand)] mb-0.5">
                <span className="material-symbols-outlined text-[16px]">electric_moped</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Entrega estimada</span>
              </div>
              <h2 className="text-base font-extrabold text-[var(--text)] tracking-tight">
                ¡Tu pedido está en camino! 🛵
              </h2>
            </div>

            <div className="text-right bg-[var(--brand-soft)] px-3 py-1.5 rounded-xl border border-[var(--brand)]/20">
              <span className="text-sm font-extrabold text-[var(--brand)] block leading-tight">
                18 min
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">21:35 - 21:45 hs</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="pt-2 pb-1 border-t border-b border-[var(--border)]">
            <div className="relative flex items-center justify-between">
              <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-[var(--border)] z-0" />
              <div className="absolute top-1/2 left-3 w-3/4 -translate-y-1/2 h-0.5 bg-[var(--brand)] z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center ring-4 ring-[var(--surface)]">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </div>
                <span className="mt-1 text-[9px] text-[var(--text-secondary)]">Confirmado</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center ring-4 ring-[var(--surface)]">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </div>
                <span className="mt-1 text-[9px] text-[var(--text-secondary)]">Cocina</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center ring-4 ring-[var(--surface)]">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </div>
                <span className="mt-1 text-[9px] text-[var(--text-secondary)]">Despachado</span>
              </div>

              {/* Step 4: Active */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center ring-4 ring-[var(--surface)] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="mt-1 text-[9px] font-bold text-[var(--brand)]">En camino</span>
              </div>

              {/* Step 5 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--surface-alt)] text-[var(--text-secondary)] border border-[var(--border)] flex items-center justify-center ring-4 ring-[var(--surface)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                </div>
                <span className="mt-1 text-[9px] text-[var(--text-secondary)]">Entregado</span>
              </div>
            </div>
          </div>

          {/* Courier Card with 44px min targets */}
          <div className="p-2.5 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiYpE40KOsxI366UrH1pghQ8iGLrhCeQ9nXlQqXWav1HBmAdlL_WSBsgfhEHXQvrNxNkn4R4YqL7aC1jrVrFCf07NTUkGY1mEoGC5AcNnS-HKpUP3zENdabWPVRD0EiYYEj9Z_BrFWRM3kRBfvHsBQIVMmiK06drCMT_-aLzpiBI0ehNJ4xtJkbLzwr4vEp2Khx17UIUQ8X_YZWnJ7ZArfSV43RI-_z_8hm-GqFkih_n7PVyGW3QXliQ"
                  alt="Carlos Gómez"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[var(--brand)]"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--success)] text-white flex items-center justify-center text-[8px] ring-2 ring-[var(--surface)]">
                  <span className="material-symbols-outlined text-[10px]">check</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-bold text-[var(--text)]">Carlos Gómez</h3>
                  <span className="text-[10px] text-[var(--text-secondary)]">• Moto Wave</span>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="material-symbols-outlined text-amber-500 text-[13px] fill-icon">
                    star
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text)]">4.9</span>
                  <span className="text-[9px] text-[var(--text-secondary)]">(320 entregas)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                aria-label="Enviar mensaje al repartidor"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--brand)] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </button>
              <button
                type="button"
                aria-label="Llamar al repartidor"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[var(--brand)] text-white active:scale-95 hover:bg-[var(--brand-hover)] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
            </div>
          </div>

          {/* Collapsible Order Summary Accordion */}
          <div className="bg-[var(--surface-alt)] rounded-xl border border-[var(--border)] transition-all">
            <button
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center justify-between p-3 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[var(--brand)] text-[18px]">
                  receipt_long
                </span>
                <span className="text-xs font-bold text-[var(--text)]">
                  Resumen ({order.items.length} ítems)
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-[var(--text)]">{formatMoney(order.total)}</span>
                <span
                  className={`material-symbols-outlined text-[18px] text-[var(--text-secondary)] transition-transform ${
                    isAccordionOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </div>
            </button>

            {isAccordionOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>
                      {i.quantity}x {i.name}
                    </span>
                    <span className="font-semibold text-[var(--text)]">
                      {formatMoney(i.totalPrice)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span>Envío express</span>
                  <span className="font-semibold text-[var(--text)]">
                    {order.deliveryFee.amount === 0 ? 'Gratis' : formatMoney(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Propina</span>
                  <span className="font-semibold text-[var(--text)]">{formatMoney(order.tip)}</span>
                </div>
                {order.discount.amount > 0 && (
                  <div className="flex justify-between items-center text-[var(--success)]">
                    <span>Descuento aplicado</span>
                    <span>-{formatMoney(order.discount)}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-[var(--border)] flex justify-between items-center font-bold text-[var(--text)]">
                  <span>Total abonado</span>
                  <span className="text-[var(--brand)]">{formatMoney(order.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Note */}
          <div className="p-2.5 bg-[var(--surface)] rounded-xl border border-[var(--border)] flex items-start space-x-2">
            <span className="material-symbols-outlined text-[18px] text-[var(--brand)] mt-0.5">
              doorbell
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[var(--text)]">Nota de entrega al repartidor</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {order.deliveryAddress.instructions || 'Tocar timbre al llegar.'}
              </p>
            </div>
          </div>

          {/* Share CTA */}
          <button
            type="button"
            className="w-full h-11 bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share_location</span>
            <span>Compartir seguimiento en tiempo real</span>
          </button>
        </div>
      </div>
    </div>
  );
};
