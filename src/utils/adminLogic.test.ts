/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderPricing,
  resolveDispute,
  filterDisputes,
  updatePartnerStatus,
  filterPartners,
  calculatePoolDistribution,
  calculateMarketplaceHealth,
  getDisputeBadge,
  getPartnerStatusBadge,
} from './adminLogic';
import {
  DisputeTicket,
  PartnerAuditRecord,
  PlatformFeeConfig,
} from '../types/admin';

const mockFeeConfig: PlatformFeeConfig = {
  baseFare: 1400,
  perKmFare: 250,
  rainSurchargeEnabled: true,
  rainSurchargeAmount: 450,
  nightRushEnabled: true,
  nightRushAmount: 350,
  platformFairCommissionPercent: 6.5,
  courierRewardsPoolCurrent: 51500,
  courierRewardsPoolMonthlyTarget: 100000,
  courierPoolAllocationPercent: 2,
};

test('calculateOrderPricing computes base distance fare and passes 100% to courier', () => {
  const result = calculateOrderPricing(2.0, 10000, mockFeeConfig, {
    isRainActive: false,
    isNightRush: false,
  });

  // Base: 1400 + (2.0 * 250 = 500) = 1900
  assert.equal(result.customerDeliveryFee.amount, 1900);
  assert.equal(result.courierEarnings.amount, 1900);
  // Platform fair take: 6.5% of 10000 = 650
  assert.equal(result.platformFairTake.amount, 650);
  // Courier pool contribution: 2% of 650 = 13
  assert.equal(result.courierPoolContribution.amount, 13);
});

test('calculateOrderPricing dynamically incorporates rain and night rush surcharges', () => {
  const result = calculateOrderPricing(3.0, 15000, mockFeeConfig, {
    isRainActive: true,
    isNightRush: true,
  });

  // Base: 1400 + (3 * 250 = 750) + rain: 450 + night: 350 = 2950
  assert.equal(result.customerDeliveryFee.amount, 2950);
  assert.equal(result.courierEarnings.amount, 2950);
  assert.equal(result.breakdown.rainSurcharge, 450);
  assert.equal(result.breakdown.nightSurcharge, 350);
});

test('resolveDispute updates dispute status, notes, and assigns refund amount', () => {
  const mockTicket: DisputeTicket = {
    id: 'disp-101',
    orderId: 'ord-1',
    orderNumber: 4821,
    customerName: 'Santiago Rossi',
    merchantName: 'Pizzería Guerrin',
    courierName: 'Marcos Benítez',
    reportedBy: 'customer',
    category: 'DAMAGED_COLD_FOOD',
    title: 'La pizza llegó dada vuelta y fría',
    description: 'El cadete frenó brusco y la muzza quedó pegada a la tapa',
    amount: { amount: 8500, currency: 'ARS' },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: '2026-10-22T14:30:00Z',
  };

  const resolved = resolveDispute(mockTicket, 'REFUND', 'Reembolso total acordado con cliente', 8500);

  assert.equal(resolved.status, 'REFUNDED');
  assert.equal(resolved.actionTaken, 'REFUND');
  assert.equal(resolved.refundAmount?.amount, 8500);
  assert.equal(resolved.resolutionNotes, 'Reembolso total acordado con cliente');
  assert.ok(resolved.resolvedAt);
});

test('filterDisputes filters by status, priority, and search keyword', () => {
  const sampleTickets: DisputeTicket[] = [
    {
      id: 'disp-1',
      orderId: 'ord-1',
      orderNumber: 1001,
      customerName: 'Lucía Méndez',
      merchantName: 'Burger Joint',
      reportedBy: 'customer',
      category: 'DELAY',
      title: 'Demora excesiva',
      description: 'Más de 50 minutos esperando',
      amount: { amount: 5200, currency: 'ARS' },
      status: 'PENDING',
      priority: 'HIGH',
      createdAt: '2026-10-22T12:00:00Z',
    },
    {
      id: 'disp-2',
      orderId: 'ord-2',
      orderNumber: 1002,
      customerName: 'Carlos Gómez',
      merchantName: 'Sushi Club',
      reportedBy: 'merchant',
      category: 'COURIER_BREAKDOWN',
      title: 'Cadete con pinchadura',
      description: 'Quedó varado en Av. Santa Fe',
      amount: { amount: 14000, currency: 'ARS' },
      status: 'INVESTIGATING',
      priority: 'HIGH',
      createdAt: '2026-10-22T13:00:00Z',
    },
    {
      id: 'disp-3',
      orderId: 'ord-3',
      orderNumber: 1003,
      customerName: 'Ana Belén',
      merchantName: 'Empanadas El Noble',
      reportedBy: 'customer',
      category: 'WRONG_ITEMS',
      title: 'Faltaron 2 empanadas',
      description: 'Pedí 12 y llegaron 10',
      amount: { amount: 3200, currency: 'ARS' },
      status: 'REFUNDED',
      priority: 'LOW',
      createdAt: '2026-10-22T11:00:00Z',
    },
  ];

  // Filter by status PENDING
  const pendingOnly = filterDisputes(sampleTickets, { status: 'PENDING' });
  assert.equal(pendingOnly.length, 1);
  assert.equal(pendingOnly[0].id, 'disp-1');

  // Filter by query "Santa Fe" or "Carlos"
  const searchResult = filterDisputes(sampleTickets, { query: 'Carlos' });
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].orderNumber, 1002);

  // Filter by priority LOW
  const lowPriority = filterDisputes(sampleTickets, { priority: 'LOW' });
  assert.equal(lowPriority.length, 1);
  assert.equal(lowPriority[0].id, 'disp-3');
});

