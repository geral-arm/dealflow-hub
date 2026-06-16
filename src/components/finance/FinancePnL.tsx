import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMonthlyTracker, TARGET_2026, FINANCE_TOTALS } from "@/data/finance-mock";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Target } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinancePnL() {
  const sales = mockMonthlyTracker.reduce((s, m) => s + m.sales, 0);
  const purchases = mockMonthlyTracker.reduce((s, m) => s + m.purchases, 0);
  const net = mockMonthlyTracker.reduce((s, m) => s + m.netResult, 0);
  const grossMargin = sales > 0 ? ((sales - purchases) / sales) * 100 : 0;

  const progressSales = (sales / TARGET_2026.salesGoal) * 100;
  const progressNet = (net / TARGET_2026.netResultGoal) * 100;
  const missingSales = Math.max(0, TARGET_2026.salesGoal - sales);

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Vendas YTD</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{fmt(sales)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Compras YTD</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{fmt(purchases)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem bruta</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{grossMargin.toFixed(2)}%</div><div className="text-[11px] text-muted-foreground mt-1">Target {FINANCE_TOTALS.targetGrossMargin}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Resultado Líquido</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${net >= 0 ? "text-success" : "text-destructive"}`}>{fmt(net)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" />Objetivo 2026</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Vendas — {fmt(sales)} / {fmt(TARGET_2026.salesGoal)}</span>
              <Badge variant="outline">{progressSales.toFixed(1)}%</Badge>
            </div>
            <Progress value={Math.min(100, progressSales)} className="h-2" />
            <p className="text-[11px] text-muted-foreground mt-1">Falta {fmt(missingSales)} para o objetivo anual</p>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Resultado líquido — {fmt(net)} / {fmt(TARGET_2026.netResultGoal)}</span>
              <Badge variant="outline">{progressNet.toFixed(1)}%</Badge>
            </div>
            <Progress value={Math.min(100, Math.max(0, progressNet))} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Tracker mensal 2026</CardTitle></CardHeader>
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

      <Card>
        <CardHeader><CardTitle className="text-sm">Tabela mensal</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Compras</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">Margem €</TableHead>
                <TableHead className="text-right">Margem %</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMonthlyTracker.map(m => {
                const margin = m.sales - m.purchases;
                const marginPct = m.sales > 0 ? (margin / m.sales) * 100 : 0;
                return (
                  <TableRow key={m.month} className={m.sales === 0 ? "opacity-40" : ""}>
                    <TableCell className="font-medium">{m.month} {m.year}</TableCell>
                    <TableCell className="text-right">{fmt(m.purchases)}</TableCell>
                    <TableCell className="text-right">{fmt(m.sales)}</TableCell>
                    <TableCell className="text-right">{fmt(margin)}</TableCell>
                    <TableCell className="text-right">{marginPct.toFixed(2)}%</TableCell>
                    <TableCell className={`text-right font-medium ${m.netResult >= 0 ? "text-success" : "text-destructive"}`}>{fmt(m.netResult)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}