import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, X, Truck, Ship, Plane, MapPin } from "lucide-react";
import { mockShipments } from "@/data/inventory-mock";
import { SHIPMENT_STATUS_CONFIG } from "@/types/inventory";
import type { Shipment } from "@/types/inventory";

const transportIcons: Record<string, typeof Truck> = { rodoviario: Truck, maritimo: Ship, aereo: Plane, multimodal: Truck };

export function InventoryShipments() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Shipment | null>(null);

  const filtered = mockShipments.filter(s =>
    `${s.shipmentNumber} ${s.carrierName} ${s.destinationCountry} ${s.destinationClient || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    const Icon = transportIcons[selected.transportType] || Truck;
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-xs"><X className="h-3 w-3 mr-1" /> Voltar</Button>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{selected.shipmentNumber}</CardTitle>
                <Badge className={`text-[9px] ${SHIPMENT_STATUS_CONFIG[selected.status].color}`}>{SHIPMENT_STATUS_CONFIG[selected.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{selected.transportType} • {selected.carrierName}</div>
              <div className="pt-2 space-y-1.5">
                <p><span className="text-muted-foreground">Origem:</span> {selected.originWarehouse}, {selected.originCountry}</p>
                <p><span className="text-muted-foreground">Destino:</span> {selected.destinationAddress}</p>
                {selected.destinationClient && <p><span className="text-muted-foreground">Cliente:</span> {selected.destinationClient}</p>}
                <p><span className="text-muted-foreground">Incoterm:</span> {selected.incoterm}</p>
                <p><span className="text-muted-foreground">ETD:</span> {selected.etd} {selected.actualDeparture && `(real: ${selected.actualDeparture})`}</p>
                <p><span className="text-muted-foreground">ETA:</span> {selected.eta} {selected.actualArrival && `(real: ${selected.actualArrival})`}</p>
              </div>
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <p><span className="text-muted-foreground">Peso:</span> {selected.totalWeight.toLocaleString()} kg</p>
                <p><span className="text-muted-foreground">Volume:</span> {selected.totalVolume} m³</p>
                <p><span className="text-muted-foreground">Pallets:</span> {selected.totalPallets}</p>
                <p><span className="text-muted-foreground">Valor:</span> {selected.currency} {selected.totalValue.toLocaleString()}</p>
                {selected.trackingRef && <p><span className="text-muted-foreground">Tracking:</span> <span className="font-mono">{selected.trackingRef}</span></p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Itens ({selected.items.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {selected.items.map(item => (
                <div key={item.id} className="p-2 bg-muted/30 rounded border border-border/30 text-xs space-y-0.5">
                  <p className="font-medium">{item.product}</p>
                  <p className="text-muted-foreground">{item.brand} • Lote {item.lotNumber}</p>
                  <p className="text-muted-foreground">{item.quantity} un • {item.weight} kg • {item.pallets} pallets</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {selected.events.map((ev, i) => (
                  <div key={ev.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${i === selected.events.length - 1 ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      {i < selected.events.length - 1 && <div className="w-px h-full bg-border" />}
                    </div>
                    <div className="pb-3 text-xs">
                      <p className="font-medium">{ev.event}</p>
                      {ev.location && <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</p>}
                      <p className="text-[10px] text-muted-foreground">{new Date(ev.timestamp).toLocaleString('pt-PT')}</p>
                    </div>
                  </div>
                ))}
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
          <Input placeholder="Pesquisar envios..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Novo Envio</Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Envio</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Transportadora</TableHead>
                <TableHead className="text-xs">Rota</TableHead>
                <TableHead className="text-xs">Cliente</TableHead>
                <TableHead className="text-xs">ETA</TableHead>
                <TableHead className="text-xs text-right">Pallets</TableHead>
                <TableHead className="text-xs text-right">Valor</TableHead>
                <TableHead className="text-xs">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(shp => {
                const Icon = transportIcons[shp.transportType] || Truck;
                return (
                  <TableRow key={shp.id} className="cursor-pointer" onClick={() => setSelected(shp)}>
                    <TableCell className="text-xs font-mono font-medium">{shp.shipmentNumber}</TableCell>
                    <TableCell><Icon className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                    <TableCell className="text-xs">{shp.carrierName}</TableCell>
                    <TableCell className="text-xs">{shp.originCountry} → {shp.destinationCountry}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{shp.destinationClient || '—'}</TableCell>
                    <TableCell className="text-xs">{shp.eta}</TableCell>
                    <TableCell className="text-xs text-right">{shp.totalPallets}</TableCell>
                    <TableCell className="text-xs text-right">{shp.currency} {shp.totalValue.toLocaleString()}</TableCell>
                    <TableCell><Badge className={`text-[9px] ${SHIPMENT_STATUS_CONFIG[shp.status].color}`}>{SHIPMENT_STATUS_CONFIG[shp.status].label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
