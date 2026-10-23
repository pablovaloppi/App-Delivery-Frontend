/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DisputeTicket,
  DisputeStatus,
  DisputePriority,
} from '../../types/admin';
import { formatMoney } from '../../utils/formatters';
import { getDisputeBadge, filterDisputes } from '../../utils/adminLogic';

interface AdminDisputesViewProps {
  disputes: DisputeTicket[];
  onResolveDispute: (
    id: string,
    action: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS',
    notes: string,
    customAmount?: number
  ) => Promise<void>;
}

export const AdminDisputesView: React.FC<AdminDisputesViewProps> = ({
  disputes,
  onResolveDispute,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<DisputeTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<DisputePriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal state
  const [actionType, setActionType] = useState<
    'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS' | null
  >(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filtered = filterDisputes(disputes, {
    status: statusFilter,
    priority: priorityFilter,
    query: searchQuery,
  });

  const handleOpenActionModal = (
    ticket: DisputeTicket,
    action: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS'
  ) => {
    setSelectedTicket(ticket);
    setActionType(action);
    setRefundAmount(ticket.amount.amount);

    if (action === 'REFUND') {
      setResolutionNotes(`Reembolso por incidencia en comanda #${ticket.orderNumber}.`);
    } else if (action === 'REASSIGN') {
      setResolutionNotes(`Reasignación urgente de cadete de soporte en CABA.`);
    } else if (action === 'COMPENSATE') {
      setResolutionNotes(`Compensación económica por espera o contratiempo en ruta.`);
    } else {
      setResolutionNotes(`Reclamo desestimado tras verificación de trazabilidad.`);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedTicket || !actionType) return;
    setIsSubmitting(true);
    try {
      await onResolveDispute(
        selectedTicket.id,
        actionType,
        resolutionNotes,
        actionType === 'REFUND' ? refundAmount : undefined
      );

      const actionMsg =
        actionType === 'REFUND'
          ? `Reembolso de ${formatMoney(refundAmount, false)} procesado con éxito`
          : actionType === 'REASSIGN'
          ? 'Cadete de relevo reasignado inmediatamente'
          : actionType === 'COMPENSATE'
          ? 'Compensación asignada'
          : 'Incidencia desestimada y archivada';

      setSuccessToast(actionMsg);
      setTimeout(() => setSuccessToast(null), 4000);
      setSelectedTicket(null);
      setActionType(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {successToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <section className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--text-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por # comanda, cliente, comercio o cadete..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-hidden focus:border-[var(--brand)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)]"
              >
                ×
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">Prioridad:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-2.5 py-2 text-[var(--text)] focus:outline-hidden"
            >
              <option value="ALL">Todas</option>
              <option value="HIGH">Alta 🔴</option>
              <option value="MEDIUM">Media 🟡</option>
              <option value="LOW">Baja 🟢</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {(
            [
              { key: 'ALL', label: 'Todos' },
              { key: 'PENDING', label: 'Pendientes' },
              { key: 'INVESTIGATING', label: 'En Investigación' },
              { key: 'REFUNDED', label: 'Reembolsados' },
              { key: 'REASSIGNED', label: 'Reasignados' },
              { key: 'COMPENSATED', label: 'Compensados' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tickets List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'Incidencia encontrada' : 'Incidencias encontradas'}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Resolución en 1-clic con registro auditable
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] text-center space-y-2">
            <span className="material-symbols-outlined text-[36px] text-emerald-500">
              task_alt
            </span>
            <h4 className="text-sm font-bold text-[var(--text)]">Sin disputas en esta vista</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              No hay incidentes pendientes que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const badge = getDisputeBadge(ticket.status);
            const isPending = ticket.status === 'PENDING' || ticket.status === 'INVESTIGATING';

            return (
              <div
                key={ticket.id}
                className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs space-y-3 hover:border-[var(--brand)]/50 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-[var(--surface-alt)] px-2 py-0.5 rounded-md text-[var(--brand)]">
                      #{ticket.orderNumber}
                    </span>
                    <h4 className="text-xs font-bold text-[var(--text)] leading-snug">
                      {ticket.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badge.bgClass} ${badge.textClass}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {ticket.description}
                </p>

                {/* Parties info bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border)]/60 text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
                      Cliente
                    </span>
                    <span className="text-[var(--text)] font-semibold">{ticket.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
                      Comercio
                    </span>
                    <span className="text-[var(--text)] font-semibold">{ticket.merchantName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
                      Cadete Asignado
                    </span>
                    <span className="text-[var(--text)] font-semibold">
                      {ticket.courierName || 'Sin asignar'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
                      Monto Reclamado
                    </span>
                    <span className="text-[var(--brand)] font-extrabold">
                      {formatMoney(ticket.amount.amount, false)}
                    </span>
                  </div>
                </div>

                {/* Resolution History if resolved */}
                {ticket.resolutionNotes && (
                  <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl border border-[var(--border)] text-[11px] space-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-[var(--text)]">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">
                        verified
                      </span>
                      <span>Resolución registrada:</span>
                    </div>
                    <p className="text-[var(--text-secondary)]">{ticket.resolutionNotes}</p>
                    {ticket.refundAmount && (
                      <span className="text-[10px] text-emerald-600 font-extrabold block">
                        Reembolso acreditado: {formatMoney(ticket.refundAmount.amount, false)}
                      </span>
                    )}
                  </div>
                )}

                {/* 1-Click Operational Action Buttons */}
                {isPending && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(ticket, 'REFUND')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                      <span>Reembolsar al Cliente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(ticket, 'REASSIGN')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                      <span>Reasignar Cadete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(ticket, 'COMPENSATE')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>Compensar Cadete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(ticket, 'DISMISS')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--text-secondary)] text-xs font-bold transition-all cursor-pointer ml-auto"
                    >
                      <span>Desestimar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Action Confirmation Modal */}
      {actionType && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">
                  gavel
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  {actionType === 'REFUND'
                    ? 'Procesar Reembolso al Cliente'
                    : actionType === 'REASSIGN'
                    ? 'Reasignar Cadete de Apoyo'
                    : actionType === 'COMPENSATE'
                    ? 'Compensación Extra'
                    : 'Desestimar Incidencia'}
                </h3>
              </div>
              <button
                onClick={() => setActionType(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text)] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--surface-alt)] p-3 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-[var(--text)]">
                <span className="font-bold">Comanda #{selectedTicket.orderNumber}</span>
                <span className="text-[var(--brand)] font-extrabold">
                  {formatMoney(selectedTicket.amount.amount, false)}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] line-clamp-2">
                {selectedTicket.description}
              </p>
            </div>

            {/* Custom refund input */}
            {actionType === 'REFUND' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text)] block">
                  Monto a Reembolsar (ARS):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[var(--text-secondary)]">
                    $
                  </span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    max={selectedTicket.amount.amount}
                    min={100}
                    step={100}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] font-extrabold focus:outline-hidden focus:border-[var(--brand)]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRefundAmount(selectedTicket.amount.amount)}
                    className="text-[10px] font-bold text-[var(--brand)] hover:underline"
                  >
                    100% Total ({formatMoney(selectedTicket.amount.amount, false)})
                  </button>
                  <span className="text-[var(--text-secondary)] text-[10px]">•</span>
                  <button
                    type="button"
                    onClick={() => setRefundAmount(Math.round(selectedTicket.amount.amount * 0.5))}
                    className="text-[10px] font-bold text-[var(--text-secondary)] hover:underline"
                  >
                    50% Parcial
                  </button>
                </div>
              </div>
            )}

            {/* Resolution notes textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text)] block">
                Dictamen / Nota de Auditoría:
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Escribí los motivos o detalles del acuerdo..."
                className="w-full p-2.5 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-hidden focus:border-[var(--brand)]"
              />
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-3.5 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Resolución'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
