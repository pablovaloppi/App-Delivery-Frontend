/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Merchant, Product } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { useCart } from '../context/CartContext';
import { mockProducts } from '../data/mockData';
import { formatMoney } from '../utils/formatters';

interface MerchantDetailViewProps {
  merchant: Merchant;
  onBack: () => void;
  onOpenCart: () => void;
}

export const MerchantDetailView: React.FC<MerchantDetailViewProps> = ({
  merchant,
  onBack,
  onOpenCart,
}) => {
  const { items, addItem, totals } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Populares');
  const [isFavorite, setIsFavorite] = useState(false);

  const categories = [
    'Populares',
    'Pizzas Individuales',
    'Pizzas Familiares',
    'Pastas Caseras',
    'Postres',
    'Bebidas',
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = mockProducts.filter((p) => {
    if (!internalSearch) return true;
    return (
      p.name.toLowerCase().includes(internalSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(internalSearch.toLowerCase())
    );
  });

  return (
    <div className="flex-1 flex flex-col relative pb-32">
      {/* Hero Cover Header */}
      <header className="relative w-full h-56 bg-[var(--surface-alt)] overflow-hidden">
        <img
          src={merchant.coverImage}
          alt={merchant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Controls */}
        <nav
          aria-label="Controles del comercio"
          className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10"
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver atrás"
            className="w-11 h-11 rounded-full bg-[var(--surface)]/95 backdrop-blur-sm shadow-md flex items-center justify-center text-[var(--text)] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Guardar en favoritos"
              className="w-11 h-11 rounded-full bg-[var(--surface)]/95 backdrop-blur-sm shadow-md flex items-center justify-center text-[var(--text)] hover:text-[var(--brand)] active:scale-95 transition-all cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isFavorite ? 'text-[var(--brand)] fill-icon' : ''
                }`}
              >
                favorite
              </span>
            </button>
            <button
              type="button"
              aria-label="Compartir comercio"
              className="w-11 h-11 rounded-full bg-[var(--surface)]/95 backdrop-blur-sm shadow-md flex items-center justify-center text-[var(--text)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Merchant Info Section */}
      <section className="relative px-4 pt-3 pb-3 bg-[var(--bg)]">
        {/* Overlapping Avatar Logo */}
        <div className="absolute -top-11 left-4 w-20 h-20 rounded-2xl bg-[var(--surface)] p-1 shadow-md border-2 border-[var(--surface)] overflow-hidden z-10 flex items-center justify-center">
          <img
            src={merchant.logoImage || merchant.coverImage}
            alt={merchant.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Title & Tags */}
        <div className="pt-10">
          <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">
            {merchant.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {merchant.tags.join(' • ')}
          </p>
        </div>

        {/* Status, Ratings, Delivery Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-secondary)] text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            Abierto hasta 00:00 hs
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text)] text-[11px] font-bold">
            <span className="material-symbols-outlined text-amber-500 text-[14px] fill-icon">
              star
            </span>
            <span>{merchant.rating.toFixed(1)}</span>
            <span className="text-[var(--text-secondary)] font-normal">
              ({merchant.reviewCount}+ reviews)
            </span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-secondary)] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span>20-30 min</span>
          </span>
        </div>

        {/* Free shipping promotion banner */}
        <div className="mt-3.5 p-3 rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)]/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">moped</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--brand)]">Envío Gratis</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                En pedidos mayores a $10.000 ARS
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[var(--brand)] text-[18px]">
            chevron_right
          </span>
        </div>
      </section>

      {/* Internal Search */}
      <div className="px-4 pt-1 pb-2">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[var(--text-secondary)] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder={`Buscar en ${merchant.name}...`}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-secondary)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)] transition-all"
          />
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/95 backdrop-blur-md pt-2 pb-2 px-4 border-b border-[var(--border)]">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`
                  shrink-0 h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-1.5 border-[var(--brand)] shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-alt)]'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Catalog Feed */}
      <div className="px-4 pt-4 space-y-5">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[var(--brand)] text-[20px] fill-icon">
                local_fire_department
              </span>
              Destacados y Populares
            </h2>
            <span className="text-xs text-[var(--text-secondary)]">4 productos</span>
          </div>

          <div className="space-y-3">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
                onAddToCart={(prod) => {
                  addItem(prod, 1);
                }}
              />
            ))}
          </div>
        </section>

        {/* Bebidas y Maridajes */}
        <section className="pt-1 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text)]">Bebidas y Maridajes</h2>
            <button type="button" className="text-xs font-bold text-[var(--brand)] flex items-center">
              <span>Ver todas</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
            {filteredProducts.slice(4).map((beverage) => (
              <div
                key={beverage.id}
                className="w-40 shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5 shadow-xs flex flex-col justify-between"
              >
                <div className="w-full h-24 rounded-lg bg-[var(--surface-alt)] overflow-hidden mb-2">
                  <img
                    src={beverage.imageUrl}
                    alt={beverage.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-[var(--text)] line-clamp-1">
                  {beverage.name}
                </h4>
                <p className="text-[10px] text-[var(--text-secondary)]">{beverage.description}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--border)]">
                  <span className="text-xs font-bold text-[var(--text)]">
                    {formatMoney(beverage.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem(beverage, 1)}
                    className="w-7 h-7 rounded-full bg-[var(--brand)] text-white flex items-center justify-center active:scale-95 cursor-pointer shadow-xs"
                    aria-label={`Agregar ${beverage.name}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Active Cart Bottom Bar */}
      {items.length > 0 && (
        <aside className="fixed bottom-3 left-0 right-0 max-w-[430px] mx-auto px-4 z-40">
          <div className="bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] p-2.5 sm:p-3 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 pl-1">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center font-bold shadow-xs">
                  {totals.itemsCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold">
                  {totals.itemsCount} {totals.itemsCount === 1 ? 'producto' : 'productos'}
                </p>
                <p className="text-sm font-extrabold text-[var(--text)] leading-none mt-0.5">
                  {formatMoney(totals.subtotal)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="h-12 px-5 rounded-xl bg-[var(--brand)] text-white text-sm font-bold flex items-center justify-center space-x-2 hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Ver Carrito</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={(prod, qty, opts, notes) => {
            addItem(prod, qty, opts, notes);
          }}
        />
      )}
    </div>
  );
};
