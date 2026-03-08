// ========== Inventory & Logistics Data Types ==========

export type WarehouseType = 'proprio' | 'bonded' | 'parceiro' | 'fornecedor' | 'cross_docking' | 'hub_temporario';
export type WarehouseStatus = 'ativo' | 'inativo' | 'em_manutencao' | 'saturado';
export type LotStatus = 'disponivel' | 'reservado' | 'quarentena' | 'bloqueado' | 'expedido' | 'expirado' | 'danificado';
export type ShipmentStatus = 'planeado' | 'agendado' | 'em_preparacao' | 'carregado' | 'em_transito' | 'em_alfandega' | 'atrasado' | 'entregue' | 'parcialmente_entregue' | 'cancelado' | 'com_incidencia';
export type TransportType = 'rodoviario' | 'maritimo' | 'aereo' | 'multimodal';
export type CarrierStatus = 'preferencial' | 'qualificada' | 'em_observacao' | 'bloqueada';
export type MovementType = 'entrada' | 'saida' | 'transferencia' | 'ajuste' | 'reserva' | 'libertacao' | 'devolucao';
export type IncidentType = 'atraso' | 'dano' | 'falta' | 'excesso' | 'doc_problema' | 'recusa_entrega' | 'outro';
export type IncidentSeverity = 'baixa' | 'media' | 'alta' | 'critica';
export type ReservationStatus = 'provisoria' | 'confirmada' | 'libertada' | 'expirada';
export type UnitOfMeasure = 'unidade' | 'caixa' | 'pack' | 'pallet' | 'contentor';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: WarehouseType;
  country: string;
  city: string;
  address: string;
  contact: string;
  email: string;
  phone: string;
  operator?: string;
  localCurrency: string;
  capacityPallets: number;
  occupiedPallets: number;
  occupancyPct: number;
  status: WarehouseStatus;
  isBonded: boolean;
  bondedRef?: string;
  bondedRegime?: string;
  storageCostPerPallet?: number;
  totalItems: number;
  totalValue: number;
  notes?: string;
  createdAt: string;
}

export interface StockLot {
  id: string;
  lotNumber: string;
  product: string;
  brand: string;
  category: string;
  sku?: string;
  ean?: string;
  quantity: number;
  availableQty: number;
  reservedQty: number;
  unitOfMeasure: UnitOfMeasure;
  productionDate?: string;
  expiryDate?: string;
  daysToExpiry?: number;
  supplierId: string;
  supplierName: string;
  poNumber?: string;
  warehouseId: string;
  warehouseName: string;
  location?: string;
  country: string;
  isBonded: boolean;
  status: LotStatus;
  unitCost: number;
  totalCost: number;
  currency: string;
  entryDate: string;
  daysInStorage: number;
  notes?: string;
}

