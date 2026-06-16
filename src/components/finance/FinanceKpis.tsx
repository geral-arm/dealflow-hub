import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockCreditLines, FINANCE_TOTALS, mockMonthlyTracker } from "@/data/finance-mock";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, ComposedChart } from "recharts";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const marginTrend = [
  { week: "S-7", margin: 4.7, target: 5.0 },
  { week: "S-6", margin: 4.9, target: 5.0 },
  { week: "S-5", margin: 4.6, target: 5.0 },
  { week: "S-4", margin: 5.1, target: 5.0 },
  { week: "S-3", margin: 5.0, target: 5.0 },
  { week: "S-2", margin: 4.8, target: 5.0 },
  { week: "S-1", margin: 5.02, target: 5.0 },
];

const dsoByMarket = [
  { market: "Spain",   dso: 42 },
  { market: "France",  dso: 55 },
  { market: "Germany", dso: 38 },
  { market: "Belgium", dso: 47 },
  { market: "UK",      dso: 40 },
];

export function FinanceKpis() {
  const debt = FINANCE_TOTALS.debt;
  const yearSales = mockMonthlyTracker.reduce((s, m) => s + m.sales, 0) * 2;
  const debtToRevenue = (debt / yearSales) * 100;
  const totalLimit = mockCreditLines.reduce((s, l) => s + l.contracted, 0);
  const totalUsed = mockCreditLines.reduce((s, l) => s + l.used, 0);
  const utilisation = (totalUsed / totalLimit) * 100;

  const concentration = mockCreditLines.reduce<Record<string, number>>((acc, l) => {
    acc[l.bank] = (acc[l.bank] || 0) + l.used;
    return acc;
  }, {});
  const concArr = Object.entries(concentration).filter(([, v]) => v > 0).map(([bank, v]) => ({ bank, pct: (v / debt) * 100, value: v })).sort((a, b) => b.pct - a.pct);

  const avgDso = dsoByMarket.reduce((s, m) => s + m.dso, 0) / dsoByMarket.length;

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">DSO médio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{avgDso.toFixed(0)} dias</div><div className="text-xs text-muted-foreground mt-1">Target: 40 dias</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem bruta atual</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{FINANCE_TOTALS.currentGrossMargin.toFixed(2)}%</div><div className="text-xs text-muted-foreground mt-1">Target: {FINANCE_TOTALS.targetGrossMargin.toFixed(0)}% ✓</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Debt-to-Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{debtToRevenue.toFixed(1)}%</div><div className="text-xs text-muted-foreground mt-1">{fmt(debt)} / vendas anualizadas</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Util. linhas crédito</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{utilisation.toFixed(0)}%</div><Progress value={utilisation} className="mt-2 h-1.5" /><div className="text-[11px] text-muted-foreground mt-1">Millennium 100% · Bankinter 100%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Tracker mensal — Compras vs Vendas vs Resultado Líquido</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockMonthlyTracker}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                <Legend />
                <Bar dataKey="purchases" fill="hsl(var(--destructive))" name="Compras" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="Vendas" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="netResult" stroke="hsl(var(--success))" strokeWidth={2} name="Resultado Líquido" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Margem semanal — Real vs Target</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marginTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="margin" stroke="hsl(var(--primary))" strokeWidth={2} name="Real %" />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" name="Target %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">DSO por mercado</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dsoByMarket}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="market" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="d" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="dso" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Concentração de dívida por banco</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {concArr.map(c => (
            <div key={c.bank}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{c.bank}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{fmt(c.value)}</span>
                  <Badge variant="outline" className={c.pct > 50 ? "border-destructive/40 text-destructive" : c.pct > 35 ? "border-warning/40 text-warning" : ""}>{c.pct.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={c.pct} className="h-2" />
            </div>
          ))}
          <p className="text-xs text-destructive mt-3">⚠ Regra: nenhum banco {">"} 50%. MillenniumBCP está nos ~65% (1.500.000 €) — rebalancear urgente.</p>
        </CardContent>
      </Card>
    </div>
  );
}