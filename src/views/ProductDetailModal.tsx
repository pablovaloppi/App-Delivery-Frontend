/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { formatMoney } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    options: { size: string; extras: string[] },
    notes: string,
  ) => void;
}

interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

const availableExtras: ExtraOption[] = [
  { id: 'ext-1', label: 'Extra Queso Mozzarella', price: 1500 },
  { id: 'ext-2', label: 'Champiñones frescos', price: 1200 },
  { id: 'ext-3', label: 'Jamón Crudo estacionado', price: 2200 },
  { id: 'ext-4', label: 'Aceitunas negras rellenas', price: 900 },
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<'Chica' | 'Mediana' | 'Familiar'>('Mediana');
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['ext-1']); // default extra mozzarella
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen) return null;

  // Size base prices
  const sizePrices: Record<'Chica' | 'Mediana' | 'Familiar', number> = {
    Chica: 9800,
    Mediana: 12500,
    Familiar: 16900,
  };

  const basePrice = sizePrices[selectedSize];
  const extrasTotal = selectedExtras.reduce((sum, extId) => {
    const ext = availableExtras.find((e) => e.id === extId);
    return sum + (ext ? ext.price : 0);
  }, 0);

  const unitTotal = basePrice + extrasTotal;
  const grandTotal = unitTotal * quantity;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const extraLabels = selectedExtras.map((id) => {
      const ext = availableExtras.find((e) => e.id === id);
      return ext ? `${ext.label} (+${formatMoney(ext.price)})` : '';
    });

    onAddToCart(
      product,
      quantity,
      {
        size: selectedSize,
        extras: extraLabels,
      },
      kitchenNotes,
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-xs select-none"
    >
      <div className="w-full max-w-[430px] bg-[var(--bg)] max-h-[92vh] sm:max-h-[850px] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col relative shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Photographic Hero Cover */}
        <div className="relative w-full h-64 shrink-0 bg-[var(--surface-alt)]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* Top Controls */}
          <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle de producto"
              className="w-11 h-11 rounded-full bg-[var(--surface)]/95 backdrop-blur shadow-md flex items-center justify-center text-[var(--text)] active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Guardar en favoritos"
                className="w-11 h-11 rounded-full bg-[var(--surface)]/95 backdrop-blur shadow-md flex items-center justify-center text-[var(--text)] active:scale-95 transition-transform cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isFavorite ? 'text-[var(--brand)] fill-icon' : ''
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>
          </div>

          {/* Artisan badge */}
          <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface)]/90 backdrop-blur shadow-sm">
            <span className="material-symbols-outlined text-[var(--brand)] text-[16px] fill-icon">
              local_fire_department
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[var(--text)] uppercase">
              HORNO DE LEÑA
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-5">
          {/* Title & Description */}
          <section className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h1 id="product-modal-title" className="text-xl font-bold text-[var(--text)] leading-snug">
                {product.name}
              </h1>
              <span className="text-lg font-extrabold text-[var(--brand)] shrink-0">
                {formatMoney(basePrice)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-alt)] text-[var(--text-secondary)] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">eco</span> Vegetariano
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-alt)] text-[var(--text-secondary)] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">timer</span> 20-30 min
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--brand-soft)] text-[var(--brand)] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px] fill-icon">star</span> 4.9 (148)
              </span>
            </div>
          </section>

          <hr className="border-[var(--border)]" />

          {/* Size Selector */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Tamaño</h2>
                <span className="text-[10px] text-[var(--text-secondary)]">• Obligatorio</span>
              </div>
              <span className="text-[10px] font-bold text-[var(--brand)] px-2 py-0.5 rounded-full bg-[var(--brand-soft)]">
                Elegí 1
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Chica', 'Mediana', 'Familiar'] as const).map((size) => {
                const isSelected = selectedSize === size;
                const portionLabel =
                  size === 'Chica' ? '4 porciones' : size === 'Mediana' ? '6 porciones' : '8 porciones';

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`
                      p-2.5 rounded-xl flex flex-col items-center text-center transition-all min-h-[84px] cursor-pointer active:scale-95
                      ${
                        isSelected
                          ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)] shadow-xs'
                          : 'border border-[var(--border)] bg-[var(--surface)]'
                      }
                    `}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[var(--brand)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {size}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                      {portionLabel}
                    </span>
                    <span
                      className={`text-xs mt-1 font-bold ${
                        isSelected ? 'text-[var(--brand)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {formatMoney(sizePrices[size], false)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-[var(--border)]" />

          {/* Additional Ingredients Checkboxes */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                  Ingredientes extra
                </h2>
                <p className="text-[10px] text-[var(--text-secondary)]">Opcional • Agregá sabor a tu gusto</p>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)]">Máx. 4</span>
            </div>

            <div className="space-y-2">
              {availableExtras.map((extra) => {
                const isChecked = selectedExtras.includes(extra.id);

                return (
                  <label
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)]/50 transition-colors cursor-pointer min-h-[48px]"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[var(--brand)] border-[var(--brand)] text-white'
                            : 'border-[var(--border)] bg-[var(--surface)]'
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[var(--text)]">{extra.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--brand)]">
                      +{formatMoney(extra.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Special Kitchen Notes */}
          <section className="space-y-1.5">
            <label htmlFor="kitchen-notes" className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
              <span>Notas para la cocina</span>
              <span className="text-[10px] font-normal text-[var(--text-secondary)]">(Opcional)</span>
            </label>
            <textarea
              id="kitchen-notes"
              value={kitchenNotes}
              onChange={(e) => setKitchenNotes(e.target.value)}
              placeholder="Ej: Bien dorada, cortar en 8 porciones, orégano aparte..."
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] text-xs p-3 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] resize-none outline-none"
            />
          </section>
        </div>

        {/* Docked Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-3 flex items-center gap-3 z-30 shadow-lg">
          {/* Stepper (Min 44px target) */}
          <div className="flex items-center bg-[var(--surface-alt)] rounded-xl p-1 border border-[var(--border)] h-12 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
              className="w-10 h-10 flex items-center justify-center text-[var(--text)] hover:text-[var(--brand)] active:scale-95 disabled:opacity-40 rounded-lg transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="w-7 text-center text-sm font-bold text-[var(--text)]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar cantidad"
              className="w-10 h-10 flex items-center justify-center text-[var(--text)] hover:text-[var(--brand)] active:scale-95 rounded-lg transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Primary Orange Add Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-12 bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white rounded-xl text-sm font-bold flex items-center justify-between px-4 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Agregar al Pedido</span>
            <span className="font-extrabold">{formatMoney(grandTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
