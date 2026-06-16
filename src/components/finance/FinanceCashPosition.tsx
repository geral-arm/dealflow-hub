import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockBankAccounts, mockCreditLines, FINANCE_TOTALS } from "@/data/finance-mock";
import { Building2, TrendingUp, AlertTriangle } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinanceCashPosition() {
  const liquid = FINANCE_TOTALS.liquidity;
  const debt = FINANCE_TOTALS.debt;
  const purchasingPower = FINANCE_TOTALS.purchasingPower;

  const byRegion = mockBankAccounts.reduce<Record<string, number>>((acc, a) => {
    const k = a.country === "GLOBAL" ? "Internacional" : a.country;
    acc[k] = (acc[k] || 0) + a.balanceEUR;
    return acc;
  }, {});

  const fxAccounts = mockBankAccounts.filter(a => a.type === "fx");

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Liquidez total</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{fmt(liquid)}</div>
            <div className="text-xs text-muted-foreground mt-1">{FINANCE_TOTALS.activeAccounts} contas · {FINANCE_TOTALS.activeBanks} bancos</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Dívida total</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{fmt(debt)}</div>
            <div className="text-xs text-muted-foreground mt-1">Confirming Millennium 100%</div>
            <Progress value={100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-destructive">Disponível para compras</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{fmt(purchasingPower)}</div>
            <Badge variant="outline" className="mt-1 text-destructive border-destructive/40">⚠ Limite real de poder de compra</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Bancos ativos</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FINANCE_TOTALS.activeBanks}</div>
            <div className="text-xs text-muted-foreground mt-1">{FINANCE_TOTALS.activeAccounts} contas · PT / ES / Internacional</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Consolidação por região</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(byRegion).map(([region, v]) => (
              <div key={region} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{region}</span>
                  <Badge variant="outline" className="text-[10px]">{fmt(v)}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {mockBankAccounts.filter(a => (a.country === "GLOBAL" ? "Internacional" : a.country) === region).length} conta(s)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4" />Contas bancárias (8 contas reais)</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[420px] overflow-auto">
            {mockBankAccounts.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">{a.bank}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 items-center">
                    <Badge variant="outline" className="text-[10px] py-0">{a.country === "GLOBAL" ? "INT" : a.country}</Badge>
                    <Badge variant="outline" className="text-[10px] py-0 capitalize">{a.type}</Badge>
                    {a.label && <span>{a.label}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-success">{fmt(a.balanceEUR)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" />Linhas de crédito (utilização)</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[420px] overflow-auto">
            {mockCreditLines.map(l => {
              const pct = (l.used / l.contracted) * 100;
              const avail = l.contracted - l.used;
              const critical = pct >= 95;
              return (
                <div key={l.id} className={`rounded-lg border p-3 ${critical ? "border-destructive/40 bg-destructive/5" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-sm font-semibold">{l.bank} · {l.product}</div>
                      <div className="text-[11px] text-muted-foreground">{l.notes}</div>
                    </div>
                    <Badge variant="outline" className={critical ? "border-destructive/40 text-destructive" : ""}>{pct.toFixed(0)}%</Badge>
                  </div>
                  <Progress value={pct} className="h-2 mt-2" />
                  <div className="flex justify-between text-[11px] mt-1">
                    <span className="text-muted-foreground">Usado {fmt(l.used)} / {fmt(l.contracted)}</span>
                    <span className={avail === 0 ? "text-destructive font-medium" : "text-success font-medium"}>Disp. {fmt(avail)}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" />Contas FX (Wise · Revolut)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {fxAccounts.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div>
                  <div className="text-sm font-medium">{a.bank}</div>
                  <div className="text-xs text-muted-foreground">{a.currency} · {a.label}</div>
                </div>
                <div className="text-sm font-bold text-success">{fmt(a.balanceEUR)}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted/30 border p-3 mt-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              Sem exposição cambial ativa — todas as contas FX estão em EUR. Caso surjam saldos GBP/USD, aparecerão aqui.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}