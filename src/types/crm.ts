// ========== CRM Data Types ==========

export type LeadStatus = 'novo' | 'por_qualificar' | 'qualificado' | 'proposta_enviada' | 'em_negociacao' | 'convertido' | 'perdido' | 'desqualificado';
export type ClientStatus = 'ativo' | 'inativo' | 'bloqueado' | 'prospect';
export type OpportunityStage = 'lead_qualificado' | 'contacto_inicial' | 'necessidade_identificada' | 'proposta_preparacao' | 'proposta_enviada' | 'negociacao' | 'aprovacao_interna' | 'fechado_ganho' | 'fechado_perdido';
export type ProposalStatus = 'rascunho' | 'em_aprovacao' | 'enviada' | 'visualizada' | 'em_negociacao' | 'aceite' | 'rejeitada' | 'expirada';
export type NegotiationInteractionType = 'chamada' | 'email' | 'reuniao' | 'whatsapp' | 'mensagem' | 'nota_interna';
export type ActivityType = 'tarefa' | 'follow_up' | 'chamada' | 'reuniao' | 'reminder' | 'email';
export type LossReason = 'preco' | 'prazo' | 'falta_stock' | 'condicao_pagamento' | 'concorrencia' | 'desinteresse' | 'outro';
export type ContactRole = 'decisor' | 'comprador' | 'logistica' | 'financeiro' | 'tecnico' | 'outro';
export type Priority = 'baixa' | 'media' | 'alta' | 'critica';
export type ABCClassification = 'A' | 'B' | 'C';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  country: string;
  market: string;
  website?: string;
  source: string;
  categoriesOfInterest: string[];
  brandsOfInterest: string[];
  potentialVolume: string;
  currency: string;
  preferredIncoterm: string;
  status: LeadStatus;
  score: number;
  owner: string;
  createdAt: string;
  lastInteraction: string;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  tags: string[];
}

export interface ClientContact {
  id: string;
  name: string;
  role: ContactRole;
  title: string;
  email: string;
  phone: string;
  language: string;
  decisionLevel: 'alto' | 'medio' | 'baixo';
  notes?: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  legalName: string;
  tradeName: string;
  vatNumber: string;
  country: string;
  address: string;
  website?: string;
  clientType: string;
  defaultCurrency: string;
  preferredLanguage: string;
  defaultIncoterm: string;
  markets: string[];
  status: ClientStatus;
  contacts: ClientContact[];
  categoriesBought: string[];
  brandsOfInterest: string[];
  avgTicket: number;
  purchaseFrequency: string;
  creditLimit: number;
  paymentTerms: string;
  commercialRisk: 'baixo' | 'medio' | 'alto';
  outstandingBalance: number;
  overdueInvoices: number;
  estimatedPotential: number;
  commercialPriority: Priority;
  abcClassification: ABCClassification;
  segment: string;
  vertical: string;
  tags: string[];
  owner: string;
  createdAt: string;
  lastPurchase?: string;
  lastInteraction: string;
  strategicNotes?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  stage: OpportunityStage;
  estimatedValue: number;
  estimatedMargin: number;
  probability: number;
  currency: string;
  expectedCloseDate: string;
  nextAction?: string;
  owner: string;
  categories: string[];
  brands: string[];
  lossReason?: LossReason;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  id: string;
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Proposal {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  opportunityId?: string;
  items: ProposalItem[];
  totalValue: number;
  currency: string;
  incoterm: string;
  deliveryEstimate: string;
  paymentTerms: string;
  validUntil: string;
  status: ProposalStatus;
  version: number;
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface NegotiationEntry {
  id: string;
  date: string;
  user: string;
  type: NegotiationInteractionType;
  summary: string;
  proposedPrice?: number;
  counterPrice?: number;
  requestedQty?: number;
  requestedDeadline?: string;
  status: string;
  nextStep?: string;
  nextFollowUp?: string;
}

export interface Negotiation {
  id: string;
  proposalId?: string;
  opportunityId?: string;
  clientId: string;
  clientName: string;
  entries: NegotiationEntry[];
  currentStatus: string;
  probability: number;
  obstacles?: string;
  perceivedCompetitor?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  relatedTo: string;
  relatedType: 'lead' | 'client' | 'opportunity' | 'proposal' | 'negotiation';
  relatedId: string;
  dueDate: string;
  completed: boolean;
  owner: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  user: string;
}

// Pipeline stage config
export interface PipelineStageConfig {
  id: OpportunityStage;
  label: string;
  color: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'lead_qualificado', label: 'Lead Qualificado', color: 'bg-muted-foreground/20' },
  { id: 'contacto_inicial', label: 'Contacto Inicial', color: 'bg-info/20' },
  { id: 'necessidade_identificada', label: 'Necessidade Identificada', color: 'bg-info/40' },
  { id: 'proposta_preparacao', label: 'Proposta em Preparação', color: 'bg-warning/20' },
  { id: 'proposta_enviada', label: 'Proposta Enviada', color: 'bg-warning/40' },
  { id: 'negociacao', label: 'Negociação', color: 'bg-accent/30' },
  { id: 'aprovacao_interna', label: 'Aprovação Interna', color: 'bg-secondary/30' },
  { id: 'fechado_ganho', label: 'Fechado Ganho', color: 'bg-success/30' },
  { id: 'fechado_perdido', label: 'Fechado Perdido', color: 'bg-destructive/20' },
];

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-info/20 text-info' },
  por_qualificar: { label: 'Por Qualificar', color: 'bg-muted text-muted-foreground' },
  qualificado: { label: 'Qualificado', color: 'bg-secondary/20 text-secondary' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'bg-warning/20 text-warning' },
  em_negociacao: { label: 'Em Negociação', color: 'bg-accent/20 text-accent-foreground' },
  convertido: { label: 'Convertido', color: 'bg-success/20 text-success' },
  perdido: { label: 'Perdido', color: 'bg-destructive/20 text-destructive' },
  desqualificado: { label: 'Desqualificado', color: 'bg-muted text-muted-foreground' },
};

export const PROPOSAL_STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
  em_aprovacao: { label: 'Em Aprovação', color: 'bg-warning/20 text-warning' },
  enviada: { label: 'Enviada', color: 'bg-info/20 text-info' },
  visualizada: { label: 'Visualizada', color: 'bg-info/30 text-info' },
  em_negociacao: { label: 'Em Negociação', color: 'bg-accent/20 text-accent-foreground' },
  aceite: { label: 'Aceite', color: 'bg-success/20 text-success' },
  rejeitada: { label: 'Rejeitada', color: 'bg-destructive/20 text-destructive' },
  expirada: { label: 'Expirada', color: 'bg-muted text-muted-foreground' },
};
