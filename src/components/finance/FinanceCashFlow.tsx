import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCashFlow, FINANCE_TOTALS } from "@/data/finance-mock";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function buildForecast(days: number) {
  const startCash = FINANCE_TOTALS.liquidity;
  const today = new Date();
  const points: { date: string; balance: number; inflow: number; outflow: number }[] = [];
  let running = startCash;
  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayEntries = mockCashFlow.filter(e => e.date === iso && e.status !== "overdue");
    const inflow = dayEntries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
    const outflow = dayEntries.filter(e => e.amount < 0).reduce((s, e) => s + e.amount, 0);
    running += inflow + outflow;
    points.push({ date: iso.slice(5), balance: running, inflow, outflow: Math.abs(outflow) });
  }
  return points;
}

export function FinanceCashFlow() {
  const [horizon, setHorizon] = useState("30");
  const data = buildForecast(parseInt(horizon));
  const minBalance = Math.min(...data.map(d => d.balance));
  const totalIn = data.reduce((s, d) => s + d.inflow, 0);
  const totalOut = data.reduce((s, d) => s + d.outflow, 0);

  return (
    <div className="space-y-6 mt-4">
      <Tabs value={horizon} onValueChange={setHorizon}>
        <TabsList>
          <TabsTrigger value="7">7 dias</TabsTrigger>
          <TabsTrigger value="30">30 dias</TabsTrigger>
          <TabsTrigger value="90">90 dias</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Entradas previstas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-success">{fmt(totalIn)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Saídas previstas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{fmt(totalOut)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Mínimo de cash projetado</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${minBalance < 0 ? "text-destructive" : "text-foreground"}`}>{fmt(minBalance)}</div>
            <div className="text-xs text-muted-foreground mt-1">{minBalance < 0 ? "⚠ Cash crunch — modelo capital-intensivo" : "Buffer adequado"}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warning/40 bg-warning/5">
        <CardContent className="pt-4 text-xs">
          ⚠ <strong>Disponível para compras: {fmt(FINANCE_TOTALS.purchasingPower)}.</strong> Qualquer nova encomenda a fornecedor consome diretamente este buffer — cruzar projeção com saídas a {horizon} dias.
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Cash Flow Waterfall — {horizon} dias</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => fmt(v)} />
                <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#bal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Movimentos agendados</CardTitle></CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-auto">
          {[...mockCashFlow].sort((a, b) => a.date.localeCompare(b.date)).map(e => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground w-20">{e.date.slice(5)}</div>
                <div>
                  <div className="text-sm font-medium">{e.description}</div>
                  <div className="text-xs text-muted-foreground capitalize">{e.type.replace("_", " ")} • {e.counterparty}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`text-[10px] ${e.status === "overdue" ? "border-destructive/40 text-destructive" : e.status === "confirmed" ? "border-success/40 text-success" : ""}`}>{e.status}</Badge>
                <div className={`text-sm font-bold w-28 text-right ${e.amount >= 0 ? "text-success" : "text-destructive"}`}>{fmt(e.amount)}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}