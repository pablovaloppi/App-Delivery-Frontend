/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OrderViewModel } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { formatMoney } from '../../utils/formatters';

interface MerchantOrderDetailModalProps {
  order: OrderViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, targetStatus: any) => Promise<void>;
  onRejectOrder: (orderId: string, reason: string) => Promise<void>;
}

export const MerchantOrderDetailModal: React.FC<MerchantOrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onRejectOrder,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !order) return null;

  const handleAction = async (targetStatus: any) => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(order.id, targetStatus);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onRejectOrder(order.id, rejectReason || 'Comercio con alta demanda');
      onClose();
    } finally {
      setIsProcessing(false);
      setShowRejectInput(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-xs select-none"
    >
      <div className="w-full max-w-[430px] bg-[var(--bg)] max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col relative shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            <div>
              <h2 id="order-modal-title" className="text-base font-bold text-[var(--text)]">
                Pedido #{order.orderNumber}
              </h2>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {new Date(order.createdAt).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                hs • {order.deliveryType === 'platform' ? 'Envío por Cadete' : 'Retiro en Local'}
              </p>
            </div>
          </div>

          <StatusBadge status={order.status} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          {/* Items breakdown */}
          <section className="bg-[var(--surface)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Comanda de Cocina ({order.items.length} ítems)
              </h3>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[var(--brand-soft)] text-[var(--brand)] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.quantity}x
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text)]">{item.name}</h4>
                      {item.notes && (
                        <div className="mt-1 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">notification_important</span>
                          <span>Nota: "{item.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[var(--text)] shrink-0">
                    {formatMoney(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery & Logistics */}
          <section className="bg-[var(--surface)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Logística & Despacho
            </h3>

            <div className="flex items-start gap-2.5 text-xs text-[var(--text)]">
              <span className="material-symbols-outlined text-[18px] text-[var(--brand)] shrink-0">
                location_on
              </span>
              <div>
                <span className="font-bold">{order.deliveryAddress.label}</span>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  {order.deliveryAddress.street} {order.deliveryAddress.number},{' '}
                  {order.deliveryAddress.apartment}
                </p>
                {order.deliveryAddress.instructions && (
                  <p className="text-[10px] text-[var(--text-secondary)] italic mt-0.5">
                    "{order.deliveryAddress.instructions}"
                  </p>
                )}
              </div>
            </div>

            {order.courierName ? (
              <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                    sports_motorsports
                  </span>
                  <div>
                    <span className="text-xs font-bold text-[var(--text)]">
                      Cadete: {order.courierName}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block">
                      En ruta al local para retiro
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Asignado
                </span>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Asignación de cadete:</span>
                <span className="text-[var(--brand)] font-semibold">Buscando por cola/proximidad</span>
              </div>
            )}
          </section>

          {/* Financials */}
          <section className="bg-[var(--surface)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-1.5 text-xs">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal comanda</span>
              <span className="font-bold text-[var(--text)]">{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Comisión de plataforma</span>
              <span>-10%</span>
            </div>
            <div className="pt-2 border-t border-[var(--border)] flex justify-between font-bold text-sm">
              <span className="text-[var(--text)]">Neto a liquidar</span>
              <span className="text-[var(--brand)]">
                {formatMoney({ amount: Math.round(order.subtotal.amount * 0.9), currency: 'ARS' })}
              </span>
            </div>
          </section>

          {/* Reject Reason input if triggered */}
          {showRejectInput && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 space-y-2">
              <label htmlFor="reject-reason" className="text-xs font-bold text-red-700 dark:text-red-400 block">
                Motivo del rechazo de comanda:
              </label>
              <input
                id="reject-reason"
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej: Sin ingredientes para este plato / Local saturado"
                className="w-full bg-[var(--surface)] border border-red-300 rounded-lg p-2 text-xs text-[var(--text)] outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRejectInput(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  isLoading={isProcessing}
                >
                  Confirmar Rechazo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Contextual CTA actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--surface)] border-t border-[var(--border)] flex gap-2 z-10 shadow-lg">
          {order.status === 'PENDING' && (
            <>
              {!showRejectInput && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowRejectInput(true)}
                  disabled={isProcessing}
                  className="flex-1 text-[var(--error)] border-[var(--error)]/30 hover:bg-red-50"
                >
                  Rechazar
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => handleAction('PREPARING')}
                isLoading={isProcessing}
                className="flex-1"
                leftIcon={<span className="material-symbols-outlined text-[18px]">soup_kitchen</span>}
              >
                Aceptar y Preparar
              </Button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => handleAction('PREPARING')}
              isLoading={isProcessing}
              leftIcon={<span className="material-symbols-outlined text-[18px]">soup_kitchen</span>}
            >
              Iniciar Preparación en Cocina
            </Button>
          )}

          {order.status === 'PREPARING' && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => handleAction('READY_FOR_PICKUP')}
              isLoading={isProcessing}
              leftIcon={<span className="material-symbols-outlined text-[18px]">check_circle</span>}
            >
              Marcar Listo para Retiro
            </Button>
          )}

          {order.status === 'READY_FOR_PICKUP' && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={onClose}
              leftIcon={<span className="material-symbols-outlined text-[18px]">moped</span>}
            >
              Esperando Retiro del Cadete
            </Button>
          )}

          {order.status === 'DELIVERED' && (
            <Button variant="secondary" size="md" fullWidth onClick={onClose}>
              Cerrar Detalle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
