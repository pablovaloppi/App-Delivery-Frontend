/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useEcosystem } from '../context/EcosystemContext';
import { formatMoney } from '../utils/formatters';
import { orderService } from '../services/api/orderService';
import { OrderViewModel } from '../types';
import { AddressSelectorModal } from './AddressSelectorModal';

interface CartCheckoutViewProps {
  onBack: () => void;
  onOrderCreated: (order: OrderViewModel) => void;
  onAddMoreItems: () => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  onBack,
  onOrderCreated,
  onAddMoreItems,
}) => {
  const {
    items,
    merchant,
    updateQuantity,
    removeItem,
    tip,
    setTip,
    couponCode,
    couponDiscount,
    couponSuccessMessage,
    applyCoupon,
    totals,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    clearCart,
  } = useCart();

  const { activeAddress, setActiveAddress } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addOrder } = useData();
  const { addNotification } = useEcosystem();

  const [inputCoupon, setInputCoupon] = useState(couponCode || '');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const tipOptions = [0, 500, 1000, 1500];

  const handleApplyCoupon = () => {
    setCouponError(null);
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('El cupón ingresado no es válido o está vencido.');
    }
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting || submitSuccess) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await orderService.createOrder(
        {
          merchantId: merchant?.id || 'm_001',
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            selectedOptions: i.selectedOptions,
            notes: i.notes,
          })),
          deliveryAddressId: activeAddress.id,
          deliveryType: 'platform',
          paymentMethod: selectedPaymentMethod,
          tipAmount: tip,
          couponCode: couponCode,
        },
        items,
        totals.deliveryFee.amount,
      );

      if (res.error) {
        setErrorMessage(res.error.message);
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      if (res.data) {
        addOrder(res.data);
        addNotification({
          title: '¡Comanda Nueva Recibida!',
          message: `Pedido #${res.data.orderNumber} ingresó a cocina (${res.data.items.length} ítems).`,
          targetRole: 'merchant',
          type: 'ORDER_UPDATE',
          orderNumber: res.data.orderNumber,
        });
      }

      setTimeout(() => {
        clearCart();
        if (res.data) {
          onOrderCreated(res.data);
        }
      }, 1000);
    } catch {
      setErrorMessage('Error al conectar con el servidor. Por favor, reintenta.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative pb-36 select-none bg-[var(--bg)]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al comercio"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] active:scale-95 transition-all text-[var(--text)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-base font-bold text-[var(--text)] leading-tight">Mi Carrito</h1>
            <p className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
              <span>{merchant?.name || 'Pizzería Napolitana'}</span>
              <span>•</span>
              <span className="text-[var(--success)] font-semibold">Abierto</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--surface-soft)] border border-[var(--border)] px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[var(--brand)] text-[14px]">
              schedule
            </span>
            <span className="text-[10px] font-bold text-[var(--text)]">25-35 min</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema visual"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--surface-alt)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Checkout Canvas */}
      <main className="px-4 pt-3 space-y-4">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section: Items in Cart */}
        <section aria-label="Artículos seleccionados" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text)]">
              Tu Pedido ({totals.itemsCount})
            </h2>
            <button
              type="button"
              onClick={onAddMoreItems}
              className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
            >
              Agregar más
            </button>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
              <span className="material-symbols-outlined text-[36px] text-[var(--text-secondary)]">
                shopping_bag
              </span>
              <p className="text-sm font-bold text-[var(--text)] mt-2">Tu carrito está vacío</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Elegí tus platos favoritos para continuar con tu pedido.
              </p>
              <button
                type="button"
                onClick={onAddMoreItems}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-xs font-bold shadow-sm"
              >
                Explorar Menú
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <article
                  key={`${item.product.id}-${idx}`}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 shadow-xs flex items-start gap-3"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 w-[72px] h-[72px] rounded-xl object-cover shrink-0 bg-[var(--surface-alt)]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-[var(--text)] truncate">
                        {item.product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        aria-label="Eliminar producto"
                        className="text-[var(--text-secondary)] hover:text-[var(--error)] p-0.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    {item.selectedOptions?.extras && item.selectedOptions.extras.length > 0 && (
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 truncate">
                        + {item.selectedOptions.extras.join(', ')}
                      </p>
                    )}
                    {item.selectedOptions?.size && (
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        Tamaño: {item.selectedOptions.size}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[var(--text)]">
                        {formatMoney(item.product.price)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[var(--surface-alt)] rounded-full p-0.5 border border-[var(--border)]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          aria-label="Disminuir"
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--surface)] text-[var(--text)] active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-xs font-bold px-2 text-[var(--text)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          aria-label="Aumentar"
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--surface)] text-[var(--text)] active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section: Delivery Address Selector */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Lugar de Entrega
            </span>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer"
            >
              Cambiar
            </button>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <div className="w-9 h-9 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px] fill-icon">location_on</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--text)]">{activeAddress.label}</span>
                <span className="bg-[var(--surface-alt)] text-[var(--text-secondary)] text-[9px] px-1.5 py-0.2 rounded font-semibold">
                  Predeterminada
                </span>
              </div>
              <p className="text-xs text-[var(--text)] font-semibold mt-0.5">
                {activeAddress.street} {activeAddress.number}, {activeAddress.apartment}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[var(--text-secondary)] bg-[var(--surface-alt)] px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[14px] text-[var(--brand)]">info</span>
                <span className="truncate">{activeAddress.instructions || 'Sin notas especiales'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Payment Method Selector */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
              Método de Pago
            </h2>
            <span className="text-[9px] font-bold text-[var(--success)] uppercase">100% SEGURO</span>
          </div>

          <div className="space-y-2">
            {/* Card option */}
            <label
              onClick={() => setSelectedPaymentMethod('card')}
              className={`
                flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all
                ${
                  selectedPaymentMethod === 'card'
                    ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)]/40 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center text-[var(--brand)] shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Tarjeta de Débito/Crédito</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Visa terminada en •••• 4821</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === 'card'
                    ? 'border-[var(--brand)] bg-[var(--brand)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {selectedPaymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </label>

            {/* Mercado Pago */}
            <label
              onClick={() => setSelectedPaymentMethod('mercadopago')}
              className={`
                flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all
                ${
                  selectedPaymentMethod === 'mercadopago'
                    ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)]/40 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-alt)] flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Mercado Pago</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Dinero en cuenta o débito</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === 'mercadopago'
                    ? 'border-[var(--brand)] bg-[var(--brand)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {selectedPaymentMethod === 'mercadopago' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </label>

            {/* Cash */}
            <label
              onClick={() => setSelectedPaymentMethod('cash')}
              className={`
                flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all
                ${
                  selectedPaymentMethod === 'cash'
                    ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)]/40 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-alt)] flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Efectivo contra entrega</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Abonar al recibir tu pedido</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === 'cash'
                    ? 'border-[var(--brand)] bg-[var(--brand)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {selectedPaymentMethod === 'cash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </label>
          </div>
        </section>

        {/* Section: Courier Tip Selector */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">two_wheeler</span>
              <h2 className="text-xs font-bold text-[var(--text)]">Propina para el Repartidor</h2>
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] font-medium">Opcional</span>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)]">
            100% de la propina va directo a tu repartidor.
          </p>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {tipOptions.map((amount) => {
              const isSelected = tip === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTip(amount)}
                  className={`
                    py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95
                    ${
                      isSelected
                        ? 'border-2 border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-xs'
                        : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                    }
                  `}
                >
                  <span>{amount === 0 ? '$0' : formatMoney(amount, false)}</span>
                  {amount === 1000 && (
                    <span className="text-[8px] font-extrabold uppercase mt-0.5">Sugerido</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section: Promo Code / Coupon */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xs space-y-2">
          <label
            htmlFor="couponInput"
            className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[var(--brand)] text-[16px]">sell</span>
            <span>Cupón de Descuento</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="couponInput"
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                placeholder="Ingresá código"
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text)] outline-none focus:border-[var(--brand)]"
              />
              {couponDiscount > 0 && (
                <span className="absolute right-2.5 top-2 text-[var(--success)] material-symbols-outlined text-[16px]">
                  check_circle
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--border)] text-xs font-bold text-[var(--text)] border border-[var(--border)] active:scale-95 transition-all cursor-pointer"
            >
              Aplicar
            </button>
          </div>

          {couponSuccessMessage && (
            <p className="text-[10px] text-[var(--success)] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">done</span>
              <span>{couponSuccessMessage}</span>
            </p>
          )}

          {couponError && (
            <p className="text-[10px] text-[var(--error)] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">error</span>
              <span>{couponError}</span>
            </p>
          )}
        </section>

        {/* Section: Cost Breakdown */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xs space-y-2">
          <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
            Resumen de Cuenta
          </h2>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Subtotal</span>
              <span className="font-bold text-[var(--text)]">{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <span>Tarifa de entrega</span>
                <span className="material-symbols-outlined text-[13px]">help</span>
              </span>
              <span className="font-bold text-[var(--text)]">
                {totals.deliveryFee.amount === 0 ? 'Gratis' : formatMoney(totals.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Propina repartidor</span>
              <span className="font-bold text-[var(--text)]">{formatMoney(totals.tip)}</span>
            </div>

            {totals.discount.amount > 0 && (
              <div className="flex justify-between items-center text-[var(--success)] font-semibold">
                <span className="flex items-center gap-1">
                  <span>Descuento cupón</span>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded font-bold">
                    {couponCode}
                  </span>
                </span>
                <span>-{formatMoney(totals.discount)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[var(--border)] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-[var(--text)]">Total</span>
                <p className="text-[9px] text-[var(--text-secondary)]">IVA e impuestos incluidos</p>
              </div>
              <span className="text-lg font-extrabold text-[var(--brand)]">
                {formatMoney(totals.total)}
              </span>
            </div>
          </div>
        </section>

        {/* Security guarantee */}
        <div className="flex items-center justify-center gap-1.5 py-1 text-[var(--text-secondary)]">
          <span className="material-symbols-outlined text-[15px] text-[var(--success)]">
            verified_user
          </span>
          <span className="text-[10px]">Garantía de entrega a tiempo o reembolso directo</span>
        </div>
      </main>

      {/* Fixed Bottom Action Bar: Single Focus Rule CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] p-4 max-w-[430px] mx-auto shadow-2xl">
        <div className="flex items-center justify-between mb-2 px-1 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            <span className="text-[10px]">Llega aprox. en 25-35 min</span>
          </div>
          <div>
            Total: <strong className="text-[var(--brand)] font-extrabold">{formatMoney(totals.total)}</strong>
          </div>
        </div>

        {/* Primary Checkout Button */}
        <button
          type="button"
          onClick={handleConfirmOrder}
          disabled={isSubmitting || items.length === 0 || submitSuccess}
          className={`
            w-full h-12 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer
            ${
              submitSuccess
                ? 'bg-[var(--success)] text-white'
                : 'bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white'
            }
            ${isSubmitting || items.length === 0 ? 'opacity-80 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              <span>Procesando pedido con cocina...</span>
            </>
          ) : submitSuccess ? (
            <>
              <span className="material-symbols-outlined text-[20px] fill-icon">check</span>
              <span>¡Pedido Confirmado! Enviando a cocina</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>Confirmar Pedido • {formatMoney(totals.total)}</span>
            </>
          )}
        </button>
      </div>

      {/* Address Selector Modal */}
      <AddressSelectorModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        activeAddress={activeAddress}
        onSelectAddress={setActiveAddress}
      />
    </div>
  );
};
