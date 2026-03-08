import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES, DEAL_HEALTH_CONFIG, DEAL_PRIORITY_CONFIG, LOSS_REASON_CONFIG } from "@/types/deals";
import { TrendingUp, Target, AlertTriangle, Clock, CheckCircle, XCircle, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onOpenDeal: (id: string) => void;
}

export function DealsDashboard({ onOpenDeal }: Props) {
  const activeDeals = mockDeals.filter(d => !['concluido', 'perdido', 'cancelado'].includes(d.stage));
  const totalPipelineValue = activeDeals.reduce((s, d) => s + d.totalSellValue, 0);
  const totalMargin = activeDeals.reduce((s, d) => s + d.marginTotal, 0);
  const avgMargin = activeDeals.length ? activeDeals.reduce((s, d) => s + d.marginPercent, 0) / activeDeals.length : 0;
  const pendingApprovals = mockDeals.filter(d => d.approvalStatus === 'pendente' || d.approvalStatus === 'em_revisao');
  const atRisk = mockDeals.filter(d => d.health === 'critico' || d.health === 'atencao');
  const won = mockDeals.filter(d => d.stage === 'concluido').length;
  const lost = mockDeals.filter(d => d.stage === 'perdido').length;
  const conversionRate = (won + lost) > 0 ? ((won / (won + lost)) * 100) : 0;
  const watchlist = mockDeals.filter(d => d.watchlist);

  const kpis = [
    { label: 'Deals Ativos', value: activeDeals.length.toString(), icon: Target, color: 'text-primary' },
    { label: 'Pipeline Total', value: `€${(totalPipelineValue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-success' },
    { label: 'Margem Estimada', value: `€${(totalMargin / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-secondary' },
    { label: 'Margem Média', value: `${avgMargin.toFixed(1)}%`, icon: Target, color: 'text-info' },
    { label: 'Pend. Aprovação', value: pendingApprovals.length.toString(), icon: Clock, color: 'text-warning' },
    { label: 'Em Risco', value: atRisk.length.toString(), icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Taxa Conversão', value: `${conversionRate.toFixed(0)}%`, icon: CheckCircle, color: 'text-success' },
    { label: 'Perdidos', value: lost.toString(), icon: XCircle, color: 'text-destructive' },
  ];

  // Deals by stage
  const stageData = DEAL_STAGES.filter(s => !['perdido', 'cancelado'].includes(s.id)).map(stage => ({
    ...stage,
    count: mockDeals.filter(d => d.stage === stage.id).length,
    value: mockDeals.filter(d => d.stage === stage.id).reduce((s, d) => s + d.totalSellValue, 0),
  })).filter(s => s.count > 0);

  // Loss reasons
  const lostDeals = mockDeals.filter(d => d.lossReason);
  const lossReasons = lostDeals.reduce((acc, d) => {
    if (d.lossReason) acc[d.lossReason] = (acc[d.lossReason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 mt-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</span>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <span className="font-display text-2xl font-bold text-card-foreground">{kpi.value}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by stage */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Pipeline por Fase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stageData.map((stage, i) => (
              <motion.div key={stage.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs font-medium text-muted-foreground truncate">{stage.label}</span>
                <div className="flex-1 h-7 bg-muted rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max((stage.value / totalPipelineValue) * 100, 8)}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                    className="h-full bg-primary/70 rounded flex items-center px-2"
                  >
                    <span className="text-[10px] font-bold text-primary-foreground">{stage.count}</span>
                  </motion.div>
                </div>
                <span className="w-20 text-right text-xs font-semibold text-card-foreground">€{(stage.value / 1000).toFixed(0)}K</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Watchlist */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-warning" />
              <CardTitle className="text-base font-display">Watchlist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {watchlist.map(deal => {
              const health = DEAL_HEALTH_CONFIG[deal.health];
              return (
                <button key={deal.id} onClick={() => onOpenDeal(deal.id)} className="w-full text-left p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{deal.code}</span>
                    <span className={`text-xs ${health.color}`}>{health.icon} {health.label}</span>
                  </div>
                  <p className="text-sm font-medium text-card-foreground truncate">{deal.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">€{(deal.totalSellValue / 1000).toFixed(0)}K</span>
                    <span className="text-xs font-medium text-success">{deal.marginPercent.toFixed(1)}%</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent deals table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Deals Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deal</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Fornecedor</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Valor</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right hidden sm:table-cell">Margem</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fase</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Saúde</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {mockDeals.slice(0, 6).map((deal, i) => {
                  const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
                  const health = DEAL_HEALTH_CONFIG[deal.health];
                  return (
                    <motion.tr key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-xs text-muted-foreground">{deal.code}</td>
                      <td className="py-3 font-medium text-card-foreground">{deal.clientName}</td>
                      <td className="py-3 text-muted-foreground hidden md:table-cell">{deal.supplierName}</td>
                      <td className="py-3 text-right font-semibold text-card-foreground">€{(deal.totalSellValue / 1000).toFixed(0)}K</td>
                      <td className="py-3 text-right font-medium text-success hidden sm:table-cell">{deal.marginPercent.toFixed(1)}%</td>
                      <td className="py-3"><Badge variant="outline" className={stageConf?.color}>{stageConf?.label}</Badge></td>
                      <td className="py-3"><span className={`text-xs ${health.color}`}>{health.icon}</span></td>
                      <td className="py-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenDeal(deal.id)}>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Loss reasons */}
      {Object.keys(lossReasons).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Motivos de Perda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(lossReasons).map(([reason, count]) => (
                <div key={reason} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/10">
                  <span className="text-xs text-destructive font-medium">{LOSS_REASON_CONFIG[reason as keyof typeof LOSS_REASON_CONFIG]}</span>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
