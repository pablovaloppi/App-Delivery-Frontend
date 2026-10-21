/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '¿Qué estás buscando hoy?',
  onFilterClick,
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className="flex-1 relative flex items-center bg-[var(--surface)] dark:bg-[var(--surface-dark)] rounded-full h-11 px-4 shadow-sm border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--brand)] transition-all">
        <span className="material-symbols-outlined text-[var(--text-secondary)] mr-2 text-[20px]">
          search
        </span>
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none p-0 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:ring-0 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              const fakeEvent = {
                target: { value: '' },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(fakeEvent);
            }}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text)]"
            aria-label="Limpiar búsqueda"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filtros avanzados"
          className="w-11 h-11 rounded-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:scale-95 flex items-center justify-center text-white shrink-0 transition-transform shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      )}
    </div>
  );
};
