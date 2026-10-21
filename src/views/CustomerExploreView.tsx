/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryChip } from '../components/ui/CategoryChip';
import { MerchantCard } from '../components/ui/MerchantCard';
import { mockCategories, mockMerchants } from '../data/mockData';

interface CustomerExploreViewProps {
  onSelectMerchant?: (merchantId: string) => void;
}

export const CustomerExploreView: React.FC<CustomerExploreViewProps> = ({ onSelectMerchant }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'freeDelivery' | 'rating'>(
    'all',
  );

  const filteredMerchants = mockMerchants.filter((m) => {
    if (selectedFilter === 'open' && !m.isOpen) return false;
    if (selectedFilter === 'freeDelivery' && !m.freeDeliveryThreshold && m.deliveryFee.amount > 0)
      return false;
    if (selectedFilter === 'rating' && m.rating < 4.8) return false;

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
      {/* Search Input */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar locales, platos o categorías..."
      />

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        <CategoryChip
          id="all"
          name="Todos"
          iconName="tune"
          variant="pill"
          isActive={selectedFilter === 'all'}
          onClick={() => setSelectedFilter('all')}
        />
        <CategoryChip
          id="open"
          name="Abierto Ahora"
          iconName="schedule"
          variant="pill"
          isActive={selectedFilter === 'open'}
          onClick={() => setSelectedFilter('open')}
        />
        <CategoryChip
          id="freeDelivery"
          name="Envío Gratis"
          iconName="delivery_dining"
          variant="pill"
          isActive={selectedFilter === 'freeDelivery'}
          onClick={() => setSelectedFilter('freeDelivery')}
        />
        <CategoryChip
          id="rating"
          name="Mejor Calificados"
          iconName="star"
          variant="pill"
          isActive={selectedFilter === 'rating'}
          onClick={() => setSelectedFilter('rating')}
        />
      </div>

      {/* Merchant Results List */}
      <section className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">
            Locales encontrados ({filteredMerchants.length})
          </h2>
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
    </div>
  );
};
