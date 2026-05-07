import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockBankAccounts } from "@/data/finance-mock";
import { Building2, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinanceCashPosition() {
  const liquid = mockBankAccounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balanceEUR, 0);
  const debt = mockBankAccounts.filter(a => a.balance < 0).reduce((s, a) => s + Math.abs(a.balanceEUR), 0);
  const net = liquid - debt;
  const debtCeiling = 2500000;
  const debtPct = (debt / debtCeiling) * 100;

  const byCountry = mockBankAccounts.reduce<Record<string, { liquid: number; debt: number }>>((acc, a) => {
    acc[a.country] = acc[a.country] || { liquid: 0, debt: 0 };
    if (a.balance >= 0) acc[a.country].liquid += a.balanceEUR;
    else acc[a.country].debt += Math.abs(a.balanceEUR);
    return acc;
  }, {});

  const fxAccounts = mockBankAccounts.filter(a => a.type === "fx");

  const lightLabel = net > 0 ? "Posição saudável" : net > -500000 ? "Atenção — buffer reduzido" : "Crítico — risco de liquidez";
  const lightClass = net > 0 ? "text-success border-success/40" : net > -500000 ? "text-warning border-warning/40" : "text-destructive border-destructive/40";
  const lightTextClass = net > 0 ? "text-success" : net > -500000 ? "text-warning" : "text-destructive";

  return (
    <div className="space-y-6 mt-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Liquidez total</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{fmt(liquid)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1"><ArrowUpRight className="h-3 w-3 mr-1 text-success" />+8.2% vs semana anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Dívida total</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{fmt(debt)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1"><ArrowDownRight className="h-3 w-3 mr-1 text-destructive" />utilização linhas {debtPct.toFixed(0)}%</div>
            <Progress value={debtPct} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Posição líquida</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lightTextClass}`}>{fmt(net)}</div>
            <Badge variant="outline" className={`mt-1 ${lightClass}`}>{lightLabel}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Bancos ativos</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(mockBankAccounts.map(a => a.bank)).size}</div>
            <div className="text-xs text-muted-foreground mt-1">{mockBankAccounts.length} contas em 5 países</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Consolidação por país</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(byCountry).map(([country, v]) => (
              <div key={country} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{country === "GLOBAL" ? "🌍 Global / FX" : country}</span>
                  <Badge variant="outline" className="text-[10px]">{fmt(v.liquid - v.debt)}</Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Liquidez</span><span className="text-success font-medium">{fmt(v.liquid)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dívida</span><span className="text-destructive font-medium">{fmt(v.debt)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4" />Contas bancárias</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-auto">
            {mockBankAccounts.filter(a => a.type !== "fx").map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">{a.bank}</div>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <Badge variant="outline" className="text-[10px] py-0">{a.country}</Badge>
                    <Badge variant="outline" className="text-[10px] py-0 capitalize">{a.type}</Badge>
                    {a.creditLimit && <span>linha {fmt(a.creditLimit)}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${a.balance >= 0 ? "text-success" : "text-destructive"}`}>{fmt(a.balanceEUR)}</div>
                  {a.creditLimit && <div className="text-[10px] text-muted-foreground">{((a.used! / a.creditLimit) * 100).toFixed(0)}% usado</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" />Contas FX (Revolut & Wise)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {fxAccounts.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div>
                  <div className="text-sm font-medium">{a.bank}</div>
                  <div className="text-xs text-muted-foreground">{a.currency} • Internacional</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{new Intl.NumberFormat("pt-PT", { style: "currency", currency: a.currency, maximumFractionDigits: 0 }).format(a.balance)}</div>
                  <div className="text-[10px] text-muted-foreground">≈ {fmt(a.balanceEUR)}</div>
                </div>
              </div>
            ))}
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3 mt-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs text-foreground">
                <strong>Exposição FX:</strong> GBP {fmt(44950)} • USD {fmt(14100)}. Considera hedging se exposição GBP exceder €100k.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}