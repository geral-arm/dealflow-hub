import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOpportunities, mockSuppliers, mockPurchaseOrders, mockEvaluations } from "@/data/procurement-mock";
import { OPPORTUNITY_STATUS_CONFIG } from "@/types/procurement";
import { BarChart3, PieChart, TrendingUp, Package } from "lucide-react";

export function ProcurementReports() {
  // Stats
  const oppsByStatus = Object.entries(OPPORTUNITY_STATUS_CONFIG).map(([status, cfg]) => ({
    status, label: cfg.label, count: mockOpportunities.filter(o => o.status === status).length
  })).filter(s => s.count > 0);

  const totalPOValue = mockPurchaseOrders.reduce((s, po) => s + po.totalValue, 0);
  const avgScore = mockEvaluations.reduce((s, e) => s + e.globalScore, 0) / mockEvaluations.length;

  const byCategory = mockOpportunities.reduce((acc, o) => {
    acc[o.category] = (acc[o.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byCountry = mockSuppliers.reduce((acc, s) => {
    acc[s.country] = (acc[s.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byBrand = mockOpportunities.reduce((acc, o) => {
    acc[o.brand] = (acc[o.brand] || 0) + (o.buyPrice * o.quantityAvailable);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Relatórios Procurement</h2>
        <p className="text-sm text-muted-foreground">Análise da operação de sourcing e compras</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-shadow"><CardContent className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">Total POs Emitidas</p>
          <p className="text-2xl font-display font-bold text-foreground">{mockPurchaseOrders.length}</p>
          <p className="text-sm text-muted-foreground">€{totalPOValue.toLocaleString()} valor total</p>
        </CardContent></Card>
        <Card className="card-shadow"><CardContent className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">Score Médio Fornecedores</p>
          <p className="text-2xl font-display font-bold text-foreground">{avgScore.toFixed(0)}/100</p>
          <p className="text-sm text-muted-foreground">{mockSuppliers.length} fornecedores ativos</p>
        </CardContent></Card>
        <Card className="card-shadow"><CardContent className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">Oportunidades Registadas</p>
          <p className="text-2xl font-display font-bold text-foreground">{mockOpportunities.length}</p>
          <p className="text-sm text-muted-foreground">{mockOpportunities.filter(o => o.status === 'convertida').length} convertidas</p>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Opp by status */}
        <Card className="card-shadow">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Oportunidades por Estado</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {oppsByStatus.map(s => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{s.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(s.count / mockOpportunities.length) * 100}%` }} /></div>
                  <span className="text-sm font-medium text-foreground w-6 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By category */}
        <Card className="card-shadow">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><PieChart className="h-4 w-4 text-primary" /> Oportunidades por Categoria</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: `${(count / mockOpportunities.length) * 100}%` }} /></div>
                  <span className="text-sm font-medium text-foreground w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By country */}
        <Card className="card-shadow">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Fornecedores por País</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byCountry).map(([country, count]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{country}</span>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By brand value */}
        <Card className="card-shadow">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Volume por Marca (€)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byBrand).sort((a, b) => b[1] - a[1]).map(([brand, value]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{brand}</span>
                <span className="text-sm font-medium text-foreground">€{(value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
