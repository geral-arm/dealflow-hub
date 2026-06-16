import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { historicMarginToRecover, mockDisputedDebtors, mockCourtFrozen } from "@/data/finance-mock";
import { Gavel, Banknote, AlertOctagon } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinanceCollections() {
  const historicTotal = historicMarginToRecover.reduce((s, h) => s + h.amount, 0);
  const disputedTotal = mockDisputedDebtors.reduce((s, d) => s + d.amount, 0);
  const courtTotal = mockCourtFrozen.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Margem histórica</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{fmt(historicTotal)}</div><div className="text-[11px] text-muted-foreground mt-1">2024 + 2025 por recuperar</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Em disputa</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{fmt(disputedTotal)}</div><div className="text-[11px] text-muted-foreground mt-1">{mockDisputedDebtors.length} devedores</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Congelado em tribunal</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{fmt(courtTotal)}</div><div className="text-[11px] text-muted-foreground mt-1">{mockCourtFrozen.length} processos</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Banknote className="h-4 w-4" />Margem histórica por recuperar</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {historicMarginToRecover.map(h => (
              <div key={h.year} className="rounded-lg border bg-muted/30 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Ano</div>
                  <div className="text-xl font-semibold">{h.year}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-warning">{fmt(h.amount)}</div>
                  <Button size="sm" variant="outline" className="mt-2">Iniciar cobrança</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertOctagon className="h-4 w-4" />Devedores em disputa</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Devedor</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Penalização</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDisputedDebtors.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium text-sm">{d.debtor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.group || "—"}</TableCell>
                  <TableCell className="text-xs">{d.origin}</TableCell>
                  <TableCell>{d.withPenalty ? <Badge variant="outline" className="border-destructive/40 text-destructive">Com</Badge> : <Badge variant="outline">Sem</Badge>}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(d.amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Gavel className="h-4 w-4" />Congelados em tribunal</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockCourtFrozen.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div>
                <div className="text-sm font-semibold">{c.label}</div>
                <div className="text-[11px] text-muted-foreground">{c.status}</div>
              </div>
              <div className="text-sm font-bold text-destructive">{fmt(c.amount)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}