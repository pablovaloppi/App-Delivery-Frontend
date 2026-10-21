/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs',
    md: 'min-h-[44px] px-4 py-2.5 text-sm',
    lg: 'min-h-[48px] px-6 py-3 text-base shadow-sm',
  };

  const variantClasses = {
    primary:
      'bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white shadow-sm',
    secondary:
      'bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)]',
    outline:
      'bg-transparent hover:bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)]',
    ghost:
      'bg-transparent hover:bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text)]',
    destructive:
      'bg-[var(--error)] hover:opacity-90 active:opacity-100 text-white shadow-sm',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[18px] mr-2">
          progress_activity
        </span>
      ) : leftIcon ? (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};
