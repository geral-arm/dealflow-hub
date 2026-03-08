import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDeals } from "@/data/deals-mock";
import { AlertTriangle } from "lucide-react";

export function DealsRisks() {
  const allRisks = mockDeals.flatMap(d => d.risks.map(r => ({ ...r, dealCode: d.code, dealName: d.name })));
  const open = allRisks.filter(r => r.status === 'aberto');

  const severityColors: Record<string, string> = {
    baixo: 'bg-muted text-muted-foreground',
    medio: 'bg-warning/15 text-warning',
    alto: 'bg-destructive/15 text-destructive',
    critico: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Riscos Abertos', value: open.length, color: 'text-warning' },
          { label: 'Críticos', value: open.filter(r => r.severity === 'critico' || r.severity === 'alto').length, color: 'text-destructive' },
          { label: 'Mitigados', value: allRisks.filter(r => r.status === 'mitigado').length, color: 'text-success' },
          { label: 'Total', value: allRisks.length, color: 'text-muted-foreground' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`font-display text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-display">Riscos por Deal</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {allRisks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem riscos identificados</p>
          ) : allRisks.map((risk, i) => (
            <motion.div key={risk.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="p-3 rounded-lg border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <span className="font-mono text-xs text-muted-foreground">{risk.dealCode}</span>
                  <Badge variant="outline" className="text-[10px]">{risk.type}</Badge>
                </div>
                <Badge variant="outline" className={severityColors[risk.severity]}>{risk.severity}</Badge>
              </div>
              <p className="text-sm text-card-foreground">{risk.description}</p>
              {risk.mitigation && <p className="text-xs text-muted-foreground mt-1">Mitigação: {risk.mitigation}</p>}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{risk.responsible}</span>
                <span>·</span>
                <span>Prob: {risk.probability}</span>
                <span>·</span>
                <Badge variant="outline" className="text-[9px]">{risk.status}</Badge>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
