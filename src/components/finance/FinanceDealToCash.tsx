import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockFinanceDeals, mockCashFlow, mockBankAccounts, FINANCE_TOTALS, UNPAID_2026_TOTAL } from "@/data/finance-mock";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, PackageCheck, Truck, Banknote,
  CircleDollarSign, FileText, ShieldAlert, ArrowRight, Phone, Mail, Scale,
} from "lucide-react";
import { FinanceDeal } from "@/types/finance";

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

type TimelineEvent = {
  date: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail?: string;
  amount?: number;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
  status?: string;
};

const toneClasses: Record<TimelineEvent["tone"], string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger:  "bg-destructive/10 text-destructive border-destructive/30",
  info:    "bg-primary/10 text-primary border-primary/30",
};

function buildTimeline(deal: FinanceDeal): TimelineEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  const flows = mockCashFlow.filter(f => f.dealId === deal.id);
  const events: TimelineEvent[] = [];

  events.push({
    date: deal.orderDate,
    icon: FileText,
    title: "Order confirmado",
    detail: `${deal.product} • Fornecedor: ${deal.supplier}`,
    tone: "info",
  });

  // Supplier payment (from cashflow if available)
  const supplierPay = flows.find(f => f.type === "supplier_payment");
  if (supplierPay) {
    events.push({
      date: supplierPay.date,
      icon: Banknote,
      title: `Pagamento a fornecedor (${supplierPay.counterparty})`,
      detail: `Banco: ${mockBankAccounts.find(b => b.id === supplierPay.bankId)?.bank ?? "—"}`,
      amount: supplierPay.amount,
      tone: supplierPay.status === "executed" ? "success" : "warning",
      status: supplierPay.status,
    });
  } else {
    events.push({
      date: deal.orderDate,
      icon: Banknote,
      title: "Pagamento a fornecedor (estimado)",
      amount: -deal.buyPrice,
      tone: "neutral",
    });
  }

  events.push({
    date: deal.orderDate,
    icon: Truck,
    title: "Logística & transporte",
    amount: -deal.logistics,
    tone: "neutral",
  });

  events.push({
    date: deal.orderDate,
    icon: PackageCheck,
    title: "Entrega ao cliente",
    detail: `${deal.client} • ${deal.market}`,
    tone: "info",
  });

  const clientFlow = flows.find(f => f.type === "client_receivable");
  const isOverdue = deal.status === "unpaid" || (clientFlow?.status === "overdue");
  events.push({
    date: deal.actualPaymentDate ?? deal.expectedPaymentDate,
    icon: isOverdue ? AlertTriangle : (deal.status === "concluded" ? CheckCircle2 : Clock),
    title: deal.status === "concluded" ? "Recebimento confirmado" : isOverdue ? "Recebimento em ATRASO" : "Recebimento previsto",
    detail: `${deal.client}${clientFlow ? ` • Banco: ${mockBankAccounts.find(b => b.id === clientFlow.bankId)?.bank ?? "—"}` : ""}`,
    amount: deal.sellPrice,
    tone: isOverdue ? "danger" : deal.status === "concluded" ? "success" : "warning",
    status: clientFlow?.status ?? (isOverdue ? "overdue" : "scheduled"),
  });

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function buildBlockers(deal: FinanceDeal) {
  const margin = deal.sellPrice - deal.buyPrice - deal.logistics;
  const marginPct = deal.sellPrice ? (margin / deal.sellPrice) * 100 : 0;
  const today = new Date().toISOString().slice(0, 10);
  const daysLate = -daysBetween(today, deal.expectedPaymentDate);
  const blockers: { icon: React.ComponentType<{ className?: string }>; label: string; severity: "critical" | "warning" | "info" }[] = [];

  if (deal.status === "unpaid" || daysLate > 0) {
    blockers.push({ icon: AlertTriangle, label: `Recebimento atrasado ${daysLate} dias — cash preso ${fmt(deal.sellPrice)}`, severity: "critical" });
  }
  if (marginPct < 2 && deal.status !== "canceled") {
    blockers.push({ icon: ShieldAlert, label: `Margem crítica (${marginPct.toFixed(1)}%) — abaixo do mínimo 2%`, severity: "critical" });
  } else if (marginPct < 5 && deal.status !== "canceled") {
    blockers.push({ icon: ShieldAlert, label: `Margem baixa (${marginPct.toFixed(1)}%) — abaixo do target 5%`, severity: "warning" });
  }
  if (deal.status === "canceled") {
    blockers.push({ icon: AlertTriangle, label: "Deal cancelado — buy price não recuperado", severity: "critical" });
  }
  if (daysLate > 30) {
    blockers.push({ icon: Scale, label: "Elegível para escalar a advogado / penalização contratual", severity: "warning" });
  }
  return blockers;
}

