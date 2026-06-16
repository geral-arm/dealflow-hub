import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMonthlyTracker, TARGET_2026, FINANCE_TOTALS, YTD_2026 } from "@/data/finance-mock";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Target } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinancePnL() {
  const sales = mockMonthlyTracker.reduce((s, m) => s + m.sales, 0);
  const purchases = mockMonthlyTracker.reduce((s, m) => s + m.purchases, 0);
  const net = mockMonthlyTracker.reduce((s, m) => s + m.netResult, 0);
  const grossMargin = sales > 0 ? ((sales - purchases) / sales) * 100 : 0;

  const marginYtd = YTD_2026.marginToReceive;
  const marginReceived = YTD_2026.marginReceived;
  const progressMargin = (marginYtd / TARGET_2026.marginGoal) * 100;
  const missingMargin = Math.max(0, TARGET_2026.marginGoal - marginYtd);
  const progressReceived = (marginReceived / TARGET_2026.marginGoal) * 100;

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Vendas YTD</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{fmt(sales)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Compras YTD</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{fmt(purchases)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem bruta</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{grossMargin.toFixed(2)}%</div><div className="text-[11px] text-muted-foreground mt-1">Target {FINANCE_TOTALS.targetGrossMargin}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Resultado Líquido</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${net >= 0 ? "text-success" : "text-destructive"}`}>{fmt(net)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" />Objetivo de Margem 2026 — {fmt(TARGET_2026.marginGoal)}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Margem total a receber — {fmt(marginYtd)} / {fmt(TARGET_2026.marginGoal)}</span>
              <Badge variant="outline">{progressMargin.toFixed(2)}%</Badge>
            </div>
            <Progress value={Math.min(100, progressMargin)} className="h-2" />
            <p className="text-[11px] text-muted-foreground mt-1">Falta {fmt(missingMargin)} para o objetivo ilíquido anual</p>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Margem efetivamente recebida — {fmt(marginReceived)} / {fmt(TARGET_2026.marginGoal)}</span>
              <Badge variant="outline">{progressReceived.toFixed(2)}%</Badge>
            </div>
            <Progress value={Math.min(100, Math.max(0, progressReceived))} className="h-2" />
            <p className="text-[11px] text-muted-foreground mt-1">Resultado líquido YTD: {fmt(net)}</p>
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
                <TableHead className="text-right">Margem a Receber</TableHead>
                <TableHead className="text-right">Margem Recebida</TableHead>
                <TableHead className="text-right">Despesas</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMonthlyTracker.map(m => {
                return (
                  <TableRow key={m.month} className={m.sales === 0 ? "opacity-40" : ""}>
                    <TableCell className="font-medium">{m.month} {m.year}</TableCell>
                    <TableCell className="text-right">{fmt(m.purchases)}</TableCell>
                    <TableCell className="text-right">{fmt(m.sales)}</TableCell>
                    <TableCell className="text-right">{fmt(m.marginToReceive ?? 0)}</TableCell>
                    <TableCell className="text-right text-success">{fmt(m.marginReceived ?? 0)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(m.expenses ?? 0)}</TableCell>
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