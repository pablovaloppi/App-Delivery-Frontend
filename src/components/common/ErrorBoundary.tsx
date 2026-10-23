/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FoodieLocal ErrorBoundary] Caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4 border border-rose-500/20">
            <span className="material-symbols-outlined text-[32px]">warning</span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text)] mb-1">Ocurrió un inconveniente temporal</h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-xs mb-6">
            Ha habido un error de actualización en la vista. Haz clic abajo para recargar el panel.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-bold text-xs shadow-md hover:bg-[var(--brand-dark)] transition-all cursor-pointer"
          >
            Reintentar y Cargar Vista
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