function buildActions(deal: FinanceDeal) {
  const today = new Date().toISOString().slice(0, 10);
  const daysLate = -daysBetween(today, deal.expectedPaymentDate);
  const margin = deal.sellPrice - deal.buyPrice - deal.logistics;
  const marginPct = deal.sellPrice ? (margin / deal.sellPrice) * 100 : 0;
  const actions: { icon: React.ComponentType<{ className?: string }>; label: string; cta: string }[] = [];

  if (daysLate > 0) {
    actions.push({ icon: Phone, label: `Ligar a ${deal.client} para confirmar data de pagamento`, cta: "Registar chamada" });
    actions.push({ icon: Mail, label: "Enviar reminder formal com extrato + penalização", cta: "Gerar email" });
  }
  if (daysLate > 21) {
    actions.push({ icon: Scale, label: "Escalar para advogado / iniciar processo de cobrança", cta: "Abrir caso" });
  }
  if (marginPct < 2 && deal.status !== "canceled" && deal.status !== "unpaid") {
    actions.push({ icon: CircleDollarSign, label: "Renegociar buy price com fornecedor ou subir sell price", cta: "Iniciar revisão" });
  }
  if (deal.status === "ongoing" && daysLate <= 0) {
    actions.push({ icon: CheckCircle2, label: "Confirmar PoD (Proof of Delivery) e fatura enviada", cta: "Validar" });
  }
  if (actions.length === 0) {
    actions.push({ icon: CheckCircle2, label: "Nenhuma ação requerida — deal saudável", cta: "—" });
  }
  return actions;
}

