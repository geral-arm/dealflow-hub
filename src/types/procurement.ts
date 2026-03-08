// ========== Procurement Data Types ==========

export type OpportunityStatus = 'nova' | 'em_analise' | 'cotacao_comparacao' | 'aprovada' | 'rejeitada' | 'convertida' | 'expirada' | 'suspensa';
export type SupplierStatus = 'ativo' | 'inativo' | 'em_avaliacao' | 'bloqueado';
export type SupplierClassification = 'estrategico' | 'preferencial' | 'qualificado' | 'em_observacao' | 'bloqueado';
export type POStatus = 'rascunho' | 'em_aprovacao' | 'aprovada' | 'enviada' | 'confirmada' | 'parcialmente_cumprida' | 'cumprida' | 'cancelada';
export type RejectionReason = 'margem_insuficiente' | 'preco_alto' | 'validade_curta' | 'risco_fornecedor' | 'falta_procura' | 'lead_time_longo' | 'doc_incompleta' | 'localizacao_desfavoravel' | 'outro';
export type ProcurementPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface SupplierContact {
  id: string;
  name: string;
  role: 'comercial' | 'financeiro' | 'logistica' | 'documentacao' | 'direcao';
  email: string;
  phone: string;
  language: string;
  notes?: string;
  isPrimary: boolean;
}

export interface Supplier {
  id: string;
  legalName: string;
  tradeName: string;
  vatNumber: string;
  country: string;
  address: string;
  website?: string;
  email: string;
  phone: string;
  defaultCurrency: string;
  defaultIncoterm: string;
  status: SupplierStatus;
  classification: SupplierClassification;
  contacts: SupplierContact[];
  categoriesSupplied: string[];
  brandsSupplied: string[];
  marketsOfOrigin: string[];
  avgMOQ: string;
  avgLeadTime: string;
  paymentTerms: string;
  avgPaymentDays: number;
  requiresAdvancePayment: boolean;
  financialRisk: 'baixo' | 'medio' | 'alto';
  stockLocations: string[];
  scoreGlobal: number;
  scorePrice: number;
  scoreDelivery: number;
  scoreQuality: number;
  scoreResponsiveness: number;
  abcClassification: 'A' | 'B' | 'C';
  tags: string[];
  totalPurchases: number;
  totalOrders: number;
  incidentCount: number;
  onTimeDeliveryRate: number;
  owner: string;
  createdAt: string;
  lastInteraction: string;
  strategicNotes?: string;
}

export interface StockOpportunity {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  product: string;
  brand: string;
  category: string;
  sku?: string;
  ean?: string;
  description: string;
  quantityAvailable: number;
  unitOfMeasure: string;
  buyPrice: number;
  currency: string;
  incoterm: string;
  stockOrigin: string;
  country: string;
  warehouseLocation: string;
  lot?: string;
  productExpiry?: string;
  offerExpiry: string;
  moq: number;
  leadTimeDays: number;
  priority: ProcurementPriority;
  status: OpportunityStatus;
  rejectionReason?: RejectionReason;
  estimatedMargin?: number;
  estimatedMarginPct?: number;
  tags: string[];
  attachments: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Quote {
  id: string;
  opportunityId: string;
  supplierId: string;
  supplierName: string;
  product: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  incoterm: string;
  leadTimeDays: number;
  offerExpiry: string;
  moq: number;
  location: string;
  paymentTerms: string;
  supplierScore: number;
  estimatedLogisticsCost: number;
  estimatedLandedCost: number;
  estimatedMargin: number;
  estimatedMarginPct: number;
  isWinner: boolean;
  notes?: string;
  createdAt: string;
}

export interface MarginScenario {
  id: string;
  name: string;
  opportunityId?: string;
  buyPrice: number;
  quantity: number;
  currency: string;
  exchangeRate: number;
  transportCost: number;
  insuranceCost: number;
  documentCost: number;
  financialCost: number;
  commissions: number;
  otherCosts: number;
  targetSellPrice: number;
  landedCost: number;
  totalCost: number;
  marginUnit: number;
  marginTotal: number;
  marginPct: number;
  minSellPrice: number;
  belowMinMargin: boolean;
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  product: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  issueDate: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  totalValue: number;
  currency: string;
  incoterm: string;
  loadingLocation: string;
  paymentTerms: string;
  status: POStatus;
  notes?: string;
  attachments: number;
  approver?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierEvaluation {
  id: string;
  supplierId: string;
  supplierName: string;
  period: string;
  priceScore: number;
  deliveryScore: number;
  qualityScore: number;
  responsivenessScore: number;
  documentScore: number;
  flexibilityScore: number;
  reliabilityScore: number;
  globalScore: number;
  onTimeRate: number;
  incidentRate: number;
  avgPriceVariation: number;
  notes?: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface ProcurementActivity {
  id: string;
  type: 'tarefa' | 'follow_up' | 'chamada' | 'reuniao' | 'reminder';
  title: string;
  description?: string;
  relatedTo: string;
  relatedType: 'supplier' | 'opportunity' | 'quote' | 'po';
  relatedId: string;
  dueDate: string;
  completed: boolean;
  owner: string;
  createdAt: string;
}

// Status configs
export const OPPORTUNITY_STATUS_CONFIG: Record<OpportunityStatus, { label: string; color: string }> = {
  nova: { label: 'Nova', color: 'bg-info/20 text-info' },
  em_analise: { label: 'Em Análise', color: 'bg-warning/20 text-warning' },
  cotacao_comparacao: { label: 'Cotação/Comparação', color: 'bg-accent/20 text-accent-foreground' },
  aprovada: { label: 'Aprovada', color: 'bg-success/20 text-success' },
  rejeitada: { label: 'Rejeitada', color: 'bg-destructive/20 text-destructive' },
  convertida: { label: 'Convertida em Compra', color: 'bg-secondary/20 text-secondary' },
  expirada: { label: 'Expirada', color: 'bg-muted text-muted-foreground' },
  suspensa: { label: 'Suspensa', color: 'bg-muted text-muted-foreground' },
};

export const PO_STATUS_CONFIG: Record<POStatus, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
  em_aprovacao: { label: 'Em Aprovação', color: 'bg-warning/20 text-warning' },
  aprovada: { label: 'Aprovada', color: 'bg-success/20 text-success' },
  enviada: { label: 'Enviada', color: 'bg-info/20 text-info' },
  confirmada: { label: 'Confirmada', color: 'bg-secondary/20 text-secondary' },
  parcialmente_cumprida: { label: 'Parcial', color: 'bg-accent/20 text-accent-foreground' },
  cumprida: { label: 'Cumprida', color: 'bg-success/30 text-success' },
  cancelada: { label: 'Cancelada', color: 'bg-destructive/20 text-destructive' },
};

export const SUPPLIER_STATUS_CONFIG: Record<SupplierStatus, { label: string; color: string }> = {
  ativo: { label: 'Ativo', color: 'bg-success/20 text-success' },
  inativo: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  em_avaliacao: { label: 'Em Avaliação', color: 'bg-warning/20 text-warning' },
  bloqueado: { label: 'Bloqueado', color: 'bg-destructive/20 text-destructive' },
};

export const PRIORITY_CONFIG: Record<ProcurementPriority, { label: string; color: string }> = {
  baixa: { label: 'Baixa', color: 'bg-muted text-muted-foreground' },
  media: { label: 'Média', color: 'bg-info/20 text-info' },
  alta: { label: 'Alta', color: 'bg-warning/20 text-warning' },
  urgente: { label: 'Urgente', color: 'bg-destructive/20 text-destructive' },
};
