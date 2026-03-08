import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Warehouse, MapPin, X } from "lucide-react";
import { mockWarehouses, mockLots } from "@/data/inventory-mock";
import { WAREHOUSE_TYPE_CONFIG } from "@/types/inventory";
import type { Warehouse as WarehouseType } from "@/types/inventory";

export function InventoryWarehouses() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<WarehouseType | null>(null);

  const filtered = mockWarehouses.filter(w =>
    `${w.name} ${w.code} ${w.city} ${w.country}`.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    const warehouseLots = mockLots.filter(l => l.warehouseId === selected.id);
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-xs">
          <X className="h-3 w-3 mr-1" /> Voltar
        </Button>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-1 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{selected.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Badge className={`text-[9px] ${WAREHOUSE_TYPE_CONFIG[selected.type].color}`}>{WAREHOUSE_TYPE_CONFIG[selected.type].label}</Badge>
                {selected.isBonded && <Badge variant="outline" className="text-[9px] text-warning border-warning/30">Bonded</Badge>}
              </div>
              <div className="space-y-1.5 text-muted-foreground">
                <p><span className="text-foreground font-medium">Código:</span> {selected.code}</p>
                <p><span className="text-foreground font-medium">País:</span> {selected.country}</p>
                <p><span className="text-foreground font-medium">Cidade:</span> {selected.city}</p>
                <p><span className="text-foreground font-medium">Morada:</span> {selected.address}</p>
                <p><span className="text-foreground font-medium">Contacto:</span> {selected.contact}</p>
                <p><span className="text-foreground font-medium">Email:</span> {selected.email}</p>
                {selected.operator && <p><span className="text-foreground font-medium">Operador:</span> {selected.operator}</p>}
                {selected.bondedRef && <p><span className="text-foreground font-medium">Ref Bonded:</span> {selected.bondedRef}</p>}
                {selected.bondedRegime && <p><span className="text-foreground font-medium">Regime:</span> {selected.bondedRegime}</p>}
              </div>
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Capacidade:</span><span className="font-medium">{selected.capacityPallets} pallets</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ocupação:</span><span className={`font-medium ${selected.occupancyPct > 80 ? 'text-destructive' : 'text-foreground'}`}>{selected.occupancyPct}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Itens:</span><span className="font-medium">{selected.totalItems}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Valor:</span><span className="font-medium">€{selected.totalValue.toLocaleString()}</span></div>
                {selected.storageCostPerPallet && <div className="flex justify-between"><span className="text-muted-foreground">Custo/pallet:</span><span className="font-medium">€{selected.storageCostPerPallet}/mês</span></div>}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Stock neste Armazém ({warehouseLots.length} lotes)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead className="text-xs">Lote</TableHead><TableHead className="text-xs">Produto</TableHead><TableHead className="text-xs">Marca</TableHead><TableHead className="text-xs text-right">Qtd</TableHead><TableHead className="text-xs text-right">Disp.</TableHead><TableHead className="text-xs">Validade</TableHead><TableHead className="text-xs">Estado</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {warehouseLots.map(lot => (
                    <TableRow key={lot.id}>
                      <TableCell className="text-xs font-mono">{lot.lotNumber}</TableCell>
                      <TableCell className="text-xs">{lot.product}</TableCell>
                      <TableCell className="text-xs">{lot.brand}</TableCell>
                      <TableCell className="text-xs text-right">{lot.quantity}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{lot.availableQty}</TableCell>
                      <TableCell className="text-xs">{lot.expiryDate || '—'}</TableCell>
                      <TableCell><Badge className={`text-[9px] ${lot.status === 'disponivel' ? 'bg-success/20 text-success' : lot.status === 'expirado' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>{lot.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {warehouseLots.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">Sem stock neste armazém</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
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
          <Input placeholder="Pesquisar armazéns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Novo Armazém</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(wh => (
          <Card key={wh.id} className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setSelected(wh)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium">{wh.name}</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />{wh.city}, {wh.country}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={`text-[9px] ${WAREHOUSE_TYPE_CONFIG[wh.type].color}`}>{WAREHOUSE_TYPE_CONFIG[wh.type].label}</Badge>
                  {wh.isBonded && <Badge variant="outline" className="text-[9px] text-warning border-warning/30">B</Badge>}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ocupação</span>
                  <span className={`font-medium ${wh.occupancyPct > 80 ? 'text-destructive' : ''}`}>{wh.occupancyPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${wh.occupancyPct > 80 ? 'bg-destructive' : wh.occupancyPct > 60 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${wh.occupancyPct}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                <span>{wh.occupiedPallets}/{wh.capacityPallets} pallets</span>
                <span>{wh.totalItems} itens</span>
                <span>€{(wh.totalValue / 1000).toFixed(0)}k</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
