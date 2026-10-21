/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CategoryChipProps {
  id: string;
  name: string;
  iconName: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'vertical' | 'pill';
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  name,
  iconName,
  isActive,
  onClick,
  variant = 'vertical',
}) => {
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer
          ${
            isActive
              ? 'bg-[var(--brand-soft)] border-1.5 border-[var(--brand)] text-[var(--brand)] shadow-sm'
              : 'bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--brand)]/50'
          }
        `}
      >
        <span
          className={`material-symbols-outlined text-[18px] ${isActive ? 'fill-icon' : ''}`}
        >
          {iconName}
        </span>
        <span>{name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer"
    >
      <div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 group-active:scale-95 shadow-sm
          ${
            isActive
              ? 'bg-[var(--brand-soft)] border-2 border-[var(--brand)] text-[var(--brand)]'
              : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] group-hover:text-[var(--brand)]'
          }
        `}
      >
        <span
          className={`material-symbols-outlined text-2xl ${isActive ? 'fill-icon' : ''}`}
        >
          {iconName}
        </span>
      </div>
      <span
        className={`
          mt-1.5 text-xs font-semibold truncate max-w-[72px] text-center
          ${isActive ? 'text-[var(--brand)] font-bold' : 'text-[var(--text)]'}
        `}
      >
        {name}
      </span>
    </button>
  );
};
