import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LOTS, computeLotMetrics, fmtEur, fmtInt, fmtPct, DEAL_STATUS_BADGE } from "@/data/dealsData";
import { Search } from "lucide-react";

interface Props { onOpenLot: (lotNumber: string) => void }

export function LotsDirectory({ onOpenLot }: Props) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return LOTS
      .filter((l) => !k || [l.lotNumber, l.product, l.supplier, l.warehouse].join(" ").toLowerCase().includes(k))
      .map((lot) => ({ lot, m: computeLotMetrics(lot) }));
  }, [q]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Procurar por lote, produto, fornecedor, armazém…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Armazém</TableHead>
                <TableHead className="text-right">Compradas</TableHead>
                <TableHead className="w-[180px]">Stock vendido</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead>Sub-lotes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ lot, m }) => (
                <TableRow key={lot.lotNumber} className="cursor-pointer" onClick={() => onOpenLot(lot.lotNumber)}>
                  <TableCell>
                    <div className="font-mono text-xs font-semibold">{lot.lotNumber}</div>
                    <div className="text-[10px] text-muted-foreground">{lot.month}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{lot.product}</div>
                    <div className="text-[10px] text-muted-foreground">{lot.size}</div>
                  </TableCell>
                  <TableCell className="text-xs">{lot.supplier}<div className="text-[10px] text-muted-foreground">{lot.countryOfSupplier}</div></TableCell>
                  <TableCell className="text-xs">{lot.warehouse}<div className="text-[10px] text-muted-foreground">{lot.countryOfStock}</div></TableCell>
                  <TableCell className="text-right text-xs">{fmtInt(lot.totalCasesBought)}</TableCell>
                  <TableCell>
                    <Progress value={m.pctSold * 100} className="h-2" />
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {fmtInt(m.casesSoldTotal)} vendidas · {m.casesRemaining === 0 ? "esgotado" : `${fmtInt(m.casesRemaining)} restantes`}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs">{fmtEur(m.revenueRealized)}</TableCell>
                  <TableCell className="text-right text-xs">
                    <span className={m.marginPct < 0.02 ? "text-destructive" : "text-success"}>{fmtPct(m.marginPct)}</span>
                    {m.marginPending > 0 && <div className="text-[10px] text-warning">+{fmtEur(m.marginPending)} pend.</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(["Concluded","Unpaid","Ongoing","Perspective","Canceled"] as const).map((st) => {
                        const n = m.subLotsByStatus[st];
                        if (!n) return null;
                        return <Badge key={st} variant="outline" className={`text-[10px] ${DEAL_STATUS_BADGE[st]}`}>{n}</Badge>;
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}