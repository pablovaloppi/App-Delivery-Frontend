/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ReviewTargetType } from '../../types/ecosystem';
import { formatMoney } from '../../utils/formatters';

const MERCHANT_TAGS = [
  'Comida bien caliente',
  'Empaque impecable',
  'Sabor auténtico',
  'Porción abundante',
  'Llegó crocante',
  'Ingredientes frescos',
];

const COURIER_TAGS = [
  'Puntualidad porteña',
  'Muy educado y cordial',
  'Manejo seguro sin derrames',
  'Entrega en mano con sonrisa',
  'Subió al piso indicado',
  'Buena comunicación',
];

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    closeReviewModal,
    reviewModalOrder,
    reviewModalTarget,
    submitReview,
  } = useEcosystem();

  const [activeTarget, setActiveTarget] = useState<ReviewTargetType>(reviewModalTarget);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [extraTip, setExtraTip] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    setActiveTarget(reviewModalTarget);
    setRating(5);
    setSelectedTags([]);
    setComment('');
    setExtraTip(0);
    setIsSuccess(false);
  }, [reviewModalTarget, isReviewModalOpen]);

  if (!isReviewModalOpen) return null;

  const currentTags = activeTarget === 'merchant' ? MERCHANT_TAGS : COURIER_TAGS;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview({
      targetType: activeTarget,
      rating,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      courierTipBonus: activeTarget === 'courier' && extraTip > 0 ? extraTip : undefined,
    });
    setIsSuccess(true);
  };

  const getRatingFeedbackLabel = (score: number) => {
    switch (score) {
      case 5:
        return '¡Excelente, de diez!';
      case 4:
        return 'Muy bueno';
      case 3:
        return 'Bueno';
      case 2:
        return 'Regular';
      case 1:
        return 'Malo / Deficiente';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[var(--surface)] text-[var(--text)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Header with Close */}
        <div className="px-5 pt-4 pb-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
            </div>
            <div>
              <h2 id="review-modal-title" className="text-base font-bold text-[var(--text)]">
                Calificar Experiencia
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {reviewModalOrder ? `Comanda #${reviewModalOrder.orderNumber}` : 'Orden finalizada'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeReviewModal}
            aria-label="Cerrar modal"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Target Tabs (Merchant vs Courier) */}
          <div className="p-1 bg-[var(--surface-alt)] rounded-xl flex items-center border border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setActiveTarget('merchant');
                setSelectedTags([]);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTarget === 'merchant'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Comercio & Comida</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTarget('courier');
                setSelectedTags([]);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTarget === 'courier'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
              <span>Cadete & Entrega</span>
            </button>
          </div>

          {/* Target Information Card */}
          <div className="p-3 bg-[var(--surface-alt)]/60 rounded-2xl border border-[var(--border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--brand)]">
              <span className="material-symbols-outlined text-[22px]">
                {activeTarget === 'merchant' ? 'restaurant' : 'sports_motorsports'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                {activeTarget === 'merchant' ? 'Restaurante calificado' : 'Cadete asignado'}
              </span>
              <p className="font-bold text-sm text-[var(--text)] truncate">
                {activeTarget === 'merchant'
                  ? reviewModalOrder?.merchantName || 'Pizzería Napolitana Gourmet'
                  : reviewModalOrder?.courierName || 'Carlos Gómez (Cadete Express)'}
              </p>
            </div>
          </div>

          {/* Star Rating Section */}
          <div className="text-center py-2 space-y-2">
            <label className="text-xs font-bold text-[var(--text)] block">
              ¿Cómo calificarías el servicio?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const currentDisplay = hoverRating !== null ? hoverRating : rating;
                const isFilled = star <= currentDisplay;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    aria-label={`${star} estrellas`}
                    className="p-1 transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[32px] transition-colors ${
                        isFilled ? 'text-amber-400 fill-icon' : 'text-slate-300 dark:text-zinc-600'
                      }`}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-extrabold text-[var(--brand)]">
              {getRatingFeedbackLabel(hoverRating !== null ? hoverRating : rating)}
            </p>
          </div>

          {/* Quick Tag Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--text)] block">
              Destacar aspectos positivos
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--brand-soft)] border-[var(--brand)] text-[var(--brand)] font-bold shadow-xs'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand)]/40 hover:text-[var(--text)]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Courier Tip Option (Only when rating courier) */}
          {activeTarget === 'courier' && (
            <div className="p-3 bg-[var(--brand-soft)]/50 rounded-2xl border border-[var(--brand)]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[var(--brand)]">
                    volunteer_activism
                  </span>
                  ¿Sumar propina extra al cadete?
                </span>
                <span className="text-[10px] text-[var(--brand)] font-bold">100% directa</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setExtraTip(amount)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      extraTip === amount
                        ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)]/40'
                    }`}
                  >
                    {amount === 0 ? 'Sin extra' : `+${formatMoney({ amount, currency: 'ARS' })}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments Textarea */}
          <div className="space-y-1">
            <label htmlFor="review-comment" className="text-xs font-bold text-[var(--text)] block">
              Comentarios adicionales (opcional)
            </label>
            <textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contanos qué te pareció la comida, la atención y la velocidad..."
              className="w-full p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] transition-all resize-none"
            />
          </div>

          {/* Points Incentive Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
            <span className="material-symbols-outlined text-[18px] shrink-0 fill-icon">
              toll
            </span>
            <p className="text-[11px] font-medium leading-tight">
              Recibirás <strong>+50 Puntos Porteños</strong> en tu cuenta de Comunidad Porteña al enviar tu reseña.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between gap-3 bg-[var(--surface)]">
          <button
            type="button"
            onClick={closeReviewModal}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            Omitir por ahora
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Publicar Calificación</span>
          </button>
        </div>
      </div>
    </div>
  );
};
