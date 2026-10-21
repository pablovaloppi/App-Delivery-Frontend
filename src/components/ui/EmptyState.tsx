/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-[var(--text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
