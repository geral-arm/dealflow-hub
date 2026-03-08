// ========== Deals Data Types ==========

export type DealStage =
  | 'novo'
  | 'em_estruturacao'
  | 'sourcing_validacao'
  | 'proposta_preparacao'
  | 'em_negociacao'
  | 'em_aprovacao'
  | 'aprovado'
  | 'em_execucao'
  | 'concluido'
  | 'perdido'
  | 'cancelado';

export type DealHealthStatus = 'saudavel' | 'atencao' | 'critico';

export type ApprovalStatus = 'nao_iniciado' | 'pendente' | 'em_revisao' | 'aprovado' | 'aprovado_condicao' | 'rejeitado' | 'expirado';

export type DealRiskType = 'margem' | 'pagamento' | 'fornecedor' | 'documental' | 'logistico' | 'validade' | 'disponibilidade';

export type DealLossReason =
  | 'preco_nao_competitivo'
  | 'margem_insuficiente'
  | 'cliente_desistiu'
  | 'fornecedor_falhou'
  | 'prazo_longo'
  | 'risco_financeiro'
  | 'falta_stock'
  | 'problema_documental'
  | 'concorrencia'
  | 'outro';

export type NegotiationEventType =
  | 'chamada'
  | 'email'
  | 'reuniao'
  | 'whatsapp'
  | 'nota_interna'
  | 'decisao_comercial'
  | 'decisao_procurement'
  | 'decisao_financeira'
  | 'comentario_gestao';

export type DealTaskStatus = 'pendente' | 'em_progresso' | 'concluida' | 'atrasada' | 'cancelada';

export type DealPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface DealProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  currency: string;
}

export interface DealMarginSnapshot {
  id: string;
  date: string;
  buyCost: number;
  logisticsCost: number;
  documentCost: number;
  financialCost: number;
  fxCost: number;
  commissions: number;
  totalCost: number;
  sellPrice: number;
  marginTotal: number;
  marginPercent: number;
  note?: string;
}

export interface DealApproval {
  id: string;
  level: number;
  approver: string;
  status: ApprovalStatus;
  reason?: string;
  decidedAt?: string;
  notes?: string;
}

export interface DealNegotiationEvent {
  id: string;
  date: string;
  user: string;
  type: NegotiationEventType;
  summary: string;
  valueBefore?: number;
  valueAfter?: number;
  marginImpact?: string;
  nextSteps?: string;
}

export interface DealTask {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate: string;
  status: DealTaskStatus;
  phase: DealStage;
  priority: DealPriority;
}

export interface DealRisk {
  id: string;
  type: DealRiskType;
  description: string;
  severity: 'baixo' | 'medio' | 'alto' | 'critico';
  probability: 'baixa' | 'media' | 'alta';
  responsible: string;
  mitigation?: string;
  status: 'aberto' | 'mitigado' | 'aceite' | 'fechado';
}

export interface DealDocument {
  id: string;
  name: string;
  type: string;
  category: 'proposta' | 'cotacao' | 'po' | 'contrato' | 'fiscal' | 'logistico' | 'aprovacao' | 'outro';
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface Deal {
  id: string;
  code: string;
  name: string;
  stage: DealStage;
  priority: DealPriority;
  health: DealHealthStatus;

  // Parties
  clientId: string;
  clientName: string;
  supplierId: string;
  supplierName: string;

  // Products
  products: DealProduct[];

  // Commercial
  totalBuyValue: number;
  totalSellValue: number;
  currency: string;
  incoterm: string;
  marginTotal: number;
  marginPercent: number;
  targetMargin: number;

  // Logistics
  originCountry: string;
  destinationCountry: string;
  estimatedDelivery: string;

  // Status
  approvalStatus: ApprovalStatus;
  lossReason?: DealLossReason;

  // Ownership
  owner: string;
  team: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  expectedClose: string;
  closedAt?: string;

  // Relationships
  opportunityId?: string;
  proposalId?: string;
  poId?: string;

  // Meta
  tags: string[];
  watchlist: boolean;
  daysInPipeline: number;
  probability: number;
  nextAction?: string;

  // Sub-collections (simplified for mock)
  marginSnapshots: DealMarginSnapshot[];
  approvals: DealApproval[];
  timeline: DealNegotiationEvent[];
  tasks: DealTask[];
  risks: DealRisk[];
  documents: DealDocument[];
}

// Pipeline stage config
export interface DealStageConfig {
  id: DealStage;
  label: string;
  color: string;
}

export const DEAL_STAGES: DealStageConfig[] = [
  { id: 'novo', label: 'Novo Deal', color: 'bg-info/20 text-info' },
  { id: 'em_estruturacao', label: 'Em Estruturação', color: 'bg-info/30 text-info' },
  { id: 'sourcing_validacao', label: 'Sourcing Validação', color: 'bg-warning/20 text-warning' },
  { id: 'proposta_preparacao', label: 'Proposta Preparação', color: 'bg-warning/30 text-warning' },
  { id: 'em_negociacao', label: 'Em Negociação', color: 'bg-accent/30 text-accent-foreground' },
  { id: 'em_aprovacao', label: 'Em Aprovação', color: 'bg-secondary/20 text-secondary' },
  { id: 'aprovado', label: 'Aprovado', color: 'bg-success/20 text-success' },
  { id: 'em_execucao', label: 'Em Execução', color: 'bg-success/30 text-success' },
  { id: 'concluido', label: 'Concluído', color: 'bg-success/40 text-success' },
  { id: 'perdido', label: 'Perdido', color: 'bg-destructive/20 text-destructive' },
  { id: 'cancelado', label: 'Cancelado', color: 'bg-muted text-muted-foreground' },
];

export const DEAL_HEALTH_CONFIG: Record<DealHealthStatus, { label: string; color: string; icon: string }> = {
  saudavel: { label: 'Saudável', color: 'text-success', icon: '●' },
  atencao: { label: 'Atenção', color: 'text-warning', icon: '●' },
  critico: { label: 'Crítico', color: 'text-destructive', icon: '●' },
};

export const DEAL_PRIORITY_CONFIG: Record<DealPriority, { label: string; color: string }> = {
  baixa: { label: 'Baixa', color: 'bg-muted text-muted-foreground' },
  media: { label: 'Média', color: 'bg-info/20 text-info' },
  alta: { label: 'Alta', color: 'bg-warning/20 text-warning' },
  urgente: { label: 'Urgente', color: 'bg-destructive/20 text-destructive' },
};

export const LOSS_REASON_CONFIG: Record<DealLossReason, string> = {
  preco_nao_competitivo: 'Preço Não Competitivo',
  margem_insuficiente: 'Margem Insuficiente',
  cliente_desistiu: 'Cliente Desistiu',
  fornecedor_falhou: 'Fornecedor Falhou',
  prazo_longo: 'Prazo Demasiado Longo',
  risco_financeiro: 'Risco Financeiro',
  falta_stock: 'Falta de Stock',
  problema_documental: 'Problema Documental',
  concorrencia: 'Concorrência',
  outro: 'Outro',
};