function DealDrillDown({ deal, onClose }: { deal: FinanceDeal | null; onClose: () => void }) {
  if (!deal) return null;
  const margin = deal.sellPrice - deal.buyPrice - deal.logistics;
  const marginPct = deal.sellPrice ? (margin / deal.sellPrice) * 100 : 0;
  const today = new Date().toISOString().slice(0, 10);
  const daysLate = -daysBetween(today, deal.expectedPaymentDate);
  const dtc = deal.daysToCash ?? daysBetween(deal.orderDate, deal.expectedPaymentDate);

  const liquidity = FINANCE_TOTALS.liquidity;
  const cashIfReceived = liquidity + deal.sellPrice;
  const cashIfLost = liquidity - (deal.buyPrice + deal.logistics);

  const timeline = buildTimeline(deal);
  const blockers = buildBlockers(deal);
  const actions = buildActions(deal);

  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="font-mono">{deal.reference}</DialogTitle>
            <Badge className={statusColors[deal.status]}>{deal.status}</Badge>
          </div>
          <DialogDescription>
            {deal.client} • {deal.market} — {deal.product} • Fornecedor: {deal.supplier}
          </DialogDescription>
        </DialogHeader>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-md border p-3"><div className="text-[10px] uppercase text-muted-foreground">Venda</div><div className="text-lg font-bold">{fmt(deal.sellPrice)}</div></div>
          <div className="rounded-md border p-3"><div className="text-[10px] uppercase text-muted-foreground">Margem</div><div className={`text-lg font-bold ${marginPct < 2 ? "text-destructive" : marginPct < 5 ? "text-warning" : "text-success"}`}>{fmt(margin)}</div><div className="text-[10px] text-muted-foreground">{marginPct.toFixed(1)}%</div></div>
          <div className="rounded-md border p-3"><div className="text-[10px] uppercase text-muted-foreground">Days to cash</div><div className="text-lg font-bold">{dtc}d</div></div>
          <div className="rounded-md border p-3"><div className="text-[10px] uppercase text-muted-foreground">Atraso</div><div className={`text-lg font-bold ${daysLate > 0 ? "text-destructive" : "text-success"}`}>{daysLate > 0 ? `+${daysLate}d` : "—"}</div></div>
        </div>

        {/* Cash available impact */}
        <Card className="border-primary/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CircleDollarSign className="h-4 w-4" /> Impacto na liquidez disponível</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Liquidez atual</span><span className="font-mono">{fmt(liquidity)}</span></div>
            <div className="flex justify-between text-success"><span>Se este deal liquidar →</span><span className="font-mono font-semibold">{fmt(cashIfReceived)}</span></div>
            <div className="flex justify-between text-destructive"><span>Se for incobrável →</span><span className="font-mono font-semibold">{fmt(cashIfLost)}</span></div>
            <Progress value={Math.min(100, (deal.sellPrice / Math.max(liquidity, 1)) * 100)} className="h-1.5 mt-2" />
            <div className="text-[10px] text-muted-foreground">Este deal representa {((deal.sellPrice / Math.max(liquidity, 1)) * 100).toFixed(0)}% da liquidez atual</div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Timeline do deal</CardTitle></CardHeader>
          <CardContent>
            <div className="relative pl-4 space-y-3 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-border">
              {timeline.map((ev, i) => {
                const Icon = ev.icon;
                return (
                  <div key={i} className="relative">
                    <div className={`absolute -left-4 top-1 h-3 w-3 rounded-full border-2 ${toneClasses[ev.tone]}`} />
                    <div className="flex items-start justify-between gap-3 pl-3">
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{ev.title}</div>
                          {ev.detail && <div className="text-xs text-muted-foreground">{ev.detail}</div>}
                          <div className="text-[10px] text-muted-foreground mt-0.5">{ev.date}{ev.status ? ` • ${ev.status}` : ""}</div>
                        </div>
                      </div>
                      {typeof ev.amount === "number" && (
                        <div className={`text-sm font-mono font-semibold ${ev.amount < 0 ? "text-destructive" : "text-success"}`}>
                          {ev.amount < 0 ? "" : "+"}{fmt(ev.amount)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Blockers & alerts */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Bloqueios & alertas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {blockers.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Sem bloqueios detetados</div>
            ) : blockers.map((b, i) => {
              const Icon = b.icon;
              const cls = b.severity === "critical" ? "border-destructive/40 bg-destructive/5 text-destructive"
                : b.severity === "warning" ? "border-warning/40 bg-warning/5 text-warning"
                : "border-primary/40 bg-primary/5 text-primary";
              return (
                <div key={i} className={`flex items-start gap-2 rounded-md border p-2 text-sm ${cls}`}>
                  <Icon className="h-4 w-4 mt-0.5" />
                  <span>{b.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recommended actions */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Ações recomendadas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
                  <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" /><span>{a.label}</span></div>
                  {a.cta !== "—" && <Button size="sm" variant="outline">{a.cta}</Button>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export function FinanceDealToCash() {
  const today = new Date().toISOString().slice(0, 10);
  const [selected, setSelected] = useState<FinanceDeal | null>(null);
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
                  <div key={d.id} onClick={() => setSelected(d)} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 cursor-pointer hover:bg-destructive/10 transition">
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
                  <TableRow key={d.id} onClick={() => setSelected(d)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-primary underline-offset-2 hover:underline">{d.reference}</TableCell>
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

      <DealDrillDown deal={selected} onClose={() => setSelected(null)} />
    </div>
  );
}