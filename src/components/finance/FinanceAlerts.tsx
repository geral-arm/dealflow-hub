import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockFinanceAlerts } from "@/data/finance-mock";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";

const sevConfig = {
  critical: { color: "destructive", icon: AlertTriangle },
  warning: { color: "warning", icon: AlertCircle },
  info: { color: "primary", icon: Info },
} as const;

export function FinanceAlerts() {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-3">
        {(["critical", "warning", "info"] as const).map(s => {
          const count = mockFinanceAlerts.filter(a => a.severity === s).length;
          const Icon = sevConfig[s].icon;
          return (
            <Card key={s}>
              <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground capitalize">{s}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className={`text-2xl font-bold text-${sevConfig[s].color}`}>{count}</div>
                <Icon className={`h-6 w-6 text-${sevConfig[s].color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4" />Alertas ativos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockFinanceAlerts.map(a => {
            const cfg = sevConfig[a.severity];
            const Icon = cfg.icon;
            return (
              <div key={a.id} className={`rounded-lg border bg-${cfg.color}/5 border-${cfg.color}/30 p-4`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className={`h-5 w-5 text-${cfg.color} mt-0.5 shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{a.title}</span>
                        <Badge variant="outline" className={`text-[10px] border-${cfg.color}/40 text-${cfg.color}`}>{a.type.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                  {a.actionable && <Button size="sm" variant="outline">{a.actionable}</Button>}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Regras de automação</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "r1", label: "Cash balance < €100.000 → notificar CFO", on: true, threshold: 100000, unit: "€" },
            { id: "r2", label: "Recebível em atraso > 30 dias → escalação automática", on: true, threshold: 30, unit: "dias" },
            { id: "r3", label: "Margem de deal < 2% → flag para revisão", on: true, threshold: 2, unit: "%" },
            { id: "r4", label: "Best Before Date < 90 dias → alerta inventário", on: true, threshold: 90, unit: "dias" },
            { id: "r5", label: "Confirming call-in < 5 dias → preparar pagamento", on: true, threshold: 5, unit: "dias" },
            { id: "r6", label: "Concentração bancária > 35% → rebalancear", on: false, threshold: 35, unit: "%" },
          ].map(r => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
              <Label className="text-sm flex-1">{r.label}</Label>
              <div className="flex items-center gap-3">
                <Input defaultValue={r.threshold} className="w-20 h-8 text-xs" />
                <span className="text-xs text-muted-foreground w-10">{r.unit}</span>
                <Switch defaultChecked={r.on} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}