import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockBankAccounts, mockFinanceDeals } from "@/data/finance-mock";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const marginTrend = [
  { week: "S-7", margin: 4.1, target: 4.5 },
  { week: "S-6", margin: 4.3, target: 4.5 },
  { week: "S-5", margin: 3.9, target: 4.5 },
  { week: "S-4", margin: 4.6, target: 4.5 },
  { week: "S-3", margin: 4.8, target: 4.5 },
  { week: "S-2", margin: 4.2, target: 4.5 },
  { week: "S-1", margin: 4.5, target: 4.5 },
];

const dsoByMarket = [
  { market: "Spain", dso: 38 },
  { market: "France", dso: 52 },
  { market: "Netherlands", dso: 41 },
  { market: "Belgium", dso: 45 },
  { market: "UK", dso: 35 },
];

export function FinanceKpis() {
  const debt = mockBankAccounts.filter(a => a.balance < 0).reduce((s, a) => s + Math.abs(a.balanceEUR), 0);
  const monthlyRevenue = 1200000;
  const debtToRevenue = (debt / (monthlyRevenue * 12)) * 100;
  const totalConfirmingLimit = mockBankAccounts.filter(a => a.creditLimit).reduce((s, a) => s + (a.creditLimit || 0), 0);
  const totalConfirmingUsed = mockBankAccounts.filter(a => a.creditLimit).reduce((s, a) => s + (a.used || 0), 0);
  const utilisation = (totalConfirmingUsed / totalConfirmingLimit) * 100;

  const concentration = mockBankAccounts.filter(a => a.balance < 0).reduce<Record<string, number>>((acc, a) => {
    acc[a.bank] = (acc[a.bank] || 0) + Math.abs(a.balanceEUR);
    return acc;
  }, {});
  const concArr = Object.entries(concentration).map(([bank, v]) => ({ bank, pct: (v / debt) * 100, value: v })).sort((a, b) => b.pct - a.pct);

  const avgDso = dsoByMarket.reduce((s, m) => s + m.dso, 0) / dsoByMarket.length;

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">DSO médio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{avgDso.toFixed(0)} dias</div><div className="text-xs text-muted-foreground mt-1">Target: 40 dias</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem bruta atual</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">4.5%</div><div className="text-xs text-muted-foreground mt-1">Target: 4.5% ✓</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Debt-to-Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{debtToRevenue.toFixed(1)}%</div><div className="text-xs text-muted-foreground mt-1">{fmt(debt)} / {fmt(monthlyRevenue * 12)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Confirming util.</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{utilisation.toFixed(0)}%</div><Progress value={utilisation} className="mt-2 h-1.5" /></CardContent></Card>
      </div>

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
                  <Badge variant="outline" className={c.pct > 35 ? "border-warning/40 text-warning" : ""}>{c.pct.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={c.pct} className="h-2" />
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-3">⚠ Recomendação: nenhum banco deve exceder 35% da dívida total para reduzir risco de concentração.</p>
        </CardContent>
      </Card>
    </div>
  );
}