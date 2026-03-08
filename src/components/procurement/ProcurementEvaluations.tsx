import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockEvaluations } from "@/data/procurement-mock";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

export function ProcurementEvaluations() {
  const sorted = [...mockEvaluations].sort((a, b) => b.globalScore - a.globalScore);
  const dimensions = ['priceScore', 'deliveryScore', 'qualityScore', 'responsivenessScore', 'documentScore', 'flexibilityScore', 'reliabilityScore'] as const;
  const dimLabels: Record<string, string> = { priceScore: 'Preço', deliveryScore: 'Entrega', qualityScore: 'Qualidade', responsivenessScore: 'Resposta', documentScore: 'Documentação', flexibilityScore: 'Flexibilidade', reliabilityScore: 'Fiabilidade' };

  const getClassification = (score: number) => {
    if (score >= 90) return { label: 'Estratégico', color: 'bg-success/20 text-success' };
    if (score >= 80) return { label: 'Preferencial', color: 'bg-secondary/20 text-secondary' };
    if (score >= 70) return { label: 'Qualificado', color: 'bg-info/20 text-info' };
    if (score >= 60) return { label: 'Em Observação', color: 'bg-warning/20 text-warning' };
    return { label: 'Bloqueado', color: 'bg-destructive/20 text-destructive' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Avaliação de Fornecedores</h2>
        <p className="text-sm text-muted-foreground">Ranking e performance por período</p>
      </div>

      {/* Ranking */}
      <Card className="card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-accent" /> Ranking Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">#</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Fornecedor</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Período</th>
                  {dimensions.map(d => <th key={d} className="text-center px-3 py-2 font-medium text-muted-foreground">{dimLabels[d]}</th>)}
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Global</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">On-Time</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Incidentes</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Classif.</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((ev, i) => {
                  const cls = getClassification(ev.globalScore);
                  return (
                    <tr key={ev.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-3 font-bold text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-3 font-medium text-foreground">{ev.supplierName}</td>
                      <td className="px-3 py-3 text-muted-foreground">{ev.period}</td>
                      {dimensions.map(d => (
                        <td key={d} className="px-3 py-3 text-center">
                          <span className={`font-medium ${ev[d] >= 85 ? 'text-success' : ev[d] >= 70 ? 'text-foreground' : 'text-destructive'}`}>{ev[d]}</span>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center">
                        <span className="text-lg font-display font-bold text-foreground">{ev.globalScore}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          {ev.onTimeRate >= 90 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                          <span className="text-foreground">{ev.onTimeRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-foreground">{ev.incidentRate}%</td>
                      <td className="px-3 py-3"><Badge variant="outline" className={`${cls.color} text-xs`}>{cls.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map(ev => {
          const cls = getClassification(ev.globalScore);
          return (
            <Card key={ev.id} className="card-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{ev.supplierName}</CardTitle>
                  <Badge variant="outline" className={`${cls.color} text-xs`}>{cls.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ev.period} · Avaliado por {ev.evaluatedBy}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-center py-2">
                  <span className="text-3xl font-display font-bold text-foreground">{ev.globalScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className="space-y-1.5">
                  {dimensions.map(d => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24">{dimLabels[d]}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: `${ev[d]}%` }} /></div>
                      <span className="text-xs font-medium text-foreground w-7 text-right">{ev[d]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
