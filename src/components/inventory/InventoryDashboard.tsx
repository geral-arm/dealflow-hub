import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Warehouse, Truck, AlertTriangle, Clock, MapPin, TrendingUp, ShieldAlert } from "lucide-react";
import { mockWarehouses, mockLots, mockShipments, mockIncidents } from "@/data/inventory-mock";

export function InventoryDashboard() {
  const totalStock = mockLots.reduce((s, l) => s + l.quantity, 0);
  const availableStock = mockLots.reduce((s, l) => s + l.availableQty, 0);
  const reservedStock = mockLots.reduce((s, l) => s + l.reservedQty, 0);
  const bondedStock = mockLots.filter(l => l.isBonded).reduce((s, l) => s + l.quantity, 0);
  const expiringLots = mockLots.filter(l => l.daysToExpiry !== undefined && l.daysToExpiry > 0 && l.daysToExpiry <= 30);
  const expiredLots = mockLots.filter(l => l.status === 'expirado');
  const activeShipments = mockShipments.filter(s => ['em_transito', 'em_preparacao', 'carregado', 'agendado'].includes(s.status));
  const delayedShipments = mockShipments.filter(s => s.status === 'atrasado');
  const openIncidents = mockIncidents.filter(i => !i.resolved);
  const totalValue = mockLots.reduce((s, l) => s + l.totalCost, 0);
  const avgOccupancy = mockWarehouses.reduce((s, w) => s + w.occupancyPct, 0) / mockWarehouses.length;

  const kpis = [
    { label: 'Stock Total', value: totalStock.toLocaleString(), sub: `${mockLots.length} lotes`, icon: Package, color: 'text-primary' },
    { label: 'Stock Disponível', value: availableStock.toLocaleString(), sub: `${reservedStock.toLocaleString()} reservado`, icon: TrendingUp, color: 'text-success' },
    { label: 'Armazéns Ativos', value: mockWarehouses.filter(w => w.status === 'ativo').length.toString(), sub: `${avgOccupancy.toFixed(0)}% ocupação média`, icon: Warehouse, color: 'text-info' },
    { label: 'Envios em Curso', value: activeShipments.length.toString(), sub: `${delayedShipments.length} atrasado(s)`, icon: Truck, color: delayedShipments.length > 0 ? 'text-destructive' : 'text-primary' },
    { label: 'Stock Bonded', value: bondedStock.toLocaleString(), sub: `${mockWarehouses.filter(w => w.isBonded).length} armazéns`, icon: ShieldAlert, color: 'text-warning' },
    { label: 'Valor em Stock', value: `€${(totalValue / 1000000).toFixed(2)}M`, sub: `${mockLots.filter(l => l.currency === 'USD').length} lotes em USD`, icon: MapPin, color: 'text-primary' },
    { label: 'Lotes a Expirar', value: expiringLots.length.toString(), sub: `${expiredLots.length} expirado(s)`, icon: Clock, color: expiringLots.length > 0 ? 'text-warning' : 'text-muted-foreground' },
    { label: 'Incidências Abertas', value: openIncidents.length.toString(), sub: `${mockIncidents.filter(i => i.severity === 'alta' || i.severity === 'critica').length} alta/crítica`, icon: AlertTriangle, color: openIncidents.length > 0 ? 'text-destructive' : 'text-success' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold font-display mt-1">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
                </div>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Warehouses Overview */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ocupação por Armazém</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockWarehouses.map((wh) => (
              <div key={wh.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{wh.code}</span>
                    <span className="text-muted-foreground">{wh.city}, {wh.country}</span>
                    {wh.isBonded && <Badge variant="outline" className="text-[9px] px-1 py-0 text-warning border-warning/30">Bonded</Badge>}
                  </div>
                  <span className={`font-medium ${wh.occupancyPct > 80 ? 'text-destructive' : wh.occupancyPct > 60 ? 'text-warning' : 'text-success'}`}>
                    {wh.occupancyPct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${wh.occupancyPct > 80 ? 'bg-destructive' : wh.occupancyPct > 60 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${wh.occupancyPct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Shipments */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Envios Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockShipments.slice(0, 4).map((shp) => {
              const statusColors: Record<string, string> = {
                em_transito: 'bg-primary/20 text-primary',
                atrasado: 'bg-destructive/20 text-destructive',
                entregue: 'bg-success/20 text-success',
                em_preparacao: 'bg-warning/20 text-warning',
              };
              return (
                <div key={shp.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/30">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{shp.shipmentNumber}</span>
                      <Badge className={`text-[9px] px-1.5 py-0 ${statusColors[shp.status] || 'bg-muted text-muted-foreground'}`}>
                        {shp.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {shp.originCountry} → {shp.destinationCountry} • {shp.carrierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{shp.totalPallets} pallets</p>
                    <p className="text-[10px] text-muted-foreground">ETA: {shp.eta}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Alertas Operacionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expiredLots.map(lot => (
              <div key={lot.id} className="flex items-center gap-3 p-2 rounded bg-destructive/5 border border-destructive/20 text-xs">
                <Badge className="bg-destructive/20 text-destructive text-[9px]">Expirado</Badge>
                <span>{lot.product} — Lote {lot.lotNumber} em {lot.warehouseName}</span>
              </div>
            ))}
            {expiringLots.map(lot => (
              <div key={lot.id} className="flex items-center gap-3 p-2 rounded bg-warning/5 border border-warning/20 text-xs">
                <Badge className="bg-warning/20 text-warning text-[9px]">{lot.daysToExpiry}d</Badge>
                <span>{lot.product} — Lote {lot.lotNumber} expira em {lot.daysToExpiry} dias</span>
              </div>
            ))}
            {delayedShipments.map(shp => (
              <div key={shp.id} className="flex items-center gap-3 p-2 rounded bg-destructive/5 border border-destructive/20 text-xs">
                <Badge className="bg-destructive/20 text-destructive text-[9px]">Atrasado</Badge>
                <span>{shp.shipmentNumber} — {shp.originCountry} → {shp.destinationCountry} ({shp.carrierName})</span>
              </div>
            ))}
            {openIncidents.map(inc => (
              <div key={inc.id} className="flex items-center gap-3 p-2 rounded bg-warning/5 border border-warning/20 text-xs">
                <Badge className={`text-[9px] ${inc.severity === 'alta' || inc.severity === 'critica' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                  {inc.severity}
                </Badge>
                <span>{inc.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
