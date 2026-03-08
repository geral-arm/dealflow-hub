import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES, DEAL_HEALTH_CONFIG, DEAL_PRIORITY_CONFIG } from "@/types/deals";
import type { Deal } from "@/types/deals";
import {
  ArrowLeft, Eye, TrendingUp, Users, Package, FileText, CheckCircle, AlertTriangle,
  Clock, MessageSquare, ListTodo, Shield, Paperclip, BarChart3
} from "lucide-react";

interface Props {
  dealId: string;
  onBack: () => void;
}

export function DealDetail({ dealId, onBack }: Props) {
  const deal = mockDeals.find(d => d.id === dealId);
  if (!deal) return <div className="text-center py-12 text-muted-foreground">Deal não encontrado</div>;

  const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
  const health = DEAL_HEALTH_CONFIG[deal.health];
  const priority = DEAL_PRIORITY_CONFIG[deal.priority];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mt-1 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">{deal.code}</span>
            <Badge variant="outline" className={stageConf?.color}>{stageConf?.label}</Badge>
            <Badge variant="outline" className={priority.color}>{priority.label}</Badge>
            <span className={`text-xs font-medium ${health.color}`}>{health.icon} {health.label}</span>
            {deal.watchlist && <Eye className="h-3.5 w-3.5 text-warning" />}
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{deal.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{deal.owner} · {deal.team} · Prob. {deal.probability}%</p>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Valor Venda', value: `€${(deal.totalSellValue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Valor Compra', value: `€${(deal.totalBuyValue / 1000).toFixed(0)}K`, icon: Package, color: 'text-muted-foreground' },
          { label: 'Margem', value: `${deal.marginPercent.toFixed(1)}%`, icon: BarChart3, color: deal.marginPercent >= deal.targetMargin ? 'text-success' : 'text-warning' },
          { label: 'Margem Total', value: `€${(deal.marginTotal / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-success' },
          { label: 'Dias Pipeline', value: `${deal.daysInPipeline}d`, icon: Clock, color: 'text-info' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="border border-border/60">
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                </div>
                <span className="font-display text-lg font-bold text-card-foreground">{kpi.value}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'margin', label: 'Margem', icon: TrendingUp },
            { id: 'approval', label: 'Aprovação', icon: CheckCircle },
            { id: 'timeline', label: 'Histórico', icon: MessageSquare },
            { id: 'tasks', label: 'Tarefas', icon: ListTodo },
            { id: 'risks', label: 'Riscos', icon: Shield },
            { id: 'documents', label: 'Documentos', icon: Paperclip },
          ].map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm px-3 py-1.5 gap-1">
              <tab.icon className="h-3 w-3" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview"><OverviewTab deal={deal} /></TabsContent>
        <TabsContent value="margin"><MarginTab deal={deal} /></TabsContent>
        <TabsContent value="approval"><ApprovalTab deal={deal} /></TabsContent>
        <TabsContent value="timeline"><TimelineTab deal={deal} /></TabsContent>
        <TabsContent value="tasks"><TasksTab deal={deal} /></TabsContent>
        <TabsContent value="risks"><RisksTab deal={deal} /></TabsContent>
        <TabsContent value="documents"><DocumentsTab deal={deal} /></TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab({ deal }: { deal: Deal }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Dados Comerciais</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            ['Cliente', deal.clientName],
            ['Fornecedor', deal.supplierName],
            ['Incoterm', deal.incoterm],
            ['Moeda', deal.currency],
            ['Origem', deal.originCountry],
            ['Destino', deal.destinationCountry],
            ['Entrega Estimada', deal.estimatedDelivery],
            ['Fecho Previsto', deal.expectedClose],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium text-card-foreground">{v}</span></div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Produtos</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {deal.products.map(p => (
            <div key={p.id} className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-medium text-card-foreground">{p.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{p.brand}</span>
                <span>{p.category}</span>
                <span>{p.quantity.toLocaleString()} {p.unit}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs">
                <span>Compra: €{p.buyPrice.toFixed(2)}</span>
                <span>Venda: €{p.sellPrice.toFixed(2)}</span>
                <span className="text-success font-medium">Margem: {((1 - p.buyPrice / p.sellPrice) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {deal.nextAction && (
        <Card className="lg:col-span-2">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-4 w-4 text-warning shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Próxima Ação</p>
              <p className="text-sm font-medium text-card-foreground">{deal.nextAction}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {deal.tags.length > 0 && (
        <Card className="lg:col-span-2">
          <CardContent className="p-4 flex items-center gap-2 flex-wrap">
            {deal.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag.replace('_', ' ')}</Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MarginTab({ deal }: { deal: Deal }) {
  const latest = deal.marginSnapshots[deal.marginSnapshots.length - 1];

  return (
    <div className="space-y-4 mt-4">
      {/* Real-time calc */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Cálculo de Margem Atual</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Custo Compra</p>
              <p className="font-display text-lg font-bold text-card-foreground">€{deal.totalBuyValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Preço Venda</p>
              <p className="font-display text-lg font-bold text-card-foreground">€{deal.totalSellValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-success/10 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Margem Total</p>
              <p className="font-display text-lg font-bold text-success">€{deal.marginTotal.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${deal.marginPercent >= deal.targetMargin ? 'bg-success/10' : 'bg-warning/10'}`}>
              <p className="text-[10px] text-muted-foreground uppercase">Margem %</p>
              <p className={`font-display text-lg font-bold ${deal.marginPercent >= deal.targetMargin ? 'text-success' : 'text-warning'}`}>{deal.marginPercent.toFixed(1)}%</p>
              <p className="text-[10px] text-muted-foreground">Alvo: {deal.targetMargin}%</p>
            </div>
          </div>

          {latest && (
            <div className="p-3 rounded-lg border border-border/50">
              <p className="text-xs font-medium text-card-foreground mb-2">Breakdown de Custos (último snapshot)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  ['Compra', latest.buyCost],
                  ['Logística', latest.logisticsCost],
                  ['Documentos', latest.documentCost],
                  ['Financeiro', latest.financialCost],
                  ['Câmbio', latest.fxCost],
                  ['Comissões', latest.commissions],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">€{(val as number).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Snapshots history */}
      {deal.marginSnapshots.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Histórico de Margem</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deal.marginSnapshots.map((snap, i) => (
                <motion.div key={snap.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                >
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{snap.date}</span>
                  <span className="text-xs font-medium text-card-foreground flex-1">{snap.note || '—'}</span>
                  <span className="text-xs">Custo: €{snap.totalCost.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-success">{snap.marginPercent.toFixed(1)}%</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ApprovalTab({ deal }: { deal: Deal }) {
  const statusColors: Record<string, string> = {
    nao_iniciado: 'bg-muted text-muted-foreground',
    pendente: 'bg-warning/15 text-warning',
    em_revisao: 'bg-info/15 text-info',
    aprovado: 'bg-success/15 text-success',
    aprovado_condicao: 'bg-warning/15 text-warning',
    rejeitado: 'bg-destructive/15 text-destructive',
    expirado: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Workflow de Aprovação</CardTitle>
            <Badge variant="outline" className={statusColors[deal.approvalStatus]}>{deal.approvalStatus.replace('_', ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {deal.approvals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Aprovação não iniciada</p>
          ) : (
            <div className="space-y-3">
              {deal.approvals.map((ap, i) => (
                <motion.div key={ap.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-muted-foreground">{ap.level}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{ap.approver}</p>
                    {ap.notes && <p className="text-xs text-muted-foreground">{ap.notes}</p>}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={statusColors[ap.status]}>{ap.status.replace('_', ' ')}</Badge>
                    {ap.decidedAt && <p className="text-[10px] text-muted-foreground mt-1">{ap.decidedAt}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineTab({ deal }: { deal: Deal }) {
  const typeIcons: Record<string, string> = {
    chamada: '📞', email: '✉️', reuniao: '🤝', whatsapp: '💬', nota_interna: '📝',
    decisao_comercial: '💼', decisao_procurement: '📦', decisao_financeira: '💰', comentario_gestao: '👔',
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Histórico de Negociação</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-0">
            {deal.timeline.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex gap-3 pb-4 relative"
              >
                {i < deal.timeline.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-border/60" />}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm shrink-0 z-10">
                  {typeIcons[ev.type] || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-medium text-card-foreground">{ev.user}</span>
                    <span className="text-[10px] text-muted-foreground">{ev.date}</span>
                    {ev.marginImpact && <Badge variant="outline" className="text-[9px] bg-success/10 text-success border-success/20">Margem {ev.marginImpact}</Badge>}
                  </div>
                  <p className="text-sm text-card-foreground">{ev.summary}</p>
                  {ev.nextSteps && <p className="text-xs text-muted-foreground mt-1">→ {ev.nextSteps}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          {deal.timeline.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Sem eventos registados</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function TasksTab({ deal }: { deal: Deal }) {
  const statusColors: Record<string, string> = {
    pendente: 'bg-muted text-muted-foreground',
    em_progresso: 'bg-info/15 text-info',
    concluida: 'bg-success/15 text-success',
    atrasada: 'bg-destructive/15 text-destructive',
    cancelada: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Tarefas do Deal</CardTitle></CardHeader>
        <CardContent>
          {deal.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem tarefas</p>
          ) : (
            <div className="space-y-2">
              {deal.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{task.assignee}</span>
                      <span>·</span>
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
                  <Badge variant="outline" className={DEAL_PRIORITY_CONFIG[task.priority].color}>{DEAL_PRIORITY_CONFIG[task.priority].label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RisksTab({ deal }: { deal: Deal }) {
  const severityColors: Record<string, string> = {
    baixo: 'bg-muted text-muted-foreground',
    medio: 'bg-warning/15 text-warning',
    alto: 'bg-destructive/15 text-destructive',
    critico: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Riscos Identificados</CardTitle></CardHeader>
        <CardContent>
          {deal.risks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem riscos identificados</p>
          ) : (
            <div className="space-y-3">
              {deal.risks.map(risk => (
                <div key={risk.id} className="p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      <Badge variant="outline" className="text-[10px]">{risk.type}</Badge>
                    </div>
                    <Badge variant="outline" className={severityColors[risk.severity]}>{risk.severity}</Badge>
                  </div>
                  <p className="text-sm text-card-foreground">{risk.description}</p>
                  {risk.mitigation && (
                    <p className="text-xs text-muted-foreground mt-1">Mitigação: {risk.mitigation}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Responsável: {risk.responsible}</span>
                    <span>·</span>
                    <span>Prob: {risk.probability}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentsTab({ deal }: { deal: Deal }) {
  const catLabels: Record<string, string> = {
    proposta: 'Proposta', cotacao: 'Cotação', po: 'Purchase Order', contrato: 'Contrato',
    fiscal: 'Fiscal', logistico: 'Logístico', aprovacao: 'Aprovação', outro: 'Outro',
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Documentos ({deal.documents.length})</CardTitle></CardHeader>
        <CardContent>
          {deal.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem documentos anexados</p>
          ) : (
            <div className="space-y-2">
              {deal.documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.uploadedBy}</span>
                      <span>·</span>
                      <span>{doc.uploadedAt}</span>
                      <span>·</span>
                      <span>v{doc.version}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{catLabels[doc.category]}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
