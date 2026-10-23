/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { useAuth } from '../../context/AuthContext';
import { SIMULATION_STEPS } from '../../utils/ecosystemLogic';

export const SimulationController: React.FC = () => {
  const {
    simulationStepIndex,
    currentSimulationStep,
    isSimulationOpen,
    openSimulation,
    closeSimulation,
    isSimulationAutoPlay,
    toggleSimulationAutoPlay,
    advanceSimulationStep,
    jumpToSimulationStep,
    resetSimulation,
    openReviewModal,
    simulatedOrder,
  } = useEcosystem();

  const { role, setRole } = useAuth();
  const [autoSwitchRole, setAutoSwitchRole] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleAdvance = () => {
    advanceSimulationStep(autoSwitchRole ? (newRole) => setRole(newRole) : undefined);
  };

  const handleJump = (index: number) => {
    jumpToSimulationStep(index, autoSwitchRole ? (newRole) => setRole(newRole) : undefined);
  };

  const handleReset = () => {
    resetSimulation(autoSwitchRole ? (newRole) => setRole(newRole) : undefined);
  };

  // If simulation is closed, render an unobtrusive trigger button at the bottom right
  if (!isSimulationOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={openSimulation}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-[var(--brand)] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-white/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] animate-pulse">
            play_circle
          </span>
          <span>Simulador E2E (Etapa 6)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-[var(--surface)]/95 backdrop-blur-md rounded-2xl border-2 border-[var(--brand)] shadow-2xl overflow-hidden transition-all text-[var(--text)]">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-[var(--brand)] text-white px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">alt_route</span>
          <span className="text-xs font-black tracking-wide uppercase">
            Simulador de Flujo Completo E2E
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expandir simulador' : 'Minimizar simulador'}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMinimized ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          <button
            type="button"
            onClick={closeSimulation}
            aria-label="Cerrar simulador"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-3">
          {/* Stepper Dots & Current Status */}
          <div className="flex items-center justify-between gap-1 px-1">
            {SIMULATION_STEPS.map((s, idx) => {
              const isActive = idx === simulationStepIndex;
              const isPast = idx < simulationStepIndex;
              return (
                <button
                  key={s.stepIndex}
                  type="button"
                  onClick={() => handleJump(idx)}
                  title={`${s.badgeText}: ${s.title}`}
                  className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--brand)] ring-2 ring-[var(--brand)]/30 scale-y-125'
                      : isPast
                      ? 'bg-amber-500'
                      : 'bg-[var(--surface-alt)] border border-[var(--border)]'
                  }`}
                />
              );
            })}
          </div>

          {/* Current Step Description Card */}
          <div className="p-2.5 rounded-xl bg-[var(--surface-alt)]/70 border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-[var(--brand-soft)] text-[var(--brand)] text-[10px] font-black uppercase">
                Paso {simulationStepIndex + 1} de {SIMULATION_STEPS.length} • {currentSimulationStep.badgeText}
              </span>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] capitalize">
                Actor: {currentSimulationStep.role}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[var(--text)]">
              {currentSimulationStep.title}
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {currentSimulationStep.description}
            </p>
          </div>

          {/* Controls & Role Sync */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSwitchRole}
                onChange={(e) => setAutoSwitchRole(e.target.checked)}
                className="rounded accent-[var(--brand)] w-3.5 h-3.5"
              />
              <span>Auto-cambiar rol en pantalla ({currentSimulationStep.role})</span>
            </label>

            {simulationStepIndex === 5 && (
              <button
                type="button"
                onClick={() => openReviewModal(simulatedOrder, 'merchant')}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">rate_review</span>
                <span>Abrir Reseña</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdvance}
              className="flex-1 py-2 px-3 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">skip_next</span>
              <span>Avanzar Paso</span>
            </button>

            <button
              type="button"
              onClick={toggleSimulationAutoPlay}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isSimulationAutoPlay
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                  : 'bg-[var(--surface-alt)] hover:bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSimulationAutoPlay ? 'pause' : 'play_arrow'}
              </span>
              <span>{isSimulationAutoPlay ? 'Pausar' : 'Auto'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reiniciar simulación"
              className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