export interface StockReservation {
  id: string;
  lotId: string;
  lotNumber: string;
  product: string;
  quantity: number;
  status: ReservationStatus;
  relatedTo: string;
  relatedType: 'deal' | 'sales_order' | 'proposal' | 'opportunity';
  relatedId: string;
  reservedBy: string;
  reservedAt: string;
  expiresAt?: string;
  notes?: string;
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  product: string;
  brand: string;
  lotNumber?: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  fromWarehouse?: string;
  fromWarehouseId?: string;
  toWarehouse?: string;
  toWarehouseId?: string;
  reason: string;
  reference?: string;
  performedBy: string;
  performedAt: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  status: ShipmentStatus;
  transportType: TransportType;
  carrierId: string;
  carrierName: string;
  originWarehouse: string;
  originCountry: string;
  destinationAddress: string;
  destinationCountry: string;
  destinationClient?: string;
  incoterm: string;
  etd: string;
  eta: string;
  actualDeparture?: string;
  actualArrival?: string;
  totalWeight: number;
  totalVolume: number;
  totalPallets: number;
  totalValue: number;
  currency: string;
  trackingRef?: string;
  items: ShipmentItem[];
  events: ShipmentEvent[];
  documents: number;
  incidents: number;
  relatedPO?: string;
  relatedSO?: string;
  relatedDeal?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ShipmentItem {
  id: string;
  product: string;
  brand: string;
  lotNumber: string;
  quantity: number;
  weight: number;
  pallets: number;
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  event: string;
  location?: string;
  notes?: string;
  user?: string;
}

export interface Carrier {
  id: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  website?: string;
  transportTypes: TransportType[];
  marketsCovered: string[];
  routes: string[];
  status: CarrierStatus;
  avgTransitDays: number;
  onTimeRate: number;
  incidentCount: number;
  avgCostPerPallet: number;
  currency: string;
  paymentTerms: string;
  totalShipments: number;
  scoreGlobal: number;
  scoreReliability: number;
  scoreCost: number;
  scoreSpeed: number;
  sla?: string;
  insuranceCoverage?: string;
  certifications: string[];
  notes?: string;
  createdAt: string;
}

export interface OperationalIncident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description: string;
  relatedTo: string;
  relatedType: 'shipment' | 'lot' | 'warehouse' | 'carrier' | 'receipt';
  relatedId: string;
  carrierId?: string;
  carrierName?: string;
  rootCause?: string;
  resolution?: string;
  resolved: boolean;
  resolvedAt?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Status configs
export const WAREHOUSE_TYPE_CONFIG: Record<WarehouseType, { label: string; color: string }> = {
  proprio: { label: 'Próprio', color: 'bg-primary/20 text-primary' },
  bonded: { label: 'Bonded', color: 'bg-warning/20 text-warning' },
  parceiro: { label: 'Parceiro', color: 'bg-info/20 text-info' },
  fornecedor: { label: 'Fornecedor', color: 'bg-muted text-muted-foreground' },
  cross_docking: { label: 'Cross-Docking', color: 'bg-accent/20 text-accent-foreground' },
  hub_temporario: { label: 'Hub Temporário', color: 'bg-secondary/20 text-secondary' },
};

export const LOT_STATUS_CONFIG: Record<LotStatus, { label: string; color: string }> = {
  disponivel: { label: 'Disponível', color: 'bg-success/20 text-success' },
  reservado: { label: 'Reservado', color: 'bg-info/20 text-info' },
  quarentena: { label: 'Quarentena', color: 'bg-warning/20 text-warning' },
  bloqueado: { label: 'Bloqueado', color: 'bg-destructive/20 text-destructive' },
  expedido: { label: 'Expedido', color: 'bg-secondary/20 text-secondary' },
  expirado: { label: 'Expirado', color: 'bg-destructive/30 text-destructive' },
  danificado: { label: 'Danificado', color: 'bg-destructive/20 text-destructive' },
};

export const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string }> = {
  planeado: { label: 'Planeado', color: 'bg-muted text-muted-foreground' },
  agendado: { label: 'Agendado', color: 'bg-info/20 text-info' },
  em_preparacao: { label: 'Em Preparação', color: 'bg-warning/20 text-warning' },
  carregado: { label: 'Carregado', color: 'bg-accent/20 text-accent-foreground' },
  em_transito: { label: 'Em Trânsito', color: 'bg-primary/20 text-primary' },
  em_alfandega: { label: 'Em Alfândega', color: 'bg-warning/30 text-warning' },
  atrasado: { label: 'Atrasado', color: 'bg-destructive/20 text-destructive' },
  entregue: { label: 'Entregue', color: 'bg-success/20 text-success' },
  parcialmente_entregue: { label: 'Parcial', color: 'bg-success/10 text-success' },
  cancelado: { label: 'Cancelado', color: 'bg-destructive/20 text-destructive' },
  com_incidencia: { label: 'Com Incidência', color: 'bg-destructive/30 text-destructive' },
};

export const CARRIER_STATUS_CONFIG: Record<CarrierStatus, { label: string; color: string }> = {
  preferencial: { label: 'Preferencial', color: 'bg-success/20 text-success' },
  qualificada: { label: 'Qualificada', color: 'bg-info/20 text-info' },
  em_observacao: { label: 'Em Observação', color: 'bg-warning/20 text-warning' },
  bloqueada: { label: 'Bloqueada', color: 'bg-destructive/20 text-destructive' },
};

export const INCIDENT_SEVERITY_CONFIG: Record<IncidentSeverity, { label: string; color: string }> = {
  baixa: { label: 'Baixa', color: 'bg-muted text-muted-foreground' },
  media: { label: 'Média', color: 'bg-info/20 text-info' },
  alta: { label: 'Alta', color: 'bg-warning/20 text-warning' },
  critica: { label: 'Crítica', color: 'bg-destructive/20 text-destructive' },
};

export const MOVEMENT_TYPE_CONFIG: Record<MovementType, { label: string; color: string }> = {
  entrada: { label: 'Entrada', color: 'bg-success/20 text-success' },
  saida: { label: 'Saída', color: 'bg-destructive/20 text-destructive' },
  transferencia: { label: 'Transferência', color: 'bg-info/20 text-info' },
  ajuste: { label: 'Ajuste', color: 'bg-warning/20 text-warning' },
  reserva: { label: 'Reserva', color: 'bg-accent/20 text-accent-foreground' },
  libertacao: { label: 'Libertação', color: 'bg-secondary/20 text-secondary' },
  devolucao: { label: 'Devolução', color: 'bg-warning/30 text-warning' },
};
