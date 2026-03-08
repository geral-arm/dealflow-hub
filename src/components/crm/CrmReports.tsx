import { motion } from "framer-motion";
import { StatCard } from "@/components/KpiCard";
import { mockOpportunities, mockLeads, mockClients, mockProposals } from "@/data/crm-mock";
import { BarChart3, TrendingDown, Target, Users } from "lucide-react";

export function CrmReports() {
  // Loss reasons mock
  const lossReasons = [
    { reason: 'Preço', count: 12, pct: 35 },
    { reason: 'Concorrência', count: 8, pct: 24 },
    { reason: 'Prazo', count: 5, pct: 15 },
    { reason: 'Condição Pagamento', count: 4, pct: 12 },
    { reason: 'Falta de Stock', count: 3, pct: 9 },
    { reason: 'Desinteresse', count: 2, pct: 5 },
  ];

  // Performance by owner
  const owners = ['Ana Silva', 'Miguel Costa'];
  const ownerStats = owners.map(owner => ({
    owner,
    leads: mockLeads.filter(l => l.owner === owner).length,
    opportunities: mockOpportunities.filter(o => o.owner === owner).length,
    proposals: mockProposals.filter(p => p.owner === owner).length,
    won: mockOpportunities.filter(o => o.owner === owner && o.stage === 'fechado_ganho').length,
    pipeline: mockOpportunities.filter(o => o.owner === owner && o.stage !== 'fechado_perdido').reduce((s, o) => s + o.estimatedValue, 0),
  }));

  // Client segments
  const segments = [
    { segment: 'Enterprise', count: mockClients.filter(c => c.segment === 'Enterprise').length, value: '€8.3M' },
    { segment: 'Mid-Market', count: mockClients.filter(c => c.segment === 'Mid-Market').length, value: '€2.5M' },
  ];

  // Conversion funnel
  const funnel = [
    { stage: 'Leads Criados', count: mockLeads.length, pct: 100 },
    { stage: 'Qualificados', count: mockLeads.filter(l => !['novo', 'por_qualificar', 'desqualificado'].includes(l.status)).length, pct: 67 },
    { stage: 'Proposta Enviada', count: mockLeads.filter(l => ['proposta_enviada', 'em_negociacao', 'convertido'].includes(l.status)).length, pct: 50 },
    { stage: 'Convertidos', count: mockLeads.filter(l => l.status === 'convertido').length, pct: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <StatCard title="Funil de Conversão" delay={0}>
          <div className="space-y-3">
            {funnel.map((step, i) => (
              <div key={step.stage} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-28 shrink-0">{step.stage}</span>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(step.pct, 5)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full bg-primary/60 rounded flex items-center justify-end pr-2"
                  >
                    <span className="text-[10px] font-mono text-primary-foreground">{step.count}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Loss Reasons */}
        <StatCard title="Motivos de Perda" delay={1}>
          <div className="space-y-2">
            {lossReasons.map(lr => (
              <div key={lr.reason} className="flex items-center gap-3">
                <span className="text-xs w-32 shrink-0">{lr.reason}</span>
                <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-destructive/40 rounded" style={{ width: `${lr.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{lr.pct}%</span>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Team Performance */}
        <StatCard title="Performance da Equipa" delay={2}>
          <div className="space-y-4">
            {ownerStats.map(os => (
              <div key={os.owner} className="rounded-lg border p-3">
                <p className="text-sm font-medium mb-2">{os.owner}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div><p className="text-lg font-bold">{os.leads}</p><p className="text-[10px] text-muted-foreground">Leads</p></div>
                  <div><p className="text-lg font-bold">{os.opportunities}</p><p className="text-[10px] text-muted-foreground">Oport.</p></div>
                  <div><p className="text-lg font-bold">{os.proposals}</p><p className="text-[10px] text-muted-foreground">Propostas</p></div>
                  <div><p className="text-lg font-bold text-success">{os.won}</p><p className="text-[10px] text-muted-foreground">Ganhos</p></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Pipeline: <span className="font-mono font-bold">€{(os.pipeline / 1000).toFixed(0)}K</span></p>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Client Segments */}
        <StatCard title="Segmentos de Clientes" delay={3}>
          <div className="space-y-3">
            {segments.map(s => (
              <div key={s.segment} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{s.segment}</p>
                  <p className="text-xs text-muted-foreground">{s.count} clientes</p>
                </div>
                <p className="text-sm font-bold font-mono">{s.value}</p>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </div>
  );
}
