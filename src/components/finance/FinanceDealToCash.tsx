import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockFinanceDeals, UNPAID_2026_TOTAL } from "@/data/finance-mock";
import { Progress } from "@/components/ui/progress";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const statusColors: Record<string, string> = {
  perspective: "bg-muted text-muted-foreground",
  ongoing: "bg-primary/15 text-primary",
  concluded: "bg-success/15 text-success",
  unpaid: "bg-destructive/15 text-destructive",
  canceled: "bg-muted text-muted-foreground",
};

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function FinanceDealToCash() {
  const today = new Date().toISOString().slice(0, 10);
  const totalSell = mockFinanceDeals.reduce((s, d) => s + d.sellPrice, 0);
  const totalMargin = mockFinanceDeals.reduce((s, d) => s + (d.sellPrice - d.buyPrice - d.logistics), 0);
  const blocking = mockFinanceDeals.filter(d => d.status === "unpaid");
  const blockingCash = blocking.reduce((s, d) => s + d.sellPrice, 0);
  const counts = mockFinanceDeals.reduce<Record<string, number>>((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Volume ativo</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{fmt(totalSell)}</div><div className="text-xs text-muted-foreground mt-1">{mockFinanceDeals.length} deals</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{fmt(totalMargin)}</div><div className="text-xs text-muted-foreground mt-1">{((totalMargin / totalSell) * 100).toFixed(1)}% médio</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Cash bloqueado (Unpaid)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{fmt(blockingCash)}</div><div className="text-xs text-muted-foreground mt-1">{blocking.length} aqui · pipeline 2026: {UNPAID_2026_TOTAL} unpaid</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Pipeline</CardTitle></CardHeader><CardContent>
          <div className="space-y-1 text-xs">
            {Object.entries(counts).map(([s, c]) => (
              <div key={s} className="flex justify-between"><span className="capitalize text-muted-foreground">{s}</span><span className="font-medium">{c}</span></div>
            ))}
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Deals em atraso — bloqueando cash</CardTitle></CardHeader>
        <CardContent>
          {blocking.length === 0 ? <p className="text-sm text-muted-foreground">Sem deals em atraso 🎉</p> : (
            <div className="space-y-2">
              {blocking.map(d => {
                const daysLate = -daysBetween(today, d.expectedPaymentDate);
                return (
                  <div key={d.id} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold">{d.reference} — {d.client}</div>
                        <div className="text-xs text-muted-foreground">{d.product} • {d.market}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-destructive">{fmt(d.sellPrice)}</div>
                        <Badge variant="outline" className="border-destructive/40 text-destructive text-[10px]">{daysLate} dias atraso</Badge>
                      </div>
                    </div>
                    <Progress value={Math.min(100, (daysLate / 60) * 100)} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Todos os deals — Margem & Days to cash</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Venda</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead className="text-right">% Margem</TableHead>
                <TableHead className="text-right">Days to cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFinanceDeals.map(d => {
                const margin = d.sellPrice - d.buyPrice - d.logistics;
                const marginPct = (margin / d.sellPrice) * 100;
                const dtc = d.daysToCash ?? daysBetween(d.orderDate, d.expectedPaymentDate);
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.reference}</TableCell>
                    <TableCell className="text-sm">{d.client}<div className="text-[10px] text-muted-foreground">{d.market}</div></TableCell>
                    <TableCell><Badge className={statusColors[d.status]}>{d.status}</Badge></TableCell>
                    <TableCell className="text-right text-sm">{fmt(d.sellPrice)}</TableCell>
                    <TableCell className="text-right text-sm">{fmt(margin)}</TableCell>
                    <TableCell className={`text-right text-sm font-medium ${marginPct < 2 ? "text-destructive" : marginPct < 5 ? "text-warning" : "text-success"}`}>{marginPct.toFixed(1)}%</TableCell>
                    <TableCell className="text-right text-sm">{dtc}d</TableCell>
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