import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { mockBankAccounts, mockCashFlow } from "@/data/finance-mock";
import { AlertTriangle, Zap } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinanceScenarios() {
  const [clientDelay, setClientDelay] = useState(0);
  const [supplierAccel, setSupplierAccel] = useState(0);
  const [fxShock, setFxShock] = useState(0);
  const [stressTest, setStressTest] = useState(false);

  const baseline = useMemo(() => mockBankAccounts.reduce((s, a) => s + a.balanceEUR, 0), []);

  const result = useMemo(() => {
    const today = new Date();
    const horizon30 = new Date(today); horizon30.setDate(horizon30.getDate() + 30);
    const horizon7 = new Date(today); horizon7.setDate(horizon7.getDate() + 7);

    let cash7 = baseline;
    let cash30 = baseline;

    mockCashFlow.forEach(e => {
      const date = new Date(e.date);
      let amount = e.amount;
      if (e.amount > 0 && (clientDelay > 0 || stressTest)) {
        const delay = stressTest ? 30 : clientDelay;
        date.setDate(date.getDate() + delay);
      }
      if (e.amount < 0 && supplierAccel > 0) {
        date.setDate(date.getDate() - supplierAccel);
      }
      if (date <= horizon7) cash7 += amount;
      if (date <= horizon30) cash30 += amount;
    });

    const fxImpact = baseline * (fxShock / 100) * 0.06;
    cash7 += fxImpact;
    cash30 += fxImpact;

    const liquidityImpact = cash30 - baseline;
    const risk = cash7 < -200000 ? "critical" : cash7 < 0 ? "high" : cash30 < 0 ? "medium" : "low";

    return { cash7, cash30, liquidityImpact, risk };
  }, [baseline, clientDelay, supplierAccel, fxShock, stressTest]);

  const riskColor = { low: "success", medium: "warning", high: "warning", critical: "destructive" }[result.risk];

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4" />Parâmetros do cenário</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2"><Label className="text-xs">Atraso de pagamento de clientes</Label><span className="text-xs font-mono">+{clientDelay} dias</span></div>
              <Slider value={[clientDelay]} onValueChange={(v) => setClientDelay(v[0])} max={60} step={5} disabled={stressTest} />
            </div>
            <div>
              <div className="flex justify-between mb-2"><Label className="text-xs">Aceleração de pagamento a fornecedores</Label><span className="text-xs font-mono">-{supplierAccel} dias</span></div>
              <Slider value={[supplierAccel]} onValueChange={(v) => setSupplierAccel(v[0])} max={30} step={5} />
            </div>
            <div>
              <div className="flex justify-between mb-2"><Label className="text-xs">Choque cambial (GBP/USD)</Label><span className="text-xs font-mono">{fxShock > 0 ? "+" : ""}{fxShock}%</span></div>
              <Slider value={[fxShock]} onValueChange={(v) => setFxShock(v[0])} min={-15} max={15} step={1} />
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-destructive/5 p-3">
              <div>
                <Label className="text-sm font-medium">Stress test — worst case</Label>
                <p className="text-xs text-muted-foreground">Todos os clientes atrasam 30 dias</p>
              </div>
              <Switch checked={stressTest} onCheckedChange={setStressTest} />
            </div>
            <Button variant="outline" size="sm" onClick={() => { setClientDelay(0); setSupplierAccel(0); setFxShock(0); setStressTest(false); }}>Reset</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Impacto na liquidez</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Cash em 7 dias</div>
              <div className={`text-2xl font-bold ${result.cash7 < 0 ? "text-destructive" : "text-foreground"}`}>{fmt(result.cash7)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cash em 30 dias</div>
              <div className={`text-2xl font-bold ${result.cash30 < 0 ? "text-destructive" : "text-foreground"}`}>{fmt(result.cash30)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Variação vs baseline</div>
              <div className={`text-lg font-bold ${result.liquidityImpact < 0 ? "text-destructive" : "text-success"}`}>{result.liquidityImpact >= 0 ? "+" : ""}{fmt(result.liquidityImpact)}</div>
            </div>
            <Badge variant="outline" className={`w-full justify-center py-2 border-${riskColor}/40 text-${riskColor}`}>Risco: {result.risk}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Recomendações automáticas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {result.cash7 < 0 && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-xs"><strong>Acionar linha de confirming BBVA</strong> — cash projetado a 7 dias é negativo. Mobilizar até €145k disponíveis.</div>
            </div>
          )}
          {result.cash30 < 0 && (
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs"><strong>Renegociar prazos com fornecedores</strong> — Coca-Cola Iberia e Nestlé concentram 40% das saídas no horizonte.</div>
            </div>
          )}
          {clientDelay >= 15 && (
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs"><strong>Antecipar follow-up comercial</strong> com Carrefour, Tesco e Mercadona para minimizar o impacto.</div>
            </div>
          )}
          {result.risk === "low" && !stressTest && clientDelay === 0 && supplierAccel === 0 && fxShock === 0 && (
            <p className="text-sm text-muted-foreground">Ajusta os sliders acima para simular cenários de stress.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}