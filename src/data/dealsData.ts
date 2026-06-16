// ============================================================
// KnownBrands — Deals = Lotes comprados + Sub-lotes vendidos
// Tipos prontos para futura ligação a backend (Supabase).
// ============================================================

export type DeliveryStatus =
  | 'COLLECTED BY CLIENT'
  | 'DIRECT DELIVERY TO CLIENT'
  | 'DELIVERED TO LOGISTIC > STOCK'
  | 'IN TRANSIT - DIRECT DELIVERY TO CLIENT'
  | 'IN TRANSIT - TO LOGISTIC / BONDED'
  | 'RELEASED - WAITING COLLECTION BY BUYER'
  | 'RELEASE UNDER BOND - TO BUYER (TRASPASSO)'
  | 'RELEASE UNDER BOND - FROM SUPPLIER'
  | 'RESERVED TO CUSTOMER'
  | 'WAITING COLLECTION'
  | 'WAITING RELEASE'
  | 'STOLEN GOODS - PAID BY LOGISTIC/INSURANCE'
  | 'CANCELED';

export type DealStatus = 'Perspective' | 'Ongoing' | 'Concluded' | 'Unpaid' | 'Canceled';

export interface PaymentInfo {
  paid: number;
  pending: number;
  date?: string;
  mode?: string; // SEPA, SWIFT, CONFIRMING, etc.
  bank?: string;
}

export interface TransportInfo {
  transporter?: string;
  plate?: string;
  cmr?: string;
  cost: number;
  paid: number;
  pending: number;
}

export interface LogisticsInfo {
  issuer?: string; // BCN Bonded, Loendersloot, TCC...
  otherCosts: number;
  paid: number;
  pending: number;
}

export interface SubLot {
  subLotNumber: string; // "KB26-004-01"
  flavour?: string;
  casesSold: number;
  pallets: number;

  customerCode?: string;
  customer: string;
  countryOfCustomer: string;
  deliveryPlace?: string;
  countryOfDelivery: string;

  invoiceRef?: string;
  sellPricePerCase: number;
  totalSell: number;

  deposit: number;
  balance: number;
  pendingSale: number;

  paymentByClient?: { date?: string; mode?: string; bank?: string };

  marginToReceive: number; // venda feita, ainda não cobrada
  marginReceived: number;  // efetivamente cobrada

  transport: TransportInfo;
  logistics: LogisticsInfo;

  deliveryStatus: DeliveryStatus;
  dealStatus: DealStatus; // calculado a partir de deliveryStatus + pendingSale

  arrivalDate?: string;
  exitDate?: string;

  notes?: string;
}

export interface Lot {
  lotNumber: string;       // "KB26-004"
  month: string;           // "JAN"
  product: string;         // "Monster IT 24x mixed flavours"
  size: string;            // "500ml can"
  supplier: string;
  countryOfSupplier: string;
  countryOfStock: string;  // onde está fisicamente
  warehouse: string;       // BCN Bonded / TCC / Loendersloot

  proforma?: string;
  finalInvoice?: string;

  totalCasesBought: number;
  totalPallets: number;
  buyPricePerCase: number;
  finalBuyPrice: number;
  purchaseAmount: number;

  paymentToSupplier: PaymentInfo;

  bbd?: string; // Best Before Date

  subLots: SubLot[];
}

// ============================================================
// Cálculo de dealStatus a partir do deliveryStatus + pendingSale
// ============================================================
const ONGOING_STATES: DeliveryStatus[] = [
  'WAITING COLLECTION',
  'WAITING RELEASE',
  'IN TRANSIT - DIRECT DELIVERY TO CLIENT',
  'IN TRANSIT - TO LOGISTIC / BONDED',
  'DELIVERED TO LOGISTIC > STOCK',
  'RELEASED - WAITING COLLECTION BY BUYER',
  'RELEASE UNDER BOND - TO BUYER (TRASPASSO)',
  'RELEASE UNDER BOND - FROM SUPPLIER',
  'RESERVED TO CUSTOMER',
];

const DELIVERED_STATES: DeliveryStatus[] = [
  'COLLECTED BY CLIENT',
  'DIRECT DELIVERY TO CLIENT',
  'STOLEN GOODS - PAID BY LOGISTIC/INSURANCE',
];

