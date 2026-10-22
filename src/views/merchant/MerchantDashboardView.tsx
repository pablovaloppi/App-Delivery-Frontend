/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OrderStatus, OrderViewModel } from '../../types';
import { merchantService, StoreSettings } from '../../services/api/merchantService';
import {
  calculateMerchantMetrics,
  filterOrdersByPipelineTab,
  MerchantPipelineTab,
} from '../../utils/merchantLogic';
import { formatMoney } from '../../utils/formatters';
import { MerchantOrderDetailModal } from './MerchantOrderDetailModal';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const MerchantDashboardView: React.FC = () => {
  const [orders, setOrders] = useState<OrderViewModel[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    isOpen: true,
    estimatedPrepTimeMin: 20,
    estimatedPrepTimeMax: 30,
    acceptsAutomatedDispatch: true,
    alertSoundEnabled: true,
    autoAcceptOrders: false,
  });

  const [activeTab, setActiveTab] = useState<MerchantPipelineTab>('new');
  const [selectedOrder, setSelectedOrder] = useState<OrderViewModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const fetchedOrders = await merchantService.getOrders();
    setOrders(fetchedOrders);
    const fetchedSettings = await merchantService.getSettings();
    setSettings(fetchedSettings);
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = calculateMerchantMetrics(orders);
  const visibleOrders = filterOrdersByPipelineTab(orders, activeTab);

  const handleUpdateStatus = async (orderId: string, targetStatus: OrderStatus) => {
    await merchantService.updateOrderStatus(orderId, targetStatus);
    await loadData();
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    await merchantService.rejectOrder(orderId, reason);
    await loadData();
  };

  const toggleStoreStatus = async () => {
    const updated = await merchantService.updateSettings({ isOpen: !settings.isOpen });
    setSettings(updated);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 select-none pb-24">
      {/* Store Control Console Bar */}
      <section className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleStoreStatus}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95
                ${
                  settings.isOpen
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[var(--success)] border border-emerald-300 dark:border-emerald-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-[var(--text-secondary)] border border-stone-300 dark:border-stone-700'
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isOpen ? 'bg-[var(--success)] animate-pulse' : 'bg-stone-400'
                }`}
              />
              <span>{settings.isOpen ? 'Comercio Abierto' : 'Comercio Cerrado'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-[var(--surface-alt)] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span>{settings.estimatedPrepTimeMin}-{settings.estimatedPrepTimeMax} min</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                const updated = await merchantService.updateSettings({
                  alertSoundEnabled: !settings.alertSoundEnabled,
                });
                setSettings(updated);
              }}
              aria-label="Alerta sonora"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                settings.alertSoundEnabled
                  ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                  : 'bg-[var(--surface-alt)] text-[var(--text-secondary)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {settings.alertSoundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>
          </div>
        </div>

        {/* Daily Operations KPI Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          <div
            onClick={() => setActiveTab('new')}
            className={`p-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'new'
                ? 'bg-[var(--brand-soft)] border border-[var(--brand)]/30'
                : 'bg-[var(--surface-alt)]'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block truncate">
              Nuevos
            </span>
            <span
              className={`text-base font-extrabold ${
                metrics.newCount > 0 ? 'text-[var(--brand)]' : 'text-[var(--text)]'
              }`}
            >
              {metrics.newCount}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('kitchen')}
            className={`p-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'kitchen'
                ? 'bg-[var(--brand-soft)] border border-[var(--brand)]/30'
                : 'bg-[var(--surface-alt)]'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block truncate">
              Cocina
            </span>
            <span className="text-base font-extrabold text-amber-600">
              {metrics.kitchenCount}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('ready')}
            className={`p-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'ready'
                ? 'bg-[var(--brand-soft)] border border-[var(--brand)]/30'
                : 'bg-[var(--surface-alt)]'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block truncate">
              Listos
            </span>
            <span className="text-base font-extrabold text-blue-600">
              {metrics.readyCount}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('history')}
            className={`p-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'history'
                ? 'bg-[var(--brand-soft)] border border-[var(--brand)]/30'
                : 'bg-[var(--surface-alt)]'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block truncate">
              Ventas
            </span>
            <span className="text-xs font-extrabold text-[var(--text)] block mt-0.5 truncate">
              {formatMoney(metrics.totalSales, false)}
            </span>
          </div>
        </div>
      </section>

      {/* Urgent Audio/Visual Alert if New Orders exist */}
      {metrics.newCount > 0 && activeTab !== 'new' && (
        <button
          type="button"
          onClick={() => setActiveTab('new')}
          className="p-3 bg-[var(--brand)] text-white rounded-2xl flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] animate-bounce">
              notifications_active
            </span>
            <span className="text-xs font-bold">
              ¡Tenés {metrics.newCount} comanda nueva esperando confirmación!
            </span>
          </div>
          <span className="text-xs font-extrabold underline">Ver ahora</span>
        </button>
      )}

      {/* Pipeline Navigation Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('new')}
          className={`
            shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer
            ${
              activeTab === 'new'
                ? 'bg-[var(--brand)] text-white shadow-xs'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span>Nuevos</span>
          {metrics.newCount > 0 && (
            <span
              className={`text-[10px] px-1.5 rounded-full font-extrabold ${
                activeTab === 'new' ? 'bg-white text-[var(--brand)]' : 'bg-[var(--brand)] text-white'
              }`}
            >
              {metrics.newCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kitchen')}
          className={`
            shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer
            ${
              activeTab === 'kitchen'
                ? 'bg-[var(--brand)] text-white shadow-xs'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span>En Cocina</span>
          <span
            className={`text-[10px] px-1.5 rounded-full font-extrabold ${
              activeTab === 'kitchen' ? 'bg-white text-[var(--brand)]' : 'bg-[var(--surface-alt)]'
            }`}
          >
            {metrics.kitchenCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ready')}
          className={`
            shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer
            ${
              activeTab === 'ready'
                ? 'bg-[var(--brand)] text-white shadow-xs'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span>Listos para Retiro</span>
          <span
            className={`text-[10px] px-1.5 rounded-full font-extrabold ${
              activeTab === 'ready' ? 'bg-white text-[var(--brand)]' : 'bg-[var(--surface-alt)]'
            }`}
          >
            {metrics.readyCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`
            shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer
            ${
              activeTab === 'history'
                ? 'bg-[var(--brand)] text-white shadow-xs'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }
          `}
        >
          <span>Historial</span>
        </button>
      </div>

      {/* Orders List in Active Pipeline Tab */}
      <section className="space-y-3">
        {visibleOrders.length === 0 ? (
          <div className="p-8 text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <span className="material-symbols-outlined text-[36px] text-[var(--text-secondary)]">
              task_alt
            </span>
            <p className="text-sm font-bold text-[var(--text)] mt-2">
              No hay pedidos en esta sección
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Las comandas aparecerán automáticamente a medida que ingresen.
            </p>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <article
              key={order.id}
              onClick={() => {
                setSelectedOrder(order);
                setIsModalOpen(true);
              }}
              className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] shadow-xs hover:border-[var(--brand)]/40 transition-all cursor-pointer space-y-3"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between pb-2 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[var(--text)]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {new Date(order.createdAt).toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      hs
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {order.deliveryAddress.label} • {order.items.length}{' '}
                    {order.items.length === 1 ? 'ítem' : 'ítems'}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* Order Items Preview */}
              <div className="space-y-1 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-[var(--brand)]">{item.quantity}x</span>
                      <span className="text-[var(--text)] font-semibold truncate">{item.name}</span>
                    </div>
                    <span className="text-[var(--text-secondary)] font-bold shrink-0 ml-2">
                      {formatMoney(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customer Notes Alert if present */}
              {order.items.some((i) => i.notes) && (
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">comment</span>
                  <span className="truncate">
                    Nota: "{order.items.find((i) => i.notes)?.notes}"
                  </span>
                </div>
              )}

              {/* Bottom Card Action Toolbar */}
              <div
                className="pt-2 border-t border-[var(--border)] flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <span className="text-[10px] text-[var(--text-secondary)] block">Total orden</span>
                  <span className="text-xs font-extrabold text-[var(--text)]">
                    {formatMoney(order.subtotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--border)] text-xs font-bold text-[var(--text)] transition-all cursor-pointer"
                  >
                    Detalle
                  </button>

                  {order.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">soup_kitchen</span>
                      <span>Aceptar</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      <span>Marcar Listo</span>
                    </button>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">two_wheeler</span>
                      <span>Esperando cadete</span>
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Order Detail Modal */}
      <MerchantOrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onRejectOrder={handleRejectOrder}
      />
    </div>
  );
};
