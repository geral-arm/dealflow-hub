import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockQuotes } from "@/data/procurement-mock";
import { CheckCircle, AlertTriangle, Clock, Trophy } from "lucide-react";

export function ProcurementQuotes() {
  // Group by product
  const grouped = mockQuotes.reduce((acc, q) => {
    const key = q.product;
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {} as Record<string, typeof mockQuotes>);

  const isExpiringSoon = (date: string) => {
    const diff = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 5 && diff > 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Comparador de Cotações</h2>
        <p className="text-sm text-muted-foreground">Compare ofertas de diferentes fornecedores para o mesmo produto</p>
      </div>

      {Object.entries(grouped).map(([product, quotes]) => {
        const bestPrice = Math.min(...quotes.map(q => q.estimatedLandedCost));
        const bestMargin = Math.max(...quotes.map(q => q.estimatedMarginPct));
        return (
          <Card key={product} className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{product}</CardTitle>
              <p className="text-xs text-muted-foreground">{quotes[0].brand} · {quotes.length} cotações</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Fornecedor</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Preço Unit.</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Custo Logístico</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Landed Cost</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Margem Est.</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Incoterm</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Lead Time</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Localização</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Score</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Pagamento</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">Expira</th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.sort((a, b) => a.estimatedLandedCost - b.estimatedLandedCost).map(q => {
                      const isBestPrice = q.estimatedLandedCost === bestPrice;
                      const isBestMargin = q.estimatedMarginPct === bestMargin;
                      const expiring = isExpiringSoon(q.offerExpiry);
                      return (
                        <tr key={q.id} className={`border-b transition-colors ${q.isWinner ? 'bg-success/5' : 'hover:bg-muted/30'}`}>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {q.isWinner && <Trophy className="h-4 w-4 text-accent" />}
                              <div>
                                <p className="font-medium text-foreground">{q.supplierName}</p>
                                <p className="text-xs text-muted-foreground">MOQ: {q.moq}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground">{q.currency} {q.unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-3 text-foreground">€{q.estimatedLogisticsCost.toFixed(2)}</td>
                          <td className="px-3 py-3">
                            <span className={`font-medium ${isBestPrice ? 'text-success' : 'text-foreground'}`}>€{q.estimatedLandedCost.toFixed(2)}</span>
                            {isBestPrice && <CheckCircle className="h-3 w-3 text-success inline ml-1" />}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`font-medium ${isBestMargin ? 'text-success' : q.estimatedMarginPct < 5 ? 'text-destructive' : 'text-foreground'}`}>{q.estimatedMarginPct}%</span>
                          </td>
                          <td className="px-3 py-3 text-foreground">{q.incoterm}</td>
                          <td className="px-3 py-3 text-foreground">{q.leadTimeDays} dias</td>
                          <td className="px-3 py-3 text-foreground">{q.location}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: `${q.supplierScore}%` }} /></div>
                              <span className="text-xs text-foreground">{q.supplierScore}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-foreground">{q.paymentTerms}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {expiring && <AlertTriangle className="h-3 w-3 text-destructive" />}
                              <span className={`text-xs ${expiring ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{q.offerExpiry}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">{q.isWinner && <Badge className="bg-success/20 text-success text-xs">Vencedor</Badge>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
