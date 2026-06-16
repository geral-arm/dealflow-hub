import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockExpenses, EXPENSE_TOTALS } from "@/data/finance-mock";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { ExpenseCategory } from "@/types/finance";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

const COLORS: Record<ExpenseCategory, string> = {
  "Pessoal":  "hsl(var(--primary))",
  "Seguros":  "hsl(var(--warning))",
  "Veículos": "hsl(var(--success))",
  "Viagens":  "hsl(var(--destructive))",
  "Gerais":   "hsl(var(--muted-foreground))",
};

export function FinanceExpenses() {
  const grouped = mockExpenses.reduce<Record<ExpenseCategory, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.monthly;
    return acc;
  }, { "Pessoal": 0, "Seguros": 0, "Veículos": 0, "Viagens": 0, "Gerais": 0 });

  const pieData = Object.entries(grouped)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const sumMonthly = mockExpenses.reduce((s, e) => s + e.monthly, 0);

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Total fixo mensal</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{fmt(EXPENSE_TOTALS.fixedMonthly)}</div><div className="text-[11px] text-muted-foreground mt-1">Soma das linhas: {fmt(sumMonthly)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Total fixo anual</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{fmt(EXPENSE_TOTALS.fixedAnnualEstimate)}</div><div className="text-[11px] text-muted-foreground mt-1">Estimativa anual selecionada</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Linhas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{mockExpenses.length}</div><div className="text-[11px] text-muted-foreground mt-1">5 categorias FSE</div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Distribuição por categoria</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label={(e: { name: string }) => e.name}>
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={COLORS[d.name as ExpenseCategory]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Totais por categoria</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(grouped).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([cat, v]) => (
              <div key={cat} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[cat as ExpenseCategory] }} />
                  <span className="text-sm font-medium">{cat}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{fmt(v)}</div>
                  <div className="text-[11px] text-muted-foreground">/ mês</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Detalhe — despesas Jan / Fev / Mar 2026</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Janeiro</TableHead>
                <TableHead className="text-right">Fevereiro</TableHead>
                <TableHead className="text-right">Março</TableHead>
                <TableHead className="text-right">Médio/mês</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExpenses.map(e => (
                <TableRow key={e.id}>
                  <TableCell><Badge variant="outline" className="text-[10px]">{e.category}</Badge></TableCell>
                  <TableCell className="text-sm">{e.name}</TableCell>
                  <TableCell className="text-right text-sm">{fmt(e.jan || 0)}</TableCell>
                  <TableCell className="text-right text-sm">{fmt(e.feb || 0)}</TableCell>
                  <TableCell className="text-right text-sm">{fmt(e.mar || 0)}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{fmt(e.monthly)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}