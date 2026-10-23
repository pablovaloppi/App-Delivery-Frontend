/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DisputeTicket,
  MarketplaceMetrics,
  PartnerAuditRecord,
  PlatformFeeConfig,
  ZoneDeliveryStats,
  PartnerVerificationStatus,
} from '../../types/admin';
import {
  calculateMarketplaceHealth,
  resolveDispute as pureResolveDispute,
  updatePartnerStatus as pureUpdatePartnerStatus,
} from '../../utils/adminLogic';

// Initial Mock Data Store
let inMemoryFeeConfig: PlatformFeeConfig = {
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

let inMemoryDisputes: DisputeTicket[] = [
  {
    id: 'disp-4821',
    orderId: 'ord-4821',
    orderNumber: 4821,
    customerName: 'Santiago Rossi',
    merchantName: 'Pizzería Guerrin',
    courierName: 'Marcos Benítez',
    reportedBy: 'customer',
    category: 'DAMAGED_COLD_FOOD',
    title: 'Pizza llegó fría y aplastada contra la tapa',
    description:
      'El pedido tardó 20 min más de lo estimado y la pizza llegó desarmada. El cadete indicó frenada brusca por el pavimento mojado.',
    amount: { amount: 8500, currency: 'ARS' },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'disp-4809',
    orderId: 'ord-4809',
    orderNumber: 4809,
    customerName: 'Gastón Navarro',
    merchantName: 'Burger Joint Soho',
    courierName: 'Leandro Paredes',
    reportedBy: 'courier',
    category: 'COURIER_BREAKDOWN',
    title: 'Pinchadura de neumático en Av. Scalabrini Ortiz',
    description:
      'El cadete sufrió una pinchadura a 6 cuadras del destino. El pedido está intacto en la mochila térmica pero requiere auxilio/reasignación inmediata.',
    amount: { amount: 6200, currency: 'ARS' },
    status: 'INVESTIGATING',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'disp-4792',
    orderId: 'ord-4792',
    orderNumber: 4792,
    customerName: 'Camila Larreta',
    merchantName: 'Sushi Club Recoleta',
    courierName: 'Nicolás Taglia',
    reportedBy: 'merchant',
    category: 'WRONG_ADDRESS',
    title: 'Cliente no responde portería ni teléfono',
    description:
      'El cadete lleva 12 minutos esperando en la puerta del edificio (Juncal 1820). No atienden timbre 4B.',
    amount: { amount: 14500, currency: 'ARS' },
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: 'disp-4780',
    orderId: 'ord-4780',
    orderNumber: 4780,
    customerName: 'Florencia Varela',
    merchantName: 'Empanadas El Noble',
    courierName: 'Rodrigo De Paul',
    reportedBy: 'customer',
    category: 'WRONG_ITEMS',
    title: 'Faltaron 2 empanadas de carne cortada a cuchillo',
    description:
      'El paquete venía con el sello roto y solo contenía 10 unidades de las 12 abonadas en comanda.',
    amount: { amount: 3400, currency: 'ARS' },
    status: 'REFUNDED',
    priority: 'LOW',
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    actionTaken: 'REFUND',
    resolutionNotes: 'Reembolso parcial directo de $3.400 ARS acreditado en cuenta del cliente.',
    resolvedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    refundAmount: { amount: 3400, currency: 'ARS' },
  },
  {
    id: 'disp-4765',
    orderId: 'ord-4765',
    orderNumber: 4765,
    customerName: 'Lucas Méndez',
    merchantName: 'Tacos Palermo',
    courierName: 'Ángel Correa',
    reportedBy: 'customer',
    category: 'DELAY',
    title: 'Demora de 55 minutos por tormenta',
    description:
      'Llegó con retraso considerable. Se acordó cupón de compensación y propina solidaria al cadete por clima adverso.',
    amount: { amount: 7800, currency: 'ARS' },
    status: 'COMPENSATED',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    actionTaken: 'COMPENSATE',
    resolutionNotes: 'Bono compensatorio de $2.000 ARS al cadete y crédito al cliente.',
    resolvedAt: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
  },
];

let inMemoryPartners: PartnerAuditRecord[] = [
  {
    id: 'part-napoles',
    name: 'Pizzería Nápoles & Pastas',
    type: 'MERCHANT',
    categoryOrVehicle: 'Pizzería y Pastas Artesanales',
    contactEmail: 'contacto@pizzerianapoles.com.ar',
    contactPhone: '+54 11 4771-3320',
    zone: 'Palermo Hollywood',
    cuitOrDni: '30-71882991-4',
    verificationStatus: 'PENDING_REVIEW',
    registeredAt: '2026-10-21T11:20:00Z',
    rating: 4.8,
    totalCompletedOrders: 0,
    documents: [
      {
        id: 'doc-brom-1',
        name: 'Habilitación Bromatológica CABA',
        type: 'BROMATOLOGY',
        status: 'PENDING',
        submittedAt: '2026-10-21T11:25:00Z',
        documentNumber: 'HAB-BROM-2026-8812',
        issuer: 'Dirección General de Higiene y Seguridad Alimentaria (DGHYSA)',
      },
      {
        id: 'doc-cuit-1',
        name: 'Constancia de CUIT AFIP / ARCA',
        type: 'CUIT',
        status: 'VERIFIED',
        submittedAt: '2026-10-21T11:22:00Z',
        documentNumber: '30-71882991-4',
        issuer: 'AFIP / ARCA',
      },
    ],
  },
  {
    id: 'part-matias',
    name: 'Matías Ezequiel Benítez',
    type: 'COURIER',
    categoryOrVehicle: 'Moto Honda Titan 150cc (A3)',
    contactEmail: 'matias.benitez96@gmail.com',
    contactPhone: '+54 11 3829-1102',
    zone: 'Recoleta y Balvanera',
    cuitOrDni: '20-39481920-8',
    verificationStatus: 'PENDING_REVIEW',
    registeredAt: '2026-10-21T14:40:00Z',
    rating: 5.0,
    totalCompletedOrders: 4,
    documents: [
      {
        id: 'doc-dni-1',
        name: 'DNI Frente y Dorso',
        type: 'DNI',
        status: 'VERIFIED',
        submittedAt: '2026-10-21T14:42:00Z',
        documentNumber: '39.481.920',
        issuer: 'RENAPER',
      },
      {
        id: 'doc-ins-1',
        name: 'Seguro de Accidentes Personales y Responsabilidad Civil',
        type: 'INSURANCE',
        status: 'PENDING',
        submittedAt: '2026-10-21T14:45:00Z',
        documentNumber: 'POL-AP-992140',
        issuer: 'La Segunda Seguros',
      },
      {
        id: 'doc-veh-1',
        name: 'Cédula de Identificación de Moto',
        type: 'VEHICLE_REGISTRATION',
        status: 'VERIFIED',
        submittedAt: '2026-10-21T14:43:00Z',
        documentNumber: 'A182KLP',
        issuer: 'DNRPA',
      },
      {
        id: 'doc-crim-1',
        name: 'Certificado de Antecedentes Penales',
        type: 'CRIMINAL_RECORD',
        status: 'VERIFIED',
        submittedAt: '2026-10-21T14:44:00Z',
        documentNumber: 'RNR-882190-2026',
        issuer: 'Ministerio de Justicia de la Nación',
      },
    ],
  },
  {
    id: 'part-scannapieco',
    name: 'Heladería Scannapieco',
    type: 'MERCHANT',
    categoryOrVehicle: 'Helados Artesanales & Postres',
    contactEmail: 'pedidos@scannapieco.com.ar',
    contactPhone: '+54 11 4552-3001',
    zone: 'Colegiales',
    cuitOrDni: '30-65239102-1',
    verificationStatus: 'VERIFIED',
    registeredAt: '2026-09-15T09:00:00Z',
    rating: 4.9,
    totalCompletedOrders: 1420,
    documents: [
      {
        id: 'doc-scan-1',
        name: 'Habilitación Bromatológica Vigente',
        type: 'BROMATOLOGY',
        status: 'VERIFIED',
        submittedAt: '2026-09-15T09:10:00Z',
        documentNumber: 'HAB-BROM-COL-4019',
        issuer: 'DGHYSA CABA',
      },
    ],
  },
  {
    id: 'part-sofia',
    name: 'Sofía Albarracín',
    type: 'COURIER',
    categoryOrVehicle: 'Bicicleta Eléctrica Rodado 28',
    contactEmail: 'sofia.albarracin@outlook.com',
    contactPhone: '+54 11 4190-8822',
    zone: 'Palermo Soho & Botanico',
    cuitOrDni: '27-42190822-6',
    verificationStatus: 'VERIFIED',
    registeredAt: '2026-09-20T10:30:00Z',
    rating: 4.95,
    totalCompletedOrders: 382,
    documents: [
      {
        id: 'doc-sof-1',
        name: 'DNI y Seguro Bici Urbana',
        type: 'DNI',
        status: 'VERIFIED',
        submittedAt: '2026-09-20T10:35:00Z',
        documentNumber: '42.190.822',
        issuer: 'RENAPER',
      },
    ],
  },
  {
    id: 'part-wok',
    name: 'Wok Express Gourmet',
    type: 'MERCHANT',
    categoryOrVehicle: 'Comida Asiática y Bowls',
    contactEmail: 'wokexpress.caba@gmail.com',
    contactPhone: '+54 11 4782-9910',
    zone: 'Belgrano',
    cuitOrDni: '33-89218201-9',
    verificationStatus: 'SUSPENDED',
    rejectionReason:
      'Habilitación bromatológica vencida el 15/10/2026. Suspensión preventiva hasta presentar certificado renovado emitido por DGHYSA.',
    registeredAt: '2026-08-10T12:00:00Z',
    rating: 4.2,
    totalCompletedOrders: 110,
    documents: [
      {
        id: 'doc-wok-1',
        name: 'Habilitación Bromatológica (Vencida)',
        type: 'BROMATOLOGY',
        status: 'REJECTED',
        submittedAt: '2026-08-10T12:05:00Z',
        documentNumber: 'HAB-BROM-2025-1102',
        issuer: 'DGHYSA',
      },
    ],
  },
];

const zoneStatsData: ZoneDeliveryStats[] = [
  {
    zoneName: 'Palermo Soho & Hollywood',
    activeOrders: 18,
    availableCouriers: 8,
    avgEtaMinutes: 22,
    demandLevel: 'SURGE',
  },
  {
    zoneName: 'Belgrano & Cañitas',
    activeOrders: 14,
    availableCouriers: 6,
    avgEtaMinutes: 25,
    demandLevel: 'HIGH',
  },
  {
    zoneName: 'Recoleta & Retiro',
    activeOrders: 11,
    availableCouriers: 5,
    avgEtaMinutes: 24,
    demandLevel: 'NORMAL',
  },
  {
    zoneName: 'Villa Crespo & Caballito',
    activeOrders: 5,
    availableCouriers: 4,
    avgEtaMinutes: 30,
    demandLevel: 'NORMAL',
  },
];

export const adminService = {
  async getMetrics(): Promise<MarketplaceMetrics> {
    const pendingDisputes = inMemoryDisputes.filter((d) => d.status === 'PENDING').length;
    const pendingAudits = inMemoryPartners.filter(
      (p) => p.verificationStatus === 'PENDING_REVIEW'
    ).length;

    return calculateMarketplaceHealth(
      {
        total: 48,
        onTime: 46,
        delayed: 2,
        totalAmount: 384500,
        commissionPercent: inMemoryFeeConfig.platformFairCommissionPercent,
      },
      { inTransit: 14, available: 9 },
      { open: 24, total: 28 },
      pendingDisputes,
      pendingAudits,
      inMemoryFeeConfig.rainSurchargeEnabled
    );
  },

  async getZoneStats(): Promise<ZoneDeliveryStats[]> {
    return [...zoneStatsData];
  },

  async getDisputes(): Promise<DisputeTicket[]> {
    return [...inMemoryDisputes];
  },

  async resolveDispute(
    id: string,
    action: 'REFUND' | 'REASSIGN' | 'COMPENSATE' | 'DISMISS',
    notes: string,
    customRefundAmount?: number
  ): Promise<DisputeTicket> {
    const index = inMemoryDisputes.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Dispute ticket ${id} not found`);
    }

    const updated = pureResolveDispute(
      inMemoryDisputes[index],
      action,
      notes,
      customRefundAmount
    );
    inMemoryDisputes[index] = updated;
    return updated;
  },

  async getPartners(): Promise<PartnerAuditRecord[]> {
    return [...inMemoryPartners];
  },

  async updatePartnerStatus(
    id: string,
    newStatus: PartnerVerificationStatus,
    reason?: string
  ): Promise<PartnerAuditRecord> {
    const index = inMemoryPartners.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Partner ${id} not found`);
    }

    const updated = pureUpdatePartnerStatus(inMemoryPartners[index], newStatus, reason);
    inMemoryPartners[index] = updated;
    return updated;
  },

  async verifyPartnerDocument(
    partnerId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED'
  ): Promise<PartnerAuditRecord> {
    const pIndex = inMemoryPartners.findIndex((p) => p.id === partnerId);
    if (pIndex === -1) throw new Error('Partner not found');

    const partner = inMemoryPartners[pIndex];
    const docIndex = partner.documents.findIndex((d) => d.id === docId);
    if (docIndex === -1) throw new Error('Document not found');

    partner.documents[docIndex].status = status;

    // Check if all docs are verified
    const allVerified = partner.documents.every((d) => d.status === 'VERIFIED');
    if (allVerified && partner.verificationStatus === 'PENDING_REVIEW') {
      partner.verificationStatus = 'VERIFIED';
    }

    return { ...partner };
  },

  async getFeeConfig(): Promise<PlatformFeeConfig> {
    return { ...inMemoryFeeConfig };
  },

  async updateFeeConfig(newConfig: Partial<PlatformFeeConfig>): Promise<PlatformFeeConfig> {
    inMemoryFeeConfig = {
      ...inMemoryFeeConfig,
      ...newConfig,
    };
    return { ...inMemoryFeeConfig };
  },

  async toggleRainSurcharge(active: boolean): Promise<boolean> {
    inMemoryFeeConfig.rainSurchargeEnabled = active;
    return inMemoryFeeConfig.rainSurchargeEnabled;
  },
};
