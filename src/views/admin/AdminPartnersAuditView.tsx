/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PartnerAuditRecord,
  PartnerVerificationStatus,
  PartnerDocument,
} from '../../types/admin';
import { filterPartners, getPartnerStatusBadge } from '../../utils/adminLogic';

interface AdminPartnersAuditViewProps {
  partners: PartnerAuditRecord[];
  onUpdatePartnerStatus: (
    id: string,
    status: PartnerVerificationStatus,
    reason?: string
  ) => Promise<void>;
  onVerifyDocument: (
    partnerId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => Promise<void>;
}

export const AdminPartnersAuditView: React.FC<AdminPartnersAuditViewProps> = ({
  partners,
  onUpdatePartnerStatus,
  onVerifyDocument,
}) => {
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MERCHANT' | 'COURIER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PartnerVerificationStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected document preview modal
  const [inspectingDoc, setInspectingDoc] = useState<{
    partner: PartnerAuditRecord;
    doc: PartnerDocument;
  } | null>(null);

  // Suspension modal state
  const [suspendingPartner, setSuspendingPartner] = useState<PartnerAuditRecord | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = filterPartners(partners, {
    type: typeFilter,
    status: statusFilter,
    query: searchQuery,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprovePartner = async (partner: PartnerAuditRecord) => {
    setIsProcessing(true);
    try {
      await onUpdatePartnerStatus(partner.id, 'VERIFIED');
      showToast(`${partner.name} habilitado operativamente en CABA.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSuspension = async () => {
    if (!suspendingPartner) return;
    setIsProcessing(true);
    try {
      await onUpdatePartnerStatus(
        suspendingPartner.id,
        'SUSPENDED',
        suspensionReason || 'Suspensión preventiva por irregularidad documental.'
      );
      showToast(`${suspendingPartner.name} suspendido preventivamente.`);
      setSuspendingPartner(null);
      setSuspensionReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleDocVerification = async (
    partnerId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => {
    setIsProcessing(true);
    try {
      await onVerifyDocument(partnerId, docId, status);
      showToast(status === 'VERIFIED' ? 'Documento auditado y aprobado' : 'Documento rechazado');
      if (inspectingDoc) {
        setInspectingDoc(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <section className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--text-secondary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por comercio, cadete, CUIT, DNI o barrio..."
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

          {/* Type Selector (Merchant vs Courier) */}
          <div className="flex items-center gap-1 bg-[var(--surface-alt)] p-1 rounded-xl border border-[var(--border)] shrink-0">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'ALL'
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('MERCHANT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'MERCHANT'
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Comercios
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('COURIER')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'COURIER'
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Cadetes
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {(
            [
              { key: 'ALL', label: 'Todos los Estados' },
              { key: 'PENDING_REVIEW', label: 'Revisión Pendiente ⚠️' },
              { key: 'VERIFIED', label: 'Aprobados y Activos ✅' },
              { key: 'SUSPENDED', label: 'Suspendidos ⛔' },
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

      {/* Partners List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'Socio registrado' : 'Socios registrados'}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Auditoría de Higiene Bromatológica y Pólizas Activas
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] text-center space-y-2">
            <span className="material-symbols-outlined text-[36px] text-emerald-500">
              verified
            </span>
            <h4 className="text-sm font-bold text-[var(--text)]">Sin socios pendientes</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Todos los comercios y cadetes en esta vista cumplen con la normativa vigente.
            </p>
          </div>
        ) : (
          filtered.map((partner) => {
            const badge = getPartnerStatusBadge(partner.verificationStatus);
            const isMerchant = partner.type === 'MERCHANT';

            return (
              <div
                key={partner.id}
                className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xs space-y-3 hover:border-[var(--brand)]/50 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isMerchant
                          ? 'bg-orange-100 dark:bg-orange-950/60 text-[var(--brand)]'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isMerchant ? 'storefront' : 'two_wheeler'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-[var(--text)]">
                          {partner.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                          ({partner.cuitOrDni})
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {partner.categoryOrVehicle} • {partner.zone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-center shrink-0 ${badge.bgClass} ${badge.textClass}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Suspension reason if applicable */}
                {partner.rejectionReason && (
                  <div className="bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0 mt-0.5">
                      error
                    </span>
                    <div>
                      <span className="font-bold">Motivo de suspensión: </span>
                      <span>{partner.rejectionReason}</span>
                    </div>
                  </div>
                )}

                {/* Documents Checklist & Inspection Table */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Documentación Presentada ({partner.documents.length} archivos):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {partner.documents.map((doc) => {
                      const isDocVerified = doc.status === 'VERIFIED';
                      const isDocRejected = doc.status === 'REJECTED';

                      return (
                        <div
                          key={doc.id}
                          className="bg-[var(--surface-alt)] p-2 rounded-xl border border-[var(--border)] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span
                              className={`material-symbols-outlined text-[16px] ${
                                isDocVerified
                                  ? 'text-emerald-500'
                                  : isDocRejected
                                  ? 'text-rose-500'
                                  : 'text-amber-500'
                              }`}
                            >
                              {isDocVerified
                                ? 'check_circle'
                                : isDocRejected
                                ? 'cancel'
                                : 'hourglass_top'}
                            </span>
                            <div className="truncate">
                              <span className="font-semibold text-[var(--text)] block truncate text-[11px]">
                                {doc.name}
                              </span>
                              {doc.documentNumber && (
                                <span className="font-mono text-[9px] text-[var(--text-secondary)] block">
                                  {doc.documentNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setInspectingDoc({ partner, doc })}
                            className="text-[10px] font-bold text-[var(--brand)] hover:underline shrink-0 bg-[var(--surface)] px-2 py-1 rounded-md border border-[var(--border)]"
                          >
                            Auditar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/60 text-xs">
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Tel: {partner.contactPhone} • {partner.contactEmail}
                  </div>

                  <div className="flex items-center gap-2">
                    {partner.verificationStatus !== 'VERIFIED' && (
                      <button
                        type="button"
                        onClick={() => handleApprovePartner(partner)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Aprobar y Habilitar
                      </button>
                    )}

                    {partner.verificationStatus !== 'SUSPENDED' && (
                      <button
                        type="button"
                        onClick={() => setSuspendingPartner(partner)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:bg-rose-50 hover:text-rose-600 text-[var(--text-secondary)] text-xs font-bold transition-all cursor-pointer border border-[var(--border)]"
                      >
                        Suspender
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Document Inspection & Audit Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--brand)] text-[22px]">
                  description
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  Auditoría de Documento Legal
                </h3>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text)] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[var(--surface-alt)] p-3 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
                  Documento Inspeccionado
                </span>
                <div className="font-bold text-[var(--text)] text-sm">
                  {inspectingDoc.doc.name}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Titular: <strong>{inspectingDoc.partner.name}</strong> ({inspectingDoc.partner.cuitOrDni})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Nº de Registro</span>
                  <span className="font-mono font-bold text-[var(--text)]">
                    {inspectingDoc.doc.documentNumber || 'En trámite'}
                  </span>
                </div>
                <div className="bg-[var(--surface-alt)] p-2.5 rounded-xl">
                  <span className="text-[10px] text-[var(--text-secondary)] block">Organismo Emisor</span>
                  <span className="font-bold text-[var(--text)]">
                    {inspectingDoc.doc.issuer || 'Entidad Oficial'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-secondary)] space-y-1">
                <span className="material-symbols-outlined text-[28px] text-[var(--brand)]">
                  picture_as_pdf
                </span>
                <p className="font-semibold text-[var(--text)]">
                  Documento digital verificado con firma electrónica
                </p>
                <p className="text-[10px]">Cotejado contra registros de CABA y AFIP.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() =>
                  handleToggleDocVerification(
                    inspectingDoc.partner.id,
                    inspectingDoc.doc.id,
                    'REJECTED'
                  )
                }
                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                Rechazar Documento
              </button>

              <button
                type="button"
                onClick={() =>
                  handleToggleDocVerification(
                    inspectingDoc.partner.id,
                    inspectingDoc.doc.id,
                    'VERIFIED'
                  )
                }
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Aprobar Documento ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspension Modal */}
      {suspendingPartner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <span className="material-symbols-outlined text-[22px]">warning</span>
              <h3>Suspender a {suspendingPartner.name}</h3>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              La suspensión impedirá que el comercio reciba comandas o que el cadete reciba ofertas de
              entrega en CABA hasta que regularice su situación.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text)] block">
                Motivo formal de la suspensión:
              </label>
              <textarea
                rows={3}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Ej: Habilitación bromatológica vencida o falta de seguro..."
                className="w-full p-2.5 text-xs bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingPartner(null)}
                className="px-3.5 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Confirmar Suspensión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
