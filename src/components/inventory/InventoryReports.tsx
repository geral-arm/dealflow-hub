import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockWarehouses, mockLots, mockShipments, mockCarriers, mockIncidents } from "@/data/inventory-mock";

export function InventoryReports() {
  // Stock by category
  const byCategory = mockLots.reduce<Record<string, { qty: number; value: number }>>((acc, l) => {
    if (!acc[l.category]) acc[l.category] = { qty: 0, value: 0 };
    acc[l.category].qty += l.quantity;
    acc[l.category].value += l.totalCost;
    return acc;
  }, {});

  // Stock by brand
  const byBrand = mockLots.reduce<Record<string, number>>((acc, l) => {
    acc[l.brand] = (acc[l.brand] || 0) + l.quantity;
    return acc;
  }, {});

  // Stock by country
  const byCountry = mockLots.reduce<Record<string, number>>((acc, l) => {
    acc[l.country] = (acc[l.country] || 0) + l.quantity;
    return acc;
  }, {});

  // Carrier ranking
  const rankedCarriers = [...mockCarriers].sort((a, b) => b.scoreGlobal - a.scoreGlobal);

  const totalValue = mockLots.reduce((s, l) => s + l.totalCost, 0);
  const avgDaysInStorage = mockLots.reduce((s, l) => s + l.daysInStorage, 0) / mockLots.length;
  const bondedValue = mockLots.filter(l => l.isBonded).reduce((s, l) => s + l.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Valor Total em Stock', value: `€${(totalValue / 1000000).toFixed(2)}M` },
          { label: 'Valor Bonded', value: `€${(bondedValue / 1000000).toFixed(2)}M` },
          { label: 'Dias Médios em Armazém', value: avgDaysInStorage.toFixed(0) },
          { label: 'Taxa Incidências', value: `${((mockIncidents.length / Math.max(mockShipments.length, 1)) * 100).toFixed(0)}%` },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className="text-lg font-bold font-display">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* By Category */}
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Stock por Categoria</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byCategory).sort((a, b) => b[1].value - a[1].value).map(([cat, data]) => (
              <div key={cat} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                <span className="font-medium">{cat}</span>
                <div className="text-right">
                  <span className="text-muted-foreground">{data.qty.toLocaleString()} un</span>
                  <span className="ml-3 font-medium">€{data.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Brand */}
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Stock por Marca</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byBrand).sort((a, b) => b[1] - a[1]).map(([brand, qty]) => {
              const pct = (qty / mockLots.reduce((s, l) => s + l.quantity, 0)) * 100;
              return (
                <div key={brand} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{brand}</span>
                    <span>{qty.toLocaleString()} un ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* By Country */}
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Stock por País</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byCountry).sort((a, b) => b[1] - a[1]).map(([country, qty]) => (
              <div key={country} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                <span className="font-medium">{country}</span>
                <span>{qty.toLocaleString()} un</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Carrier Ranking */}
        <Card className="border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm">Ranking de Transportadoras</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {rankedCarriers.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${i === 0 ? 'text-warning' : ''}`}>#{i + 1}</span>
                  <span className="font-medium">{c.name}</span>
                  <Badge className={`text-[9px] ${c.status === 'preferencial' ? 'bg-success/20 text-success' : c.status === 'em_observacao' ? 'bg-warning/20 text-warning' : 'bg-info/20 text-info'}`}>{c.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">OTIF {c.onTimeRate}%</span>
                  <span className="font-bold">{c.scoreGlobal}/100</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
