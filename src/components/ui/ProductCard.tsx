/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../../types';
import { formatMoney } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  className = '',
}) => {
  return (
    <article
      onClick={() => onClick && onClick(product)}
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-3.5 relative cursor-pointer select-none ${className}`}
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {product.isBestseller && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-[var(--brand-soft)] text-[var(--brand)] text-[10px] font-extrabold uppercase tracking-tight">
                Bestseller
              </span>
            </div>
          )}
          <h3 className="text-sm font-bold text-[var(--text)] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 mt-1">
          <span className="text-base font-extrabold text-[var(--text)] tracking-tight">
            {formatMoney(product.price)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(product);
            }}
            aria-label={`Agregar ${product.name} al pedido`}
            className="w-11 h-11 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[var(--surface-alt)] relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </article>
  );
};
