import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOpportunities, mockSuppliers, mockPurchaseOrders, mockEvaluations } from "@/data/procurement-mock";
import { OPPORTUNITY_STATUS_CONFIG, PO_STATUS_CONFIG } from "@/types/procurement";
import { Package, Users, FileText, TrendingUp, AlertTriangle, Clock, DollarSign, BarChart3 } from "lucide-react";

export function ProcurementDashboard() {
  const openOpps = mockOpportunities.filter(o => ['nova', 'em_analise', 'cotacao_comparacao'].includes(o.status));
  const approvedOpps = mockOpportunities.filter(o => o.status === 'aprovada');
  const totalSourcingValue = mockOpportunities.filter(o => !['rejeitada', 'expirada'].includes(o.status)).reduce((s, o) => s + o.buyPrice * o.quantityAvailable, 0);
  const avgMargin = mockOpportunities.filter(o => o.estimatedMarginPct).reduce((s, o) => s + (o.estimatedMarginPct || 0), 0) / mockOpportunities.filter(o => o.estimatedMarginPct).length;
  const pendingPOs = mockPurchaseOrders.filter(po => ['rascunho', 'em_aprovacao'].includes(po.status));
  const activeSup = mockSuppliers.filter(s => s.status === 'ativo');
  const expiringOpps = mockOpportunities.filter(o => {
    const d = new Date(o.offerExpiry);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 5 && diff > 0 && !['rejeitada', 'expirada', 'convertida'].includes(o.status);
  });

  const kpis = [
    { label: 'Oportunidades Abertas', value: openOpps.length, icon: Package, accent: 'text-info' },
    { label: 'Valor Potencial Sourcing', value: `€${(totalSourcingValue / 1000).toFixed(0)}k`, icon: DollarSign, accent: 'text-secondary' },
    { label: 'Margem Média Estimada', value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, accent: 'text-success' },
    { label: 'POs Pendentes', value: pendingPOs.length, icon: FileText, accent: 'text-warning' },
    { label: 'Fornecedores Ativos', value: activeSup.length, icon: Users, accent: 'text-primary' },
    { label: 'Alertas Críticos', value: expiringOpps.length, icon: AlertTriangle, accent: 'text-destructive' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="card-shadow">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Oportunidades Recentes */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Oportunidades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOpportunities.slice(0, 5).map(opp => {
                const sc = OPPORTUNITY_STATUS_CONFIG[opp.status];
                return (
                  <div key={opp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{opp.product}</p>
                      <p className="text-xs text-muted-foreground">{opp.supplierName} · {opp.country}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">€{opp.buyPrice.toFixed(2)}</span>
                      <Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Purchase Orders Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPurchaseOrders.map(po => {
                const sc = PO_STATUS_CONFIG[po.status];
                return (
                  <div key={po.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">{po.supplierName} · {po.expectedDelivery}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="text-sm font-medium text-foreground">€{po.totalValue.toLocaleString()}</span>
                      <Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Fornecedores */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Top Fornecedores por Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEvaluations.sort((a, b) => b.globalScore - a.globalScore).map((ev, i) => (
                <div key={ev.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ev.supplierName}</p>
                      <p className="text-xs text-muted-foreground">On-time: {ev.onTimeRate}% · Incidentes: {ev.incidentRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${ev.globalScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-foreground w-8 text-right">{ev.globalScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Alertas Procurement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringOpps.length > 0 ? expiringOpps.map(opp => (
                <div key={opp.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Clock className="h-4 w-4 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opp.product}</p>
                    <p className="text-xs text-muted-foreground">Expira: {opp.offerExpiry} · {opp.supplierName}</p>
                  </div>
                </div>
              )) : null}
              {pendingPOs.map(po => (
                <div key={po.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <FileText className="h-4 w-4 text-warning shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{po.poNumber} pendente de aprovação</p>
                    <p className="text-xs text-muted-foreground">{po.supplierName} · €{po.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {mockSuppliers.filter(s => s.status === 'em_avaliacao').map(s => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.tradeName} em avaliação</p>
                    <p className="text-xs text-muted-foreground">Score: {s.scoreGlobal} · {s.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
