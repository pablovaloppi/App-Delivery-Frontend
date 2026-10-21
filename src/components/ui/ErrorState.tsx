/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocurrió un inconveniente',
  message = 'No pudimos conectar con el servidor. Por favor, verificá tu conexión e intentá nuevamente.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-6 bg-[var(--surface)] border border-[var(--error)]/30 rounded-2xl ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-[var(--error)] flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-[28px]">error</span>
      </div>
      <h3 className="text-base font-bold text-[var(--text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<span className="material-symbols-outlined text-[16px]">refresh</span>}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
