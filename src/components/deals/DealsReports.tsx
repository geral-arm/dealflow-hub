import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES, LOSS_REASON_CONFIG } from "@/types/deals";

export function DealsReports() {
  const activeDeals = mockDeals.filter(d => !['concluido', 'perdido', 'cancelado'].includes(d.stage));
  const totalPipeline = activeDeals.reduce((s, d) => s + d.totalSellValue, 0);
  const totalMargin = activeDeals.reduce((s, d) => s + d.marginTotal, 0);
  const avgDays = mockDeals.length ? mockDeals.reduce((s, d) => s + d.daysInPipeline, 0) / mockDeals.length : 0;
  const won = mockDeals.filter(d => d.stage === 'concluido');
  const lost = mockDeals.filter(d => d.stage === 'perdido');

  // By owner
  const owners = [...new Set(mockDeals.map(d => d.owner))];
  const byOwner = owners.map(o => ({
    owner: o,
    count: mockDeals.filter(d => d.owner === o && !['concluido', 'perdido', 'cancelado'].includes(d.stage)).length,
    value: mockDeals.filter(d => d.owner === o && !['concluido', 'perdido', 'cancelado'].includes(d.stage)).reduce((s, d) => s + d.totalSellValue, 0),
  })).sort((a, b) => b.value - a.value);

  // By category
  const categories = [...new Set(mockDeals.flatMap(d => d.products.map(p => p.category)))];
  const byCat = categories.map(cat => ({
    category: cat,
    count: mockDeals.filter(d => d.products.some(p => p.category === cat)).length,
    value: mockDeals.filter(d => d.products.some(p => p.category === cat)).reduce((s, d) => s + d.totalSellValue, 0),
  })).sort((a, b) => b.value - a.value);

  // Loss reasons
  const lossReasons = lost.reduce((acc, d) => {
    if (d.lossReason) acc[d.lossReason] = (acc[d.lossReason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 mt-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Ativo', value: `€${(totalPipeline / 1000).toFixed(0)}K` },
          { label: 'Margem Estimada', value: `€${(totalMargin / 1000).toFixed(0)}K` },
          { label: 'Ciclo Médio', value: `${avgDays.toFixed(0)} dias` },
          { label: 'Deals Ganhos', value: won.length.toString() },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className="font-display text-xl font-bold text-card-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By owner */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Deals por Comercial</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {byOwner.map((item, i) => (
              <motion.div key={item.owner} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{item.owner}</p>
                  <p className="text-xs text-muted-foreground">{item.count} deals ativos</p>
                </div>
                <span className="text-sm font-semibold text-card-foreground">€{(item.value / 1000).toFixed(0)}K</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* By category */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Deals por Categoria</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {byCat.map((item, i) => (
              <motion.div key={item.category} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{item.category}</p>
                  <p className="text-xs text-muted-foreground">{item.count} deals</p>
                </div>
                <span className="text-sm font-semibold text-card-foreground">€{(item.value / 1000).toFixed(0)}K</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Loss reasons */}
      {Object.keys(lossReasons).length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Motivos de Perda</CardTitle></CardHeader>
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
