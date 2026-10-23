/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AdminSubTab,
  MarketplaceMetrics,
  DisputeTicket,
  PartnerAuditRecord,
  PlatformFeeConfig,
  ZoneDeliveryStats,
  PartnerVerificationStatus,
} from '../types/admin';
import { adminService } from '../services/api/adminService';
import { AdminHeader } from './admin/AdminHeader';
import { AdminMetricsOverview } from './admin/AdminMetricsOverview';
import { AdminDisputesView } from './admin/AdminDisputesView';
import { AdminPartnersAuditView } from './admin/AdminPartnersAuditView';
import { AdminSettingsView } from './admin/AdminSettingsView';

export const AdminOverviewView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Core backoffice data state
  const [metrics, setMetrics] = useState<MarketplaceMetrics | null>(null);
  const [zones, setZones] = useState<ZoneDeliveryStats[]>([]);
  const [disputes, setDisputes] = useState<DisputeTicket[]>([]);
  const [partners, setPartners] = useState<PartnerAuditRecord[]>([]);
  const [feeConfig, setFeeConfig] = useState<PlatformFeeConfig | null>(null);

  // Initial data loading
  const loadData = async () => {
    try {
      const [m, z, d, p, c] = await Promise.all([
        adminService.getMetrics(),
        adminService.getZoneStats(),
        adminService.getDisputes(),
        adminService.getPartners(),
        adminService.getFeeConfig(),
      ]);
      setMetrics(m);
      setZones(z);
      setDisputes(d);
      setPartners(p);
      setFeeConfig(c);
    } catch (err) {
      console.error('Failed to load admin backoffice data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleRain = async () => {
    if (!metrics) return;
    const nextState = !metrics.rainSurchargeActive;
    await adminService.toggleRainSurcharge(nextState);
    await loadData();
  };

  const handleResolveDispute = async (
    id: string,
    action: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS',
    notes: string,
    customAmount?: number
  ) => {
    await adminService.resolveDispute(id, action, notes, customAmount);
    await loadData();
  };

  const handleUpdatePartnerStatus = async (
    id: string,
    status: PartnerVerificationStatus,
    reason?: string
  ) => {
    await adminService.updatePartnerStatus(id, status, reason);
    await loadData();
  };

  const handleVerifyDocument = async (
    partnerId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => {
    await adminService.verifyPartnerDocument(partnerId, docId, status);
    await loadData();
  };

  const handleSaveConfig = async (updated: Partial<PlatformFeeConfig>) => {
    await adminService.updateFeeConfig(updated);
    await loadData();
  };

  if (isLoading || !metrics || !feeConfig) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[var(--text-secondary)] font-bold">
          Cargando consola operativa CABA...
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* Sticky Top Header with Sub-tabs and Rain Mode Toggle */}
      <AdminHeader
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        pendingDisputesCount={metrics.pendingDisputesCount}
        pendingAuditsCount={metrics.pendingAuditsCount}
        isRainActive={metrics.rainSurchargeActive}
        onToggleRain={handleToggleRain}
      />

      {/* Main Tab Content */}
      <main className="flex-1 px-4 pt-4 max-w-5xl mx-auto w-full">
        {activeSubTab === 'overview' && (
          <AdminMetricsOverview
            metrics={metrics}
            zones={zones}
            onNavigateTab={setActiveSubTab}
            onToggleRain={handleToggleRain}
          />
        )}

        {activeSubTab === 'disputes' && (
          <AdminDisputesView
            disputes={disputes}
            onResolveDispute={handleResolveDispute}
          />
        )}

        {activeSubTab === 'audit' && (
          <AdminPartnersAuditView
            partners={partners}
            onUpdatePartnerStatus={handleUpdatePartnerStatus}
            onVerifyDocument={handleVerifyDocument}
          />
        )}

        {activeSubTab === 'settings' && (
          <AdminSettingsView
            config={feeConfig}
            onSaveConfig={handleSaveConfig}
          />
        )}
      </main>
    </div>
  );
};