test('updatePartnerStatus and filterPartners manage compliance audit pipeline', () => {
  const partner: PartnerAuditRecord = {
    id: 'partner-1',
    name: 'La Continental Pizzería',
    type: 'MERCHANT',
    categoryOrVehicle: 'Pizzería y Pastas',
    contactEmail: 'gerencia@continental.com.ar',
    contactPhone: '+54 11 4567-8901',
    zone: 'Palermo Soho',
    cuitOrDni: '30-71234567-9',
    verificationStatus: 'PENDING_REVIEW',
    registeredAt: '2026-10-20T10:00:00Z',
    documents: [],
  };

  const approved = updatePartnerStatus(partner, 'VERIFIED');
  assert.equal(approved.verificationStatus, 'VERIFIED');
  assert.equal(approved.rejectionReason, undefined);

  const suspended = updatePartnerStatus(partner, 'SUSPENDED', 'Falta habilitación bromatológica vigente');
  assert.equal(suspended.verificationStatus, 'SUSPENDED');
  assert.equal(suspended.rejectionReason, 'Falta habilitación bromatológica vigente');

  const list: PartnerAuditRecord[] = [
    approved,
    {
      ...partner,
      id: 'cadete-1',
      name: 'Matías Valdez',
      type: 'COURIER',
      categoryOrVehicle: 'Moto Honda Wave 110cc',
      cuitOrDni: '20-41882991-3',
      verificationStatus: 'PENDING_REVIEW',
    },
  ];

  // Filter by type COURIER
  const couriers = filterPartners(list, { type: 'COURIER' });
  assert.equal(couriers.length, 1);
  assert.equal(couriers[0].name, 'Matías Valdez');

  // Filter by status PENDING_REVIEW
  const pending = filterPartners(list, { status: 'PENDING_REVIEW' });
  assert.equal(pending.length, 1);
  assert.equal(pending[0].id, 'cadete-1');
});

test('calculatePoolDistribution divides monthly courier pot across tiers', () => {
  const pool = 100000;
  const dist = calculatePoolDistribution(pool, { gold: 0.5, silver: 0.3, bronze: 0.2 }, { gold: 2, silver: 5, bronze: 10 });

  assert.equal(dist.goldTierTotal, 50000);
  assert.equal(dist.silverTierTotal, 30000);
  assert.equal(dist.bronzeTierTotal, 20000);
  assert.equal(dist.perGoldCadete, 25000);
  assert.equal(dist.perSilverCadete, 6000);
  assert.equal(dist.perBronzeCadete, 2000);
});

test('calculateMarketplaceHealth derives GMV and on-time rate accurately', () => {
  const health = calculateMarketplaceHealth(
    { total: 50, onTime: 48, delayed: 2, totalAmount: 450000, commissionPercent: 6.5 },
    { inTransit: 14, available: 8 },
    { open: 22, total: 25 },
    3,
    2,
    true
  );

  assert.equal(health.dailyGmv.amount, 450000);
  assert.equal(health.onTimeDeliveryRate, 96.0);
  assert.equal(health.platformRevenue.amount, 29250);
  assert.equal(health.activeOrdersInTransit, 14);
  assert.equal(health.pendingDisputesCount, 3);
  assert.equal(health.rainSurchargeActive, true);
});

test('getDisputeBadge and getPartnerStatusBadge return accessible labels and styling', () => {
  const dBadge = getDisputeBadge('PENDING');
  assert.equal(dBadge.label, 'Pendiente');
  assert.ok(dBadge.bgClass.includes('amber'));

  const pBadge = getPartnerStatusBadge('VERIFIED');
  assert.equal(pBadge.label, 'Verificado y Aprobado');
  assert.ok(pBadge.bgClass.includes('emerald'));
});
