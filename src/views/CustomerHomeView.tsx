/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryChip } from '../components/ui/CategoryChip';
import { MerchantCard } from '../components/ui/MerchantCard';
import { AdLabel } from '../components/ui/AdLabel';
import { mockCategories } from '../data/mockData';
import { formatMoney } from '../utils/formatters';
import { useData } from '../context/DataContext';

interface CustomerHomeViewProps {
  onSelectMerchant?: (merchantId: string) => void;
  onNavigateToTab?: (tab: 'inicio' | 'explorar' | 'pedidos' | 'ofertas' | 'perfil') => void;
}

export const CustomerHomeView: React.FC<CustomerHomeViewProps> = ({
  onSelectMerchant,
  onNavigateToTab,
}) => {
  const { merchants, backendHealth, isLiveBackend, refreshMerchants } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-1');

  const filteredMerchants = merchants.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q)) ||
      m.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3">
      {/* Prominent Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="¿Qué estás buscando hoy? Platos, locales..."
        onFilterClick={() => {}}
      />

      {/* Backend Tunnel Connection Status Pill */}
      {isLiveBackend && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold truncate">Backend Docker Conectado:</span>
            <span className="font-mono text-[10px] opacity-85 truncate">
              {backendHealth.service || 'Marketplace Delivery API'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => refreshMerchants()}
            className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 underline hover:no-underline shrink-0 ml-2 cursor-pointer"
          >
            Actualizar datos
          </button>
        </div>
      )}

      {/* Hero Promotional Banner (50% OFF Card) */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#241712] text-white shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM2v-jql2zAzZA5-Ky9GPf1qrCZT_pMUubXDSuwS77o3vBpjsujOk3tGe0vSHXK886qf4Obt9WOzulrAMUxo0Clk39ruglMuUmBqj97njvS3-XdP3m0dd6OOROtaSakbj1Ao5N6QyDnBVufJGAQNX4GIsCCOyVAZF-IbNTdEN-QoEEQ6DNHcIFR9waNfMDZWTACZCbcX3MBQf3A6F4dizm2A0ZGPAw8vazjMJ1hKUlYElQ2ikqoT33GA"
            alt="Hamburguesa artesanal gourmet con papas fritas"
            className="w-full h-full object-cover opacity-85 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b100b] via-[#1b100be6] to-transparent" />
        </div>

        <div className="relative z-10 p-4 flex flex-col justify-between min-h-[160px] max-w-[70%]">
          <div>
            <div className="inline-flex items-center gap-1 bg-[var(--brand)] text-white px-2 py-0.5 rounded-full mb-1.5 text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
              <span className="material-symbols-outlined text-[12px] fill-icon">
                local_fire_department
              </span>
              PROMO EXCLUSIVA
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">50% OFF</h2>
            <p className="text-xs text-[#F3E6DD] mt-0.5 line-clamp-1">
              En tu primer pedido local
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab('ofertas')}
              className="h-9 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:scale-95 transition-all text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pedir ahora</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Categories Bar */}
      <section className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text)]">Categorías</h3>
          <button
            type="button"
            onClick={() => onNavigateToTab && onNavigateToTab('explorar')}
            className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
          >
            Ver todas
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          {mockCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              id={cat.id}
              name={cat.name}
              iconName={cat.iconName}
              isActive={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* Ofertas del Día Section */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--brand)] fill-icon">
              local_offer
            </span>
            <h3 className="text-base font-bold text-[var(--text)]">Ofertas del Día</h3>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
            Actualizado hoy
          </span>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-3 border border-[var(--border)] shadow-sm flex gap-3 relative overflow-hidden">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[var(--surface-alt)]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKvOU2aHRL9_hPljwo7caBfViJnFAck4Q3jGBwxZeFvq_2KGQ41gOkA-NoDAS25oRNBNG98lgXTdOl7OVUQhpjCZ25ljGqcXwEelS5rwHygASuTyra468OtxhkeoGx37Sj_SA3zIOH3O-Q_MxkNl4k7a1e4NEDwCVxN5FtWUHEz5iJze_wgKfaAaCjLPl8Cm_jwT2PCTvfqyaIyKbhaIeomhUUESNuqX6nKUUx14zY7rfsmCnmkdxWvg"
              alt="Combo Crispy Burger + Papas"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-1 left-1 bg-[var(--error)] text-white text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase">
              -30%
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <AdLabel />
                <span className="text-[var(--success)] text-xs font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px] fill-icon">star</span>
                  4.9
                </span>
              </div>
              <h4 className="text-sm font-bold text-[var(--text)] truncate">
                Combo Crispy Burger + Papas
              </h4>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                Burger Station San Nicolás
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-extrabold text-[var(--brand)]">
                  {formatMoney(5400)}
                </span>
                <span className="text-xs text-[var(--text-secondary)] line-through">
                  {formatMoney(7800, false)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectMerchant && onSelectMerchant('merch-2')}
                aria-label="Ver combo"
                className="w-8 h-8 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center hover:bg-[var(--brand)] hover:text-white transition-colors active:scale-95 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comercios Destacados Section */}
      <section className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--brand)] fill-icon">
              verified
            </span>
            <h3 className="text-base font-bold text-[var(--text)]">Comercios Destacados</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab && onNavigateToTab('explorar')}
            className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
          >
            Ver mapa
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {filteredMerchants.map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onClick={() => onSelectMerchant && onSelectMerchant(merchant.id)}
            />
          ))}
        </div>
      </section>

      {/* Beneficio Exclusivo Banner */}
      <section className="pb-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[var(--surface)] via-[var(--surface-soft)] to-[var(--surface)] border border-[var(--border)] flex items-center gap-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)]/30 flex items-center justify-center shrink-0 text-[var(--brand)]">
            <span className="material-symbols-outlined text-[22px] fill-icon">
              moped
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-[var(--brand)] uppercase tracking-wider">
              Beneficio Exclusivo
            </div>
            <p className="text-xs text-[var(--text)] truncate">
              Envío gratis en compras mayores a <strong className="text-[var(--brand)] font-bold">$10.000 ARS</strong>
            </p>
          </div>
          <span className="material-symbols-outlined text-[var(--text-secondary)] text-[18px]">
            chevron_right
          </span>
        </div>
      </section>
    </div>
  );
};
