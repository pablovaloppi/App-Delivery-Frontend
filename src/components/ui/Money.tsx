/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MoneyAmount } from '../../types';
import { formatMoney } from '../../utils/formatters';

interface MoneyProps {
  amount: number | MoneyAmount;
  showCurrency?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'brand' | 'success';
}

export const Money: React.FC<MoneyProps> = ({
  amount,
  showCurrency = true,
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const formatted = formatMoney(amount, showCurrency);

  const sizeClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-bold',
    lg: 'text-lg font-extrabold tracking-tight',
    xl: 'text-2xl font-extrabold tracking-tight',
  };

  const variantClasses = {
    default: 'text-[var(--text)]',
    brand: 'text-[var(--brand)]',
    success: 'text-[var(--success)]',
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {formatted}
    </span>
  );
};
