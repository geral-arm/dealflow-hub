import { motion } from "framer-motion";
import { KpiCard, StatCard } from "@/components/KpiCard";
import { UserPlus, Users, Target, FileText, TrendingUp, AlertTriangle, DollarSign, Clock } from "lucide-react";
import { mockLeads, mockClients, mockOpportunities, mockProposals, mockActivities } from "@/data/crm-mock";
import { LEAD_STATUS_CONFIG } from "@/types/crm";
import { Badge } from "@/components/ui/badge";

export function CrmDashboard() {
  const activeLeads = mockLeads.filter(l => !['convertido', 'perdido', 'desqualificado'].includes(l.status));
  const pipelineValue = mockOpportunities.filter(o => o.stage !== 'fechado_perdido').reduce((sum, o) => sum + o.estimatedValue, 0);
  const wonDeals = mockOpportunities.filter(o => o.stage === 'fechado_ganho');
  const conversionRate = Math.round((wonDeals.length / mockOpportunities.length) * 100);
  const pendingActivities = mockActivities.filter(a => !a.completed);
  const overdueActivities = mockActivities.filter(a => !a.completed && new Date(a.dueDate) < new Date());

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={UserPlus} title="Leads Ativos" value={String(activeLeads.length)} change="+2 esta semana" changeType="positive" delay={0} />
        <KpiCard icon={Target} title="Pipeline Valor" value={`€${(pipelineValue / 1000).toFixed(0)}K`} change="8 oportunidades" changeType="neutral" delay={1} />
        <KpiCard icon={TrendingUp} title="Taxa de Conversão" value={`${conversionRate}%`} change="+5pp vs mês anterior" changeType="positive" delay={2} />
        <KpiCard icon={Clock} title="Atividades Pendentes" value={String(pendingActivities.length)} change={`${overdueActivities.length} em atraso`} changeType={overdueActivities.length > 0 ? "negative" : "neutral"} delay={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pipeline Summary */}
        <StatCard title="Pipeline por Fase" className="lg:col-span-2" delay={4}>
          <div className="space-y-3">
            {['lead_qualificado', 'contacto_inicial', 'necessidade_identificada', 'proposta_preparacao', 'proposta_enviada', 'negociacao', 'aprovacao_interna'].map(stage => {
              const opps = mockOpportunities.filter(o => o.stage === stage);
              const value = opps.reduce((s, o) => s + o.estimatedValue, 0);
              const stageLabels: Record<string, string> = {
                lead_qualificado: 'Lead Qualificado', contacto_inicial: 'Contacto Inicial',
                necessidade_identificada: 'Necessidade Ident.', proposta_preparacao: 'Proposta Prep.',
                proposta_enviada: 'Proposta Enviada', negociacao: 'Negociação', aprovacao_interna: 'Aprovação Interna',
              };
              if (opps.length === 0) return null;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{stageLabels[stage]}</span>
                  <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((value / pipelineValue) * 100, 8)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-primary/70 rounded-md flex items-center justify-end pr-2"
                    >
                      <span className="text-[10px] font-medium text-primary-foreground">
                        €{(value / 1000).toFixed(0)}K
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{opps.length}</span>
                </div>
              );
            })}
          </div>
        </StatCard>

        {/* Recent Activities */}
        <StatCard title="Próximas Atividades" delay={5}>
          <div className="space-y-3">
            {mockActivities.filter(a => !a.completed).slice(0, 5).map(activity => (
              <div key={activity.id} className="flex gap-3 text-sm">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                  new Date(activity.dueDate) < new Date() ? 'bg-destructive' :
                  new Date(activity.dueDate).toDateString() === new Date().toDateString() ? 'bg-warning' : 'bg-secondary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-card-foreground truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.relatedTo} · {activity.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Leads */}
        <StatCard title="Top Leads" delay={6}>
          <div className="space-y-3">
            {mockLeads.filter(l => l.score >= 60).sort((a, b) => b.score - a.score).slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lead.companyName}</p>
                  <p className="text-xs text-muted-foreground">{lead.contactName} · {lead.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary">{lead.score}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${LEAD_STATUS_CONFIG[lead.status].color}`}>
                    {LEAD_STATUS_CONFIG[lead.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Top Clients */}
        <StatCard title="Top Clientes por Potencial" delay={7}>
          <div className="space-y-3">
            {mockClients.sort((a, b) => b.estimatedPotential - a.estimatedPotential).slice(0, 4).map(client => (
              <div key={client.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{client.tradeName}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">{client.abcClassification}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{client.country} · {client.segment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">€{(client.estimatedPotential / 1000000).toFixed(1)}M</p>
                  <p className="text-[10px] text-muted-foreground">Ticket: €{(client.avgTicket / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </div>
  );
}
