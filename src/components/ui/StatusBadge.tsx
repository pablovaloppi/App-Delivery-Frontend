/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OrderStatus } from '../../types';
import { getOrderStatusBadgeVariant, getOrderStatusLabel } from '../../utils/formatters';

interface StatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const variant = getOrderStatusBadgeVariant(status);
  const label = getOrderStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold leading-none ${variant.bg} ${variant.text} ${variant.border} ${className}`}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-[14px]">
          {variant.icon}
        </span>
      )}
      <span>{label}</span>
    </span>
  );
};
