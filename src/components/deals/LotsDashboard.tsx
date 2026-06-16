import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LOTS, computeLotMetrics, fmtEur, fmtInt, fmtPct, DEAL_STATUS_BADGE } from "@/data/dealsData";
import { Package, TrendingUp, AlertTriangle, Boxes } from "lucide-react";

interface Props { onOpenLot: (lotNumber: string) => void }

export function LotsDashboard({ onOpenLot }: Props) {
  const summary = useMemo(() => {
    const lots = LOTS.map((l) => ({ lot: l, m: computeLotMetrics(l) }));
    const totalPurchase = lots.reduce((a, x) => a + x.lot.purchaseAmount, 0);
    const totalRevenue = lots.reduce((a, x) => a + x.m.revenueRealized, 0);
    const totalMarginR = lots.reduce((a, x) => a + x.m.marginRealized, 0);
    const totalMarginP = lots.reduce((a, x) => a + x.m.marginPending, 0);
    const casesBought = lots.reduce((a, x) => a + x.lot.totalCasesBought, 0);
    const casesSold = lots.reduce((a, x) => a + x.m.casesSoldTotal, 0);
    const casesRem = lots.reduce((a, x) => a + x.m.casesRemaining, 0);
    const unpaidCount = lots.reduce((a, x) => a + x.m.subLotsByStatus.Unpaid, 0);
    return { lots, totalPurchase, totalRevenue, totalMarginR, totalMarginP, casesBought, casesSold, casesRem, unpaidCount };
  }, []);

  const kpis = [
    { label: "Caixas compradas", value: fmtInt(summary.casesBought), icon: Package, sub: `${LOTS.length} lotes ativos` },
    { label: "Caixas vendidas", value: fmtInt(summary.casesSold), icon: TrendingUp, sub: fmtPct(summary.casesSold / Math.max(1, summary.casesBought)) + " do stock" },
    { label: "Stock por vender", value: fmtInt(summary.casesRem), icon: Boxes, sub: "alvo comercial" },
    { label: "Margem pendente", value: fmtEur(summary.totalMarginP), icon: AlertTriangle, sub: `${summary.unpaidCount} sub-lotes Unpaid` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-display text-2xl font-bold mt-2">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lotes (camiões comprados) — stock vs. vendido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {summary.lots.map(({ lot, m }) => {
            const sold = m.pctSold * 100;
            return (
              <button
                key={lot.lotNumber}
                onClick={() => onOpenLot(lot.lotNumber)}
                className="w-full text-left rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-colors p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold">{lot.lotNumber}</span>
                      <Badge variant="outline" className="text-[10px]">{lot.month}</Badge>
                      <span className="text-xs text-muted-foreground">{lot.supplier} · {lot.countryOfSupplier}</span>
                    </div>
                    <div className="text-sm mt-1">{lot.product} <span className="text-muted-foreground">· {lot.size}</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Stock: {lot.warehouse} ({lot.countryOfStock})</div>
                  </div>
                  <div className="text-right text-xs space-y-0.5">
                    <div>Compra: <span className="font-semibold text-foreground">{fmtEur(lot.purchaseAmount)}</span></div>
                    <div>Venda realizada: <span className="font-semibold text-foreground">{fmtEur(m.revenueRealized)}</span></div>
                    <div>Margem: <span className={`font-semibold ${m.marginPct < 0.02 ? 'text-destructive' : 'text-success'}`}>{fmtPct(m.marginPct)}</span>
                      {m.marginPending > 0 && <span className="text-warning"> · pendente {fmtEur(m.marginPending)}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">
                      Vendido {fmtInt(m.casesSoldTotal)} / {fmtInt(lot.totalCasesBought)} caixas
                    </span>
                    <span className={m.casesRemaining === 0 ? "text-success font-semibold" : "text-muted-foreground"}>
                      {m.casesRemaining === 0 ? "Esgotado · 100% vendido" : `${fmtInt(m.casesRemaining)} por vender`}
                    </span>
                  </div>
                  <Progress value={sold} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(["Concluded","Unpaid","Ongoing","Perspective","Canceled"] as const).map((st) => {
                    const n = m.subLotsByStatus[st];
                    if (!n) return null;
                    return (
                      <Badge key={st} variant="outline" className={`text-[10px] ${DEAL_STATUS_BADGE[st]}`}>
                        {n} {st}
                      </Badge>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}