export function computeDealStatus(s: Pick<SubLot, 'deliveryStatus' | 'pendingSale' | 'casesSold'>): DealStatus {
  if (s.deliveryStatus === 'CANCELED') return 'Canceled';
  if (DELIVERED_STATES.includes(s.deliveryStatus)) {
    return s.pendingSale > 0 ? 'Unpaid' : 'Concluded';
  }
  if (ONGOING_STATES.includes(s.deliveryStatus)) return 'Ongoing';
  return 'Perspective';
}

// ============================================================
// Agregados por lote-pai
// ============================================================
export interface LotMetrics {
  casesSoldTotal: number;
  casesRemaining: number;
  pctSold: number;
  revenueRealized: number;
  marginRealized: number;
  marginPending: number;
  marginPct: number;
  subLotsActive: number;
  subLotsByStatus: Record<DealStatus, number>;
}

export function computeLotMetrics(lot: Lot): LotMetrics {
  const active = lot.subLots.filter((s) => s.dealStatus !== 'Canceled');
  const casesSoldTotal = active.reduce((a, s) => a + s.casesSold, 0);
  const casesRemaining = Math.max(0, lot.totalCasesBought - casesSoldTotal);
  const revenueRealized = active.reduce((a, s) => a + s.totalSell, 0);
  const marginRealized = active.reduce((a, s) => a + s.marginReceived, 0);
  const marginPending = active.reduce(
    (a, s) => a + Math.max(0, s.marginToReceive - s.marginReceived),
    0
  );
  const marginPct = revenueRealized > 0 ? marginRealized / revenueRealized : 0;

  const subLotsByStatus: Record<DealStatus, number> = {
    Perspective: 0,
    Ongoing: 0,
    Concluded: 0,
    Unpaid: 0,
    Canceled: 0,
  };
  lot.subLots.forEach((s) => {
    subLotsByStatus[s.dealStatus] = (subLotsByStatus[s.dealStatus] ?? 0) + 1;
  });

  return {
    casesSoldTotal,
    casesRemaining,
    pctSold: lot.totalCasesBought > 0 ? casesSoldTotal / lot.totalCasesBought : 0,
    revenueRealized,
    marginRealized,
    marginPending,
    marginPct,
    subLotsActive: active.length,
    subLotsByStatus,
  };
}

// ============================================================
// UI helpers — cores dos badges (Excel-coherent)
// ============================================================
export const DEAL_STATUS_BADGE: Record<DealStatus, string> = {
  Concluded: 'bg-success/15 text-success border-success/30',
  Unpaid: 'bg-destructive/15 text-destructive border-destructive/30',
  Ongoing: 'bg-warning/15 text-warning border-warning/30',
  Perspective: 'bg-muted text-muted-foreground border-border',
  Canceled: 'bg-muted/50 text-muted-foreground line-through border-border',
};

export const DEAL_STATUS_LABEL: Record<DealStatus, string> = {
  Concluded: 'Concluded',
  Unpaid: 'Unpaid',
  Ongoing: 'Ongoing',
  Perspective: 'Perspective',
  Canceled: 'Canceled',
};

// ============================================================
// SEED — dados reais (lotes KB26-NNN)
// ============================================================
const mk = (raw: Omit<SubLot, 'dealStatus'>): SubLot => ({
  ...raw,
  dealStatus: computeDealStatus(raw),
});

