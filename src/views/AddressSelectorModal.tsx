/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Address } from '../types';

interface AddressSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAddress: Address;
  onSelectAddress: (address: Address) => void;
}

const savedAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Casa',
    street: 'Av. Corrientes',
    number: '1234',
    apartment: 'Piso 4 Depto B',
    city: 'Balvanera, CABA',
    instructions: 'Tocar timbre 4B (interfono directo).',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Oficina / Cowork',
    street: 'Thames',
    number: '1400',
    apartment: 'Piso 3 Depto B',
    city: 'Palermo Soho, CABA',
    instructions: 'Dejar en recepción con seguridad',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Casa de Mamá',
    street: 'Av. Santa Fe',
    number: '2100',
    apartment: 'Depto 8A',
    city: 'Recoleta, CABA',
    instructions: 'Tocar timbre y esperar en puerta',
    isDefault: false,
  },
];

export const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  isOpen,
  onClose,
  activeAddress,
  onSelectAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
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
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h2 id="address-modal-title" className="text-base font-bold text-[var(--text)]">
              Mis Direcciones
            </h2>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] text-xs font-bold hover:bg-[var(--surface-alt)] active:scale-95 transition-all cursor-pointer"
          >
            + Nueva
          </button>
        </div>

        {/* Scrollable addresses list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* GPS Auto-detect button */}
          <button
            type="button"
            className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--brand)]/30 hover:bg-[var(--brand-soft)] active:scale-[0.99] transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)]">
                <span className="material-symbols-outlined text-[18px] fill-icon">my_location</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[var(--brand)] leading-none">
                  Usar mi ubicación actual
                </span>
                <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Detectar con GPS de alta precisión
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[var(--brand)] text-[18px]">
              chevron_right
            </span>
          </button>

          {/* Active Address */}
          <section className="space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Dirección de Entrega Activa
            </span>

            {savedAddresses
              .filter((a) => a.id === activeAddress.id)
              .map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-2xl bg-[var(--surface)] border-2 border-[var(--brand)] shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] fill-icon">home</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--text)]">{addr.label}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[var(--brand-soft)] text-[var(--brand)] text-[9px] font-bold">
                            Activa
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--text)] mt-0.5">
                          {addr.street} {addr.number}, {addr.apartment}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{addr.city}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                  </div>

                  {addr.instructions && (
                    <div className="p-2 rounded-lg bg-[var(--surface-alt)] text-[10px] text-[var(--text-secondary)] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">speaker_notes</span>
                      <span>{addr.instructions}</span>
                    </div>
                  )}
                </div>
              ))}
          </section>

          {/* Other addresses */}
          <section className="space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Otras Direcciones Guardadas
            </span>

            <div className="space-y-2">
              {savedAddresses
                .filter((a) => a.id !== activeAddress.id)
                .map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[var(--surface-alt)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">
                            {addr.label.includes('Oficina') ? 'work' : 'favorite'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[var(--text)] block">
                            {addr.label}
                          </span>
                          <p className="text-xs font-semibold text-[var(--text)] mt-0.5">
                            {addr.street} {addr.number}, {addr.apartment}
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{addr.city}</p>
                        </div>
                      </div>

                      <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] shrink-0 mt-0.5" />
                    </div>

                    <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-[11px] text-[var(--brand)] font-bold">
                      <span>Elegir como activa</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--surface)] border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            <span>+ Agregar Nueva Dirección</span>
          </button>
        </div>
      </div>
    </div>
  );
};
