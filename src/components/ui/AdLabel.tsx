/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdLabelProps {
  className?: string;
}

export const AdLabel: React.FC<AdLabelProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--text-secondary)] font-bold text-[9px] tracking-wider uppercase select-none ${className}`}
    >
      PUBLICIDAD
    </span>
  );
};
