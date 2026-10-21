/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  count = 1,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded h-4 w-3/4';
      default:
        return 'rounded-xl';
    }
  };

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[var(--surface-alt)] border border-[var(--border)]/40 ${getVariantClass()} ${className}`}
        />
      ))}
    </>
  );
};
