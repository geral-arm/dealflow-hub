import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { mockLots, mockReservations } from "@/data/inventory-mock";
import { LOT_STATUS_CONFIG } from "@/types/inventory";
import type { StockLot } from "@/types/inventory";

export function InventoryStock() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<StockLot | null>(null);

  const filtered = mockLots.filter(l => {
    const matchSearch = `${l.product} ${l.brand} ${l.lotNumber} ${l.warehouseName} ${l.supplierName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['all', 'disponivel', 'reservado', 'quarentena', 'bloqueado', 'expirado'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar produto, marca, lote..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <div className="flex gap-1">
          {statuses.map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="text-[10px] h-7 px-2" onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'Todos' : LOT_STATUS_CONFIG[s as keyof typeof LOT_STATUS_CONFIG]?.label || s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Stock</p>
            <p className="text-lg font-bold font-display">{mockLots.reduce((s, l) => s + l.quantity, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Disponível</p>
            <p className="text-lg font-bold font-display text-success">{mockLots.reduce((s, l) => s + l.availableQty, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Reservado</p>
            <p className="text-lg font-bold font-display text-info">{mockLots.reduce((s, l) => s + l.reservedQty, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {selected ? (
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Detalhe do Lote — {selected.lotNumber}</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelected(null)}>Fechar</Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 text-xs">
                <h4 className="font-medium text-sm mb-2">Informação do Produto</h4>
                <p><span className="text-muted-foreground">Produto:</span> {selected.product}</p>
                <p><span className="text-muted-foreground">Marca:</span> {selected.brand}</p>
                <p><span className="text-muted-foreground">Categoria:</span> {selected.category}</p>
                {selected.ean && <p><span className="text-muted-foreground">EAN:</span> {selected.ean}</p>}
                <p><span className="text-muted-foreground">Fornecedor:</span> {selected.supplierName}</p>
                {selected.poNumber && <p><span className="text-muted-foreground">PO:</span> {selected.poNumber}</p>}
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-medium text-sm mb-2">Stock & Localização</h4>
                <p><span className="text-muted-foreground">Quantidade:</span> {selected.quantity} {selected.unitOfMeasure}s</p>
                <p><span className="text-muted-foreground">Disponível:</span> <span className="text-success font-medium">{selected.availableQty}</span></p>
                <p><span className="text-muted-foreground">Reservado:</span> <span className="text-info font-medium">{selected.reservedQty}</span></p>
                <p><span className="text-muted-foreground">Armazém:</span> {selected.warehouseName}</p>
                <p><span className="text-muted-foreground">País:</span> {selected.country}</p>
                {selected.isBonded && <p><span className="text-warning font-medium">⚠ Stock em regime bonded</span></p>}
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-medium text-sm mb-2">Validade & Rastreabilidade</h4>
                {selected.productionDate && <p><span className="text-muted-foreground">Produção:</span> {selected.productionDate}</p>}
                {selected.expiryDate && <p><span className="text-muted-foreground">Validade:</span> {selected.expiryDate}</p>}
                {selected.daysToExpiry !== undefined && (
                  <p className={selected.daysToExpiry <= 0 ? 'text-destructive font-medium' : selected.daysToExpiry <= 30 ? 'text-warning font-medium' : ''}>
                    {selected.daysToExpiry <= 0 ? '❌ EXPIRADO' : `${selected.daysToExpiry} dias para expirar`}
                  </p>
                )}
                <p><span className="text-muted-foreground">Entrada:</span> {selected.entryDate}</p>
                <p><span className="text-muted-foreground">Dias em armazém:</span> {selected.daysInStorage}</p>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-medium text-sm mb-2">Custos</h4>
                <p><span className="text-muted-foreground">Custo unitário:</span> {selected.currency} {selected.unitCost.toFixed(2)}</p>
                <p><span className="text-muted-foreground">Custo total:</span> {selected.currency} {selected.totalCost.toLocaleString()}</p>
                <h4 className="font-medium text-sm mt-4 mb-2">Reservas</h4>
                {mockReservations.filter(r => r.lotId === selected.id).map(r => (
                  <div key={r.id} className="p-2 bg-muted/30 rounded border border-border/30">
                    <p><span className="text-muted-foreground">Op.:</span> {r.relatedTo}</p>
                    <p><span className="text-muted-foreground">Qtd:</span> {r.quantity} • <span className="text-muted-foreground">Estado:</span> {r.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Lote</TableHead>
                  <TableHead className="text-xs">Produto</TableHead>
                  <TableHead className="text-xs">Marca</TableHead>
                  <TableHead className="text-xs">Armazém</TableHead>
                  <TableHead className="text-xs text-right">Qtd</TableHead>
                  <TableHead className="text-xs text-right">Disp.</TableHead>
                  <TableHead className="text-xs">Validade</TableHead>
                  <TableHead className="text-xs">Estado</TableHead>
                  <TableHead className="text-xs text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(lot => (
                  <TableRow key={lot.id} className="cursor-pointer" onClick={() => setSelected(lot)}>
                    <TableCell className="text-xs font-mono">{lot.lotNumber}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{lot.product}</TableCell>
                    <TableCell className="text-xs">{lot.brand}</TableCell>
                    <TableCell className="text-xs">{lot.warehouseName.split(' ').slice(0, 2).join(' ')}</TableCell>
                    <TableCell className="text-xs text-right">{lot.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{lot.availableQty.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {lot.expiryDate ? (
                        <span className={`flex items-center gap-1 ${lot.daysToExpiry !== undefined && lot.daysToExpiry <= 0 ? 'text-destructive' : lot.daysToExpiry !== undefined && lot.daysToExpiry <= 30 ? 'text-warning' : ''}`}>
                          {lot.daysToExpiry !== undefined && lot.daysToExpiry <= 30 && <AlertTriangle className="h-3 w-3" />}
                          {lot.expiryDate}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell><Badge className={`text-[9px] ${LOT_STATUS_CONFIG[lot.status].color}`}>{LOT_STATUS_CONFIG[lot.status].label}</Badge></TableCell>
                    <TableCell className="text-xs text-right">{lot.currency} {lot.totalCost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