export const LOTS: Lot[] = [
  {
    lotNumber: 'KB26-001',
    month: 'JAN',
    product: 'Evian Still Water 12x1L',
    size: '1L PET',
    supplier: 'ALPHA SOLUTIONS',
    countryOfSupplier: 'Monaco',
    countryOfStock: 'France',
    warehouse: 'Loendersloot',
    proforma: 'PRO-2026-001',
    finalInvoice: 'INV-AS-26001',
    totalCasesBought: 2640,
    totalPallets: 24,
    buyPricePerCase: 4.85,
    finalBuyPrice: 4.85,
    purchaseAmount: 12804,
    paymentToSupplier: { paid: 12804, pending: 0, date: '2026-01-12', mode: 'SWIFT', bank: 'Millennium BCP' },
    bbd: '2027-08-30',
    subLots: [
      mk({
        subLotNumber: 'KB26-001-01', flavour: 'Still', casesSold: 1320, pallets: 12,
        customerCode: 'C-ES-014', customer: 'PROAMFAMILY 2017 SL',
        countryOfCustomer: 'ES', deliveryPlace: 'Barcelona', countryOfDelivery: 'ES',
        invoiceRef: 'KB-INV-26-014', sellPricePerCase: 5.20, totalSell: 6864,
        deposit: 6864, balance: 0, pendingSale: 0,
        paymentByClient: { date: '2026-01-22', mode: 'SEPA', bank: 'Bankinter ES' },
        marginToReceive: 462, marginReceived: 462,
        transport: { transporter: 'TransIberica', plate: '5421-HGS', cmr: 'CMR-1102', cost: 380, paid: 380, pending: 0 },
        logistics: { issuer: 'Loendersloot', otherCosts: 95, paid: 95, pending: 0 },
        deliveryStatus: 'DIRECT DELIVERY TO CLIENT',
        arrivalDate: '2026-01-18', exitDate: '2026-01-20',
      }),
      mk({
        subLotNumber: 'KB26-001-02', flavour: 'Still', casesSold: 880, pallets: 8,
        customerCode: 'C-FR-007', customer: 'SAS Futura Finances',
        countryOfCustomer: 'FR', deliveryPlace: 'Lyon', countryOfDelivery: 'FR',
        invoiceRef: 'KB-INV-26-019', sellPricePerCase: 5.35, totalSell: 4708,
        deposit: 0, balance: 4708, pendingSale: 4708,
        marginToReceive: 396, marginReceived: 0,
        transport: { transporter: 'EuroFret', plate: 'AG-441-PL', cmr: 'CMR-1118', cost: 290, paid: 0, pending: 290 },
        logistics: { issuer: 'Loendersloot', otherCosts: 60, paid: 60, pending: 0 },
        deliveryStatus: 'COLLECTED BY CLIENT',
        arrivalDate: '2026-01-18', exitDate: '2026-01-29',
      }),
      mk({
        subLotNumber: 'KB26-001-03', casesSold: 440, pallets: 4,
        customer: '(por vender)', countryOfCustomer: '-', countryOfDelivery: '-',
        sellPricePerCase: 5.30, totalSell: 0,
        deposit: 0, balance: 0, pendingSale: 0,
        marginToReceive: 0, marginReceived: 0,
        transport: { cost: 0, paid: 0, pending: 0 },
        logistics: { issuer: 'Loendersloot', otherCosts: 0, paid: 0, pending: 0 },
        deliveryStatus: 'RESERVED TO CUSTOMER',
      }),
    ],
  },
  {
    lotNumber: 'KB26-004',
    month: 'JAN',
    product: 'Monster IT 24x mixed flavours',
    size: '500ml can',
    supplier: 'FAMOBRA GMBH',
    countryOfSupplier: 'DE',
    countryOfStock: 'Italy',
    warehouse: 'BCN Bonded',
    proforma: 'PRO-2026-004',
    finalInvoice: 'INV-FAM-26004',
    totalCasesBought: 3360,
    totalPallets: 28,
    buyPricePerCase: 12.40,
    finalBuyPrice: 12.55,
    purchaseAmount: 42168,
    paymentToSupplier: { paid: 42168, pending: 0, date: '2026-01-25', mode: 'CONFIRMING', bank: 'Bankinter PT' },
    bbd: '2026-12-15',
    subLots: [
      mk({
        subLotNumber: 'KB26-004-01', flavour: 'ULTRA WHITE ZERO', casesSold: 960, pallets: 8,
        customerCode: 'C-ES-021', customer: 'BODEGA EXPRESS 2020 SL',
        countryOfCustomer: 'ES', deliveryPlace: 'Madrid', countryOfDelivery: 'ES',
        invoiceRef: 'KB-INV-26-031', sellPricePerCase: 13.20, totalSell: 12672,
        deposit: 12672, balance: 0, pendingSale: 0,
        paymentByClient: { date: '2026-02-04', mode: 'SEPA', bank: 'BBVA España' },
        marginToReceive: 624, marginReceived: 624,
        transport: { transporter: 'TransIberica', plate: '4920-KLM', cmr: 'CMR-1141', cost: 540, paid: 540, pending: 0 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 140, paid: 140, pending: 0 },
        deliveryStatus: 'COLLECTED BY CLIENT',
        arrivalDate: '2026-01-30', exitDate: '2026-02-02',
      }),
      mk({
        subLotNumber: 'KB26-004-02', flavour: 'MANGO LOCO', casesSold: 720, pallets: 6,
        customerCode: 'C-BE-003', customer: 'BVBA HSF GROUP',
        countryOfCustomer: 'BE', deliveryPlace: 'Antwerp', countryOfDelivery: 'BE',
        invoiceRef: 'KB-INV-26-040', sellPricePerCase: 13.05, totalSell: 9396,
        deposit: 0, balance: 9396, pendingSale: 9396,
        marginToReceive: 360, marginReceived: 0,
        transport: { transporter: 'EuroFret', plate: '1-AKR-882', cmr: 'CMR-1156', cost: 720, paid: 360, pending: 360 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 120, paid: 120, pending: 0 },
        deliveryStatus: 'DIRECT DELIVERY TO CLIENT',
        arrivalDate: '2026-01-30', exitDate: '2026-02-10',
      }),
      mk({
        subLotNumber: 'KB26-004-03', flavour: 'ORIGINAL GREEN', casesSold: 600, pallets: 5,
        customerCode: 'C-DE-008', customer: 'ND North Distribution GmbH',
        countryOfCustomer: 'DE', deliveryPlace: 'Hamburg', countryOfDelivery: 'DE',
        invoiceRef: 'KB-INV-26-052', sellPricePerCase: 13.10, totalSell: 7860,
        deposit: 1500, balance: 6360, pendingSale: 6360,
        marginToReceive: 330, marginReceived: 70,
        transport: { transporter: 'EuroFret', cost: 610, paid: 305, pending: 305 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 110, paid: 0, pending: 110 },
        deliveryStatus: 'IN TRANSIT - DIRECT DELIVERY TO CLIENT',
        arrivalDate: '2026-01-30',
      }),
      mk({
        subLotNumber: 'KB26-004-04', flavour: 'PIPELINE PUNCH', casesSold: 480, pallets: 4,
        customerCode: 'C-ES-002', customer: 'UNIVERSAL COMPRAS SL',
        countryOfCustomer: 'ES', deliveryPlace: 'Valencia', countryOfDelivery: 'ES',
        invoiceRef: 'KB-INV-26-061', sellPricePerCase: 13.00, totalSell: 6240,
        deposit: 0, balance: 6240, pendingSale: 6240,
        marginToReceive: 216, marginReceived: 0,
        transport: { cost: 320, paid: 0, pending: 320 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 90, paid: 90, pending: 0 },
        deliveryStatus: 'RELEASED - WAITING COLLECTION BY BUYER',
        arrivalDate: '2026-01-30',
      }),
      mk({
        subLotNumber: 'KB26-004-05', casesSold: 600, pallets: 5,
        customer: '(por vender)', countryOfCustomer: '-', countryOfDelivery: '-',
        sellPricePerCase: 13.00, totalSell: 0,
        deposit: 0, balance: 0, pendingSale: 0,
        marginToReceive: 0, marginReceived: 0,
        transport: { cost: 0, paid: 0, pending: 0 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 0, paid: 0, pending: 0 },
        deliveryStatus: 'DELIVERED TO LOGISTIC > STOCK',
        arrivalDate: '2026-01-30',
      }),
    ],
  },
  {
    lotNumber: 'KB26-007',
    month: 'FEB',
    product: 'Coca-Cola Original 24x33cl',
    size: '330ml can',
    supplier: 'BEBIDAS INTERNATIONAL',
    countryOfSupplier: 'ES',
    countryOfStock: 'Spain',
    warehouse: 'BCN Bonded',
    proforma: 'PRO-2026-007',
    finalInvoice: 'INV-BI-26007',
    totalCasesBought: 2400,
    totalPallets: 20,
    buyPricePerCase: 9.20,
    finalBuyPrice: 9.20,
    purchaseAmount: 22080,
    paymentToSupplier: { paid: 11040, pending: 11040, date: '2026-02-08', mode: 'SWIFT', bank: 'Millennium BCP' },
    bbd: '2026-11-30',
    subLots: [
      mk({
        subLotNumber: 'KB26-007-01', casesSold: 1200, pallets: 10,
        customerCode: 'C-UK-001', customer: 'TCC Consulting',
        countryOfCustomer: 'UK', deliveryPlace: 'London', countryOfDelivery: 'UK',
        invoiceRef: 'KB-INV-26-070', sellPricePerCase: 9.95, totalSell: 11940,
        deposit: 0, balance: 11940, pendingSale: 11940,
        marginToReceive: 720, marginReceived: 0,
        transport: { transporter: 'PSA Logistics', cost: 980, paid: 0, pending: 980 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 140, paid: 140, pending: 0 },
        deliveryStatus: 'IN TRANSIT - DIRECT DELIVERY TO CLIENT',
        arrivalDate: '2026-02-14',
      }),
      mk({
        subLotNumber: 'KB26-007-02', casesSold: 600, pallets: 5,
        customerCode: 'C-FR-007', customer: 'SAS Futura Finances',
        countryOfCustomer: 'FR', deliveryPlace: 'Marseille', countryOfDelivery: 'FR',
        invoiceRef: 'KB-INV-26-076', sellPricePerCase: 9.85, totalSell: 5910,
        deposit: 0, balance: 5910, pendingSale: 0,
        paymentByClient: { date: '2026-02-26', mode: 'SEPA', bank: 'Bankinter ES' },
        marginToReceive: 330, marginReceived: 330,
        transport: { transporter: 'EuroFret', cost: 460, paid: 460, pending: 0 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 80, paid: 80, pending: 0 },
        deliveryStatus: 'COLLECTED BY CLIENT',
        arrivalDate: '2026-02-14', exitDate: '2026-02-20',
      }),
      mk({
        subLotNumber: 'KB26-007-03', casesSold: 600, pallets: 5,
        customer: '(por vender)', countryOfCustomer: '-', countryOfDelivery: '-',
        sellPricePerCase: 9.90, totalSell: 0,
        deposit: 0, balance: 0, pendingSale: 0,
        marginToReceive: 0, marginReceived: 0,
        transport: { cost: 0, paid: 0, pending: 0 },
        logistics: { issuer: 'BCN Bonded', otherCosts: 0, paid: 0, pending: 0 },
        deliveryStatus: 'WAITING RELEASE',
        arrivalDate: '2026-02-14',
      }),
    ],
  },
  {
    lotNumber: 'KB26-011',
    month: 'MAR',
    product: 'Red Bull 24x25cl Original',
    size: '250ml can',
    supplier: 'PSA TRADING',
    countryOfSupplier: 'UK',
    countryOfStock: 'Netherlands',
    warehouse: 'Loendersloot',
    proforma: 'PRO-2026-011',
    totalCasesBought: 1920,
    totalPallets: 16,
    buyPricePerCase: 18.40,
    finalBuyPrice: 18.40,
    purchaseAmount: 35328,
    paymentToSupplier: { paid: 0, pending: 35328, mode: 'CONFIRMING', bank: 'Bankinter PT' },
    bbd: '2027-01-10',
    subLots: [
      mk({
        subLotNumber: 'KB26-011-01', casesSold: 960, pallets: 8,
        customerCode: 'C-DE-008', customer: 'ND North Distribution GmbH',
        countryOfCustomer: 'DE', deliveryPlace: 'Berlin', countryOfDelivery: 'DE',
        invoiceRef: 'KB-INV-26-088', sellPricePerCase: 19.10, totalSell: 18336,
        deposit: 4000, balance: 14336, pendingSale: 14336,
        marginToReceive: 480, marginReceived: 110,
        transport: { transporter: 'EuroFret', cost: 680, paid: 0, pending: 680 },
        logistics: { issuer: 'Loendersloot', otherCosts: 130, paid: 130, pending: 0 },
        deliveryStatus: 'IN TRANSIT - TO LOGISTIC / BONDED',
      }),
      mk({
        subLotNumber: 'KB26-011-02', casesSold: 960, pallets: 8,
        customer: '(por alocar)', countryOfCustomer: '-', countryOfDelivery: '-',
        sellPricePerCase: 19.20, totalSell: 0,
        deposit: 0, balance: 0, pendingSale: 0,
        marginToReceive: 0, marginReceived: 0,
        transport: { cost: 0, paid: 0, pending: 0 },
        logistics: { issuer: 'Loendersloot', otherCosts: 0, paid: 0, pending: 0 },
        deliveryStatus: 'WAITING RELEASE',
      }),
    ],
  },
  {
    lotNumber: 'KB26-013',
    month: 'MAR',
    product: 'San Pellegrino 24x33cl Aranciata',
    size: '330ml glass',
    supplier: 'NOSTRA TRADE',
    countryOfSupplier: 'IT',
    countryOfStock: 'Italy',
    warehouse: 'TCC Consulting',
    proforma: 'PRO-2026-013',
    totalCasesBought: 1500,
    totalPallets: 15,
    buyPricePerCase: 11.80,
    finalBuyPrice: 11.80,
    purchaseAmount: 17700,
    paymentToSupplier: { paid: 17700, pending: 0, date: '2026-03-04', mode: 'SEPA', bank: 'Novo Banco' },
    bbd: '2027-05-20',
    subLots: [
      mk({
        subLotNumber: 'KB26-013-01', casesSold: 480, pallets: 4,
        customerCode: 'C-ES-014', customer: 'PROAMFAMILY 2017 SL',
        countryOfCustomer: 'ES', deliveryPlace: 'Barcelona', countryOfDelivery: 'ES',
        invoiceRef: 'KB-INV-26-094', sellPricePerCase: 12.55, totalSell: 6024,
        deposit: 6024, balance: 0, pendingSale: 0,
        paymentByClient: { date: '2026-03-12', mode: 'SEPA', bank: 'Bankinter ES' },
        marginToReceive: 240, marginReceived: 240,
        transport: { transporter: 'TransIberica', cost: 320, paid: 320, pending: 0 },
        logistics: { issuer: 'TCC Consulting', otherCosts: 60, paid: 60, pending: 0 },
        deliveryStatus: 'COLLECTED BY CLIENT',
        arrivalDate: '2026-03-06', exitDate: '2026-03-09',
      }),
      mk({
        subLotNumber: 'KB26-013-02', casesSold: 360, pallets: 3,
        customerCode: 'C-ES-021', customer: 'BODEGA EXPRESS 2020 SL',
        countryOfCustomer: 'ES', deliveryPlace: 'Madrid', countryOfDelivery: 'ES',
        invoiceRef: 'KB-INV-26-099', sellPricePerCase: 12.40, totalSell: 4464,
        deposit: 0, balance: 4464, pendingSale: 0,
        paymentByClient: { date: '2026-03-22', mode: 'SEPA', bank: 'BBVA España' },
        marginToReceive: 144, marginReceived: 144,
        transport: { transporter: 'TransIberica', cost: 260, paid: 260, pending: 0 },
        logistics: { issuer: 'TCC Consulting', otherCosts: 50, paid: 50, pending: 0 },
        deliveryStatus: 'DIRECT DELIVERY TO CLIENT',
        arrivalDate: '2026-03-06', exitDate: '2026-03-15',
      }),
      mk({
        subLotNumber: 'KB26-013-03', casesSold: 200, pallets: 2,
        customer: 'LOUROCHE COMMERCE', countryOfCustomer: 'FR', countryOfDelivery: 'FR',
        sellPricePerCase: 12.30, totalSell: 2460,
        deposit: 0, balance: 2460, pendingSale: 2460,
        marginToReceive: 60, marginReceived: 0,
        transport: { cost: 180, paid: 0, pending: 180 },
        logistics: { issuer: 'TCC Consulting', otherCosts: 40, paid: 0, pending: 40 },
        deliveryStatus: 'CANCELED',
      }),
      mk({
        subLotNumber: 'KB26-013-04', casesSold: 460, pallets: 6,
        customer: '(por vender)', countryOfCustomer: '-', countryOfDelivery: '-',
        sellPricePerCase: 12.40, totalSell: 0,
        deposit: 0, balance: 0, pendingSale: 0,
        marginToReceive: 0, marginReceived: 0,
        transport: { cost: 0, paid: 0, pending: 0 },
        logistics: { issuer: 'TCC Consulting', otherCosts: 0, paid: 0, pending: 0 },
        deliveryStatus: 'DELIVERED TO LOGISTIC > STOCK',
        arrivalDate: '2026-03-06',
      }),
    ],
  },
];

// ============================================================
// Helpers de formatação reutilizáveis
// ============================================================
export const fmtEur = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
export const fmtPct = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'percent', maximumFractionDigits: 1 }).format(n);
export const fmtInt = (n: number) =>
  new Intl.NumberFormat('pt-PT').format(n);