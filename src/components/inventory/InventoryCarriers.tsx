import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, X, Star, Truck, Ship, Plane } from "lucide-react";
import { mockCarriers } from "@/data/inventory-mock";
import { CARRIER_STATUS_CONFIG } from "@/types/inventory";
import type { Carrier } from "@/types/inventory";

const transportLabels: Record<string, { label: string; icon: typeof Truck }> = {
  rodoviario: { label: 'Rodoviário', icon: Truck },
  maritimo: { label: 'Marítimo', icon: Ship },
  aereo: { label: 'Aéreo', icon: Plane },
  multimodal: { label: 'Multimodal', icon: Truck },
};

export function InventoryCarriers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Carrier | null>(null);

  const filtered = mockCarriers.filter(c =>
    `${c.name} ${c.country} ${c.marketsCovered.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-xs"><X className="h-3 w-3 mr-1" /> Voltar</Button>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{selected.name}</CardTitle>
                <Badge className={`text-[9px] ${CARRIER_STATUS_CONFIG[selected.status].color}`}>{CARRIER_STATUS_CONFIG[selected.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1.5 text-muted-foreground">
                <p><span className="text-foreground font-medium">País:</span> {selected.country}</p>
                <p><span className="text-foreground font-medium">Contacto:</span> {selected.contact}</p>
                <p><span className="text-foreground font-medium">Email:</span> {selected.email}</p>
                <p><span className="text-foreground font-medium">Telefone:</span> {selected.phone}</p>
                {selected.website && <p><span className="text-foreground font-medium">Website:</span> {selected.website}</p>}
              </div>
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <p><span className="text-muted-foreground">Modais:</span> {selected.transportTypes.map(t => transportLabels[t]?.label || t).join(', ')}</p>
                <p><span className="text-muted-foreground">Mercados:</span> {selected.marketsCovered.join(', ')}</p>
                <p><span className="text-muted-foreground">Rotas:</span> {selected.routes.join(', ')}</p>
                <p><span className="text-muted-foreground">Pagamento:</span> {selected.paymentTerms}</p>
                {selected.sla && <p><span className="text-muted-foreground">SLA:</span> {selected.sla}</p>}
                <p><span className="text-muted-foreground">Certificações:</span> {selected.certifications.join(', ')}</p>
              </div>
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <p><span className="text-muted-foreground">Total envios:</span> {selected.totalShipments}</p>
                <p><span className="text-muted-foreground">Custo médio/pallet:</span> {selected.currency} {selected.avgCostPerPallet}</p>
                <p><span className="text-muted-foreground">Trânsito médio:</span> {selected.avgTransitDays} dias</p>
                <p><span className="text-muted-foreground">Incidências:</span> {selected.incidentCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Score Global', value: selected.scoreGlobal },
                { label: 'Fiabilidade', value: selected.scoreReliability },
                { label: 'Custo', value: selected.scoreCost },
                { label: 'Velocidade', value: selected.scoreSpeed },
              ].map(metric => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${metric.value >= 90 ? 'bg-success' : metric.value >= 75 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Entregas no prazo (OTIF)</span>
                  <span className={`font-bold ${selected.onTimeRate >= 90 ? 'text-success' : selected.onTimeRate >= 80 ? 'text-warning' : 'text-destructive'}`}>{selected.onTimeRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar transportadoras..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Nova Transportadora</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.sort((a, b) => b.scoreGlobal - a.scoreGlobal).map(carrier => (
          <Card key={carrier.id} className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setSelected(carrier)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium">{carrier.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{carrier.country} • {carrier.marketsCovered.join(', ')}</p>
                </div>
                <Badge className={`text-[9px] ${CARRIER_STATUS_CONFIG[carrier.status].color}`}>{CARRIER_STATUS_CONFIG[carrier.status].label}</Badge>
              </div>
              <div className="flex items-center gap-1.5">
                {carrier.transportTypes.map(t => {
                  const tl = transportLabels[t];
                  return tl ? <Badge key={t} variant="outline" className="text-[9px] gap-1"><tl.icon className="h-2.5 w-2.5" />{tl.label}</Badge> : null;
                })}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] text-muted-foreground">Score</p><p className="text-sm font-bold">{carrier.scoreGlobal}</p></div>
                <div><p className="text-[10px] text-muted-foreground">OTIF</p><p className="text-sm font-bold">{carrier.onTimeRate}%</p></div>
                <div><p className="text-[10px] text-muted-foreground">Envios</p><p className="text-sm font-bold">{carrier.totalShipments}</p></div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                <span>{carrier.currency} {carrier.avgCostPerPallet}/pallet</span>
                <span>~{carrier.avgTransitDays}d trânsito</span>
                <span>{carrier.incidentCount} inc.</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
