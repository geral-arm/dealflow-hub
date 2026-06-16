import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Truck, Package, Calendar, Building2 } from "lucide-react";
import { LOTS, computeLotMetrics, fmtEur, fmtInt, fmtPct, DEAL_STATUS_BADGE, DEAL_STATUS_LABEL } from "@/data/dealsData";

interface Props { lotNumber: string; onBack: () => void }

export function LotDetail({ lotNumber, onBack }: Props) {
  const lot = useMemo(() => LOTS.find((l) => l.lotNumber === lotNumber), [lotNumber]);
  if (!lot) return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
      <p className="text-sm text-muted-foreground">Lote não encontrado.</p>
    </div>
  );
  const m = computeLotMetrics(lot);
  const sold = m.pctSold * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Lotes
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold">{lot.lotNumber}</h2>
            <Badge variant="outline">{lot.month}</Badge>
            {m.casesRemaining === 0 && <Badge className="bg-success/15 text-success border-success/30">100% vendido</Badge>}
          </div>
          <div className="text-sm mt-1">{lot.product} <span className="text-muted-foreground">· {lot.size}</span></div>
          <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> Fornecedor: {lot.supplier} ({lot.countryOfSupplier})</span>
            <span className="inline-flex items-center gap-1"><Package className="h-3 w-3" /> Stock: {lot.warehouse} ({lot.countryOfStock})</span>
            {lot.bbd && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> BBD: {lot.bbd}</span>}
          </div>
        </div>
      </div>

      {/* KPIs do lote */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Caixas compradas", v: `${fmtInt(lot.totalCasesBought)} (${lot.totalPallets} palettes)`, s: `Custo: ${fmtEur(lot.purchaseAmount)}` },
          { l: "Caixas vendidas", v: fmtInt(m.casesSoldTotal), s: `${fmtPct(m.pctSold)} do camião` },
          { l: "Stock por vender", v: fmtInt(m.casesRemaining), s: m.casesRemaining === 0 ? "Esgotado" : "alvo comercial" },
          { l: "Margem realizada", v: fmtEur(m.marginRealized), s: m.marginPending > 0 ? `+${fmtEur(m.marginPending)} pendente` : "—" },
        ].map((k) => (
          <Card key={k.l} className="border-border/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.l}</div>
              <div className="font-display text-xl font-bold mt-1">{k.v}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{k.s}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barra de stock */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Stock do lote</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">{fmtInt(m.casesSoldTotal)} vendidas</span>
            <span className="text-muted-foreground">{fmtInt(m.casesRemaining)} por vender</span>
          </div>
          <Progress value={sold} className="h-3" />
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(["Concluded","Unpaid","Ongoing","Perspective","Canceled"] as const).map((st) => {
              const n = m.subLotsByStatus[st];
              if (!n) return null;
              return <Badge key={st} variant="outline" className={`text-[11px] ${DEAL_STATUS_BADGE[st]}`}>{n} · {DEAL_STATUS_LABEL[st]}</Badge>;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pagamento ao fornecedor */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Compra & pagamento ao fornecedor</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-3 text-xs">
          <Field label="Proforma" value={lot.proforma ?? "—"} />
          <Field label="Fatura final" value={lot.finalInvoice ?? "—"} />
          <Field label="Preço/caixa" value={fmtEur(lot.finalBuyPrice)} />
          <Field label="Total compra" value={fmtEur(lot.purchaseAmount)} />
          <Field label="Pago" value={fmtEur(lot.paymentToSupplier.paid)} tone={lot.paymentToSupplier.pending === 0 ? "success" : undefined} />
          <Field label="Pendente" value={fmtEur(lot.paymentToSupplier.pending)} tone={lot.paymentToSupplier.pending > 0 ? "warning" : undefined} />
          <Field label="Modo" value={lot.paymentToSupplier.mode ?? "—"} />
          <Field label="Banco" value={lot.paymentToSupplier.bank ?? "—"} />
        </CardContent>
      </Card>

      {/* Sub-lotes */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Sub-lotes (vendas parciais)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub-lote</TableHead>
                <TableHead>Sabor</TableHead>
                <TableHead className="text-right">Caixas</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead className="text-right">Preço/caixa</TableHead>
                <TableHead className="text-right">Total venda</TableHead>
                <TableHead className="text-right">Pendente cobrar</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lot.subLots.map((s) => (
                <TableRow key={s.subLotNumber}>
                  <TableCell className="font-mono text-[11px]">{s.subLotNumber}</TableCell>
                  <TableCell className="text-xs">{s.flavour ?? "—"}</TableCell>
                  <TableCell className="text-right text-xs">{fmtInt(s.casesSold)}<div className="text-[10px] text-muted-foreground">{s.pallets} plt</div></TableCell>
                  <TableCell className="text-xs">{s.customer}{s.customerCode && <div className="text-[10px] text-muted-foreground">{s.customerCode}</div>}</TableCell>
                  <TableCell className="text-xs">{s.deliveryPlace ?? "—"}<div className="text-[10px] text-muted-foreground">{s.countryOfDelivery}</div></TableCell>
                  <TableCell className="text-right text-xs">{s.sellPricePerCase ? fmtEur(s.sellPricePerCase) : "—"}</TableCell>
                  <TableCell className="text-right text-xs">{s.totalSell ? fmtEur(s.totalSell) : "—"}</TableCell>
                  <TableCell className="text-right text-xs">
                    <span className={s.pendingSale > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {s.pendingSale ? fmtEur(s.pendingSale) : "0"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {s.marginReceived > 0 && <div className="text-success">{fmtEur(s.marginReceived)}</div>}
                    {s.marginToReceive - s.marginReceived > 0 && (
                      <div className="text-[10px] text-warning">+{fmtEur(s.marginToReceive - s.marginReceived)}</div>
                    )}
                    {s.marginToReceive === 0 && s.marginReceived === 0 && <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground max-w-[180px]">{s.deliveryStatus}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${DEAL_STATUS_BADGE[s.dealStatus]}`}>{DEAL_STATUS_LABEL[s.dealStatus]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transporte & Logística agregados */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Truck className="h-4 w-4" /> Transporte & Logística</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub-lote</TableHead>
                <TableHead>Transportador</TableHead>
                <TableHead>CMR</TableHead>
                <TableHead className="text-right">Custo transp.</TableHead>
                <TableHead className="text-right">Pago</TableHead>
                <TableHead className="text-right">Pendente</TableHead>
                <TableHead>Logística</TableHead>
                <TableHead className="text-right">Outros custos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lot.subLots.map((s) => (
                <TableRow key={s.subLotNumber}>
                  <TableCell className="font-mono text-[11px]">{s.subLotNumber}</TableCell>
                  <TableCell className="text-xs">{s.transport.transporter ?? "—"}{s.transport.plate && <div className="text-[10px] text-muted-foreground">{s.transport.plate}</div>}</TableCell>
                  <TableCell className="text-xs">{s.transport.cmr ?? "—"}</TableCell>
                  <TableCell className="text-right text-xs">{fmtEur(s.transport.cost)}</TableCell>
                  <TableCell className="text-right text-xs">{fmtEur(s.transport.paid)}</TableCell>
                  <TableCell className="text-right text-xs">
                    <span className={s.transport.pending > 0 ? "text-warning" : "text-muted-foreground"}>{fmtEur(s.transport.pending)}</span>
                  </TableCell>
                  <TableCell className="text-xs">{s.logistics.issuer ?? "—"}</TableCell>
                  <TableCell className="text-right text-xs">{fmtEur(s.logistics.otherCosts)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`font-medium mt-0.5 ${cls}`}>{value}</div>
    </div>
  );
}