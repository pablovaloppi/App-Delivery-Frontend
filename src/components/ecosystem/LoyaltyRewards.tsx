/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { calculateTierProgress, LOYALTY_TIERS } from '../../utils/ecosystemLogic';
import { formatMoney } from '../../utils/formatters';

interface LoyaltyRewardsProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export const LoyaltyRewards: React.FC<LoyaltyRewardsProps> = ({
  isOpen = false,
  onClose,
  inline = false,
}) => {
  const {
    loyaltyProfile,
    availableCoupons,
    redeemCoupon,
    isLoyaltyModalOpen,
    closeLoyaltyModal,
  } = useEcosystem();

  const [activeTab, setActiveTab] = useState<'tiers' | 'coupons' | 'badges'>('coupons');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const effectiveIsOpen = inline ? true : isOpen || isLoyaltyModalOpen;
  const effectiveOnClose = onClose || closeLoyaltyModal;

  if (!effectiveIsOpen) return null;

  const { currentTier, nextTier, pointsToNext, progressPercent } = calculateTierProgress(
    loyaltyProfile.totalPoints
  );

  const handleRedeem = (coupon: (typeof availableCoupons)[0]) => {
    const res = redeemCoupon(coupon);
    setFeedbackMsg({ text: res.message, isError: !res.success });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const content = (
    <div className="flex flex-col space-y-4 text-[var(--text)]">
      {/* Tier Overview Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-900 text-white p-5 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[16px]">{currentTier.badgeIcon}</span>
              <span>{currentTier.label}</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">Comunidad Porteña</h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Acumulás 1 punto cada $100 ARS en comercios de tu barrio
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-200">
              Puntos Disponibles
            </span>
            <div className="text-3xl font-black leading-tight flex items-center justify-end gap-1">
              <span>{loyaltyProfile.totalPoints}</span>
              <span className="material-symbols-outlined text-[20px] text-amber-300 fill-icon">
                toll
              </span>
            </div>
            <span className="text-[10px] text-amber-100">
              Histórico: {loyaltyProfile.lifetimePoints} pts
            </span>
          </div>
        </div>

        {/* Progress Bar towards next tier */}
        <div className="mt-4 pt-3 border-t border-white/20 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span>{currentTier.label}</span>
            {nextTier ? (
              <span>
                Faltan {pointsToNext} pts para {nextTier.label}
              </span>
            ) : (
              <span>¡Nivel Máximo de Honor Porteño!</span>
            )}
          </div>
          <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            feedbackMsg.isError
              ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedbackMsg.isError ? 'error' : 'check_circle'}
          </span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="p-1 bg-[var(--surface-alt)] rounded-xl flex items-center border border-[var(--border)]">
        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
          <span>Cupones ({availableCoupons.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tiers')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'tiers'
              ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">military_tech</span>
          <span>Niveles & Ventajas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-[var(--surface)] text-[var(--brand)] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>Insignias</span>
        </button>
      </div>

      {/* Tab: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-3">
          {availableCoupons.length === 0 ? (
            <div className="p-6 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
              <span className="material-symbols-outlined text-[36px] text-[var(--text-secondary)]">
                sentiment_satisfied
              </span>
              <p className="text-xs font-bold text-[var(--text)] mt-2">
                ¡Ya canjeaste todos los cupones disponibles!
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Seguí pidiendo en comercios porteños para desbloquear nuevos cupones barriales.
              </p>
            </div>
          ) : (
            availableCoupons.map((coupon) => {
              const canAfford = loyaltyProfile.totalPoints >= coupon.pointsCost;
              return (
                <div
                  key={coupon.id}
                  className="p-3.5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-xs flex items-center justify-between gap-3 hover:border-[var(--brand)]/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">local_activity</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[var(--text)] truncate">
                        {coupon.title}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">
                        {coupon.code}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                      {coupon.description}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                      Mínimo de compra: {formatMoney(coupon.minSpend)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      {coupon.pointsCost} pts
                    </span>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleRedeem(coupon)}
                      className={`mt-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white shadow-xs active:scale-95'
                          : 'bg-[var(--surface-alt)] text-[var(--text-secondary)] border border-[var(--border)] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {canAfford ? 'Canjear' : 'Puntos insuf.'}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Redeemed Coupons Record */}
          {loyaltyProfile.redeemedCoupons.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                Tus cupones activos para usar en Checkout
              </span>
              <div className="space-y-1.5">
                {loyaltyProfile.redeemedCoupons.map((c, i) => (
                  <div
                    key={`${c.id}-${i}`}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                        check_circle
                      </span>
                      <span className="font-bold text-[var(--text)]">{c.title}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-white/40 dark:bg-black/30 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Tiers */}
      {activeTab === 'tiers' && (
        <div className="space-y-3">
          {Object.values(LOYALTY_TIERS).map((t) => {
            const isCurrent = t.tier === currentTier.tier;
            return (
              <div
                key={t.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[var(--surface)] border-[var(--brand)] shadow-md ring-1 ring-[var(--brand)]/30'
                    : 'bg-[var(--surface)] border-[var(--border)] opacity-85'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px] text-[var(--brand)]">
                      {t.badgeIcon}
                    </span>
                    <h4 className="font-bold text-sm text-[var(--text)]">{t.label}</h4>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--brand)] text-white text-[10px] font-extrabold">
                      Nivel Actual
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-[var(--text-secondary)] flex items-center gap-3">
                  <span>Requisito: {t.minPoints} pts {t.maxPoints ? `- ${t.maxPoints} pts` : '+'}</span>
                  <span>•</span>
                  <span className="text-[var(--brand)] font-bold">
                    {t.cashbackPercent}% Beneficio en puntos
                  </span>
                </div>
                <ul className="mt-2.5 space-y-1 text-xs text-[var(--text)]">
                  {t.perks.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">
                        check
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {loyaltyProfile.unlockedBadges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-[var(--surface)] border-[var(--border)] shadow-xs'
                  : 'bg-[var(--surface-alt)]/50 border-[var(--border)] opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  b.unlocked
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{b.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-[var(--text)] truncate">{b.title}</h5>
                  {b.unlocked && (
                    <span className="material-symbols-outlined text-[14px] text-amber-500 fill-icon">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                  {b.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-[var(--surface-alt)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (b.currentValue / b.targetValue) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                    {b.currentValue}/{b.targetValue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[var(--surface)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loyalty-modal-title"
      >
        <div className="px-5 pt-4 pb-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
            <div>
              <h2 id="loyalty-modal-title" className="text-base font-bold text-[var(--text)]">
                Club Comunidad Porteña
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Programa de fidelidad y comercio justo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={effectiveOnClose}
            aria-label="Cerrar modal de fidelidad"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};
