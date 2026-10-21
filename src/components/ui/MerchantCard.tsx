/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Merchant } from '../../types';
import { formatDurationMinutes, formatDistance, formatMoney } from '../../utils/formatters';
import { AdLabel } from './AdLabel';

interface MerchantCardProps {
  merchant: Merchant;
  onClick?: () => void;
  className?: string;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  onClick,
  className = '',
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article
      onClick={onClick}
      className={`group bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] select-none ${className}`}
    >
      {/* Cover Image Container */}
      <div className="relative w-full h-40 bg-[var(--surface-alt)] overflow-hidden">
        <img
          src={merchant.coverImage}
          alt={merchant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {merchant.isOpen ? (
            <span className="bg-[var(--surface)]/95 backdrop-blur-sm text-[var(--success)] font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"></span>
              Abierto
            </span>
          ) : (
            <span className="bg-[var(--surface)]/95 backdrop-blur-sm text-[var(--text-secondary)] font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
              Cerrado
            </span>
          )}

          <span className="bg-[var(--surface)]/95 backdrop-blur-sm text-[var(--text)] font-bold text-[11px] px-2 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
            <span className="material-symbols-outlined text-[13px] text-amber-500 fill-icon">
              star
            </span>
            {merchant.rating.toFixed(1)}
            <span className="text-[var(--text-secondary)] font-normal ml-0.5">
              ({merchant.reviewCount}+)
            </span>
          </span>

          {merchant.isSponsored && <AdLabel />}
        </div>

        {/* Favorite Button (44px target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--surface)]/80 backdrop-blur-sm text-[var(--text)] hover:text-[var(--brand)] transition-colors active:scale-95 shadow-sm cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              isFavorite ? 'text-[var(--brand)] fill-icon' : ''
            }`}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-base text-[var(--text)] leading-snug truncate">
              {merchant.name}
            </h4>
            {merchant.freeDeliveryThreshold && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--success)] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 px-2 py-0.5 rounded shrink-0">
                Envío Gratis
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
            {merchant.tags.join(' • ')}
          </p>
        </div>

        {/* Footer info pills */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]/70 text-xs text-[var(--text-secondary)] font-semibold">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[var(--brand)]">
              schedule
            </span>
            <span>{formatDurationMinutes(merchant.deliveryTimeMin, merchant.deliveryTimeMax)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">delivery_dining</span>
            <span>
              {merchant.deliveryFee.amount === 0
                ? 'Envío Gratis'
                : `Envío ${formatMoney(merchant.deliveryFee)}`}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">distance</span>
            <span>{formatDistance(merchant.distanceKm)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
