import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowDown, ArrowUp, ArrowLeftRight, Wrench, Lock, Unlock, CornerDownLeft } from "lucide-react";
import { mockMovements, mockReservations } from "@/data/inventory-mock";
import { MOVEMENT_TYPE_CONFIG } from "@/types/inventory";

const movIcons: Record<string, typeof ArrowDown> = {
  entrada: ArrowDown, saida: ArrowUp, transferencia: ArrowLeftRight,
  ajuste: Wrench, reserva: Lock, libertacao: Unlock, devolucao: CornerDownLeft,
};

export function InventoryMovements() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<'movements' | 'reservations'>('movements');

  const filteredMov = mockMovements.filter(m =>
    `${m.product} ${m.brand} ${m.lotNumber || ''} ${m.reason}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <Button variant={tab === 'movements' ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setTab('movements')}>Movimentos</Button>
          <Button variant={tab === 'reservations' ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setTab('reservations')}>Reservas</Button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
      </div>

      {tab === 'movements' ? (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Tipo</TableHead>
                  <TableHead className="text-xs">Produto</TableHead>
                  <TableHead className="text-xs">Lote</TableHead>
                  <TableHead className="text-xs text-right">Qtd</TableHead>
                  <TableHead className="text-xs">Origem</TableHead>
                  <TableHead className="text-xs">Destino</TableHead>
                  <TableHead className="text-xs">Motivo</TableHead>
                  <TableHead className="text-xs">Por</TableHead>
                  <TableHead className="text-xs">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMov.map(mov => {
                  const Icon = movIcons[mov.type] || ArrowDown;
                  const cfg = MOVEMENT_TYPE_CONFIG[mov.type];
                  return (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Badge className={`text-[9px] gap-1 ${cfg.color}`}><Icon className="h-2.5 w-2.5" />{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[160px] truncate">{mov.product}</TableCell>
                      <TableCell className="text-xs font-mono">{mov.lotNumber || '—'}</TableCell>
                      <TableCell className={`text-xs text-right font-medium ${mov.quantity < 0 ? 'text-destructive' : mov.type === 'saida' ? 'text-destructive' : 'text-success'}`}>
                        {mov.quantity > 0 && mov.type !== 'saida' ? '+' : ''}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-xs">{mov.fromWarehouse?.split(' ').slice(0, 2).join(' ') || '—'}</TableCell>
                      <TableCell className="text-xs">{mov.toWarehouse?.split(' ').slice(0, 2).join(' ') || '—'}</TableCell>
                      <TableCell className="text-xs max-w-[180px] truncate text-muted-foreground">{mov.reason}</TableCell>
                      <TableCell className="text-xs">{mov.performedBy.split(' ')[0]}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(mov.performedAt).toLocaleDateString('pt-PT')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Produto</TableHead>
                  <TableHead className="text-xs">Lote</TableHead>
                  <TableHead className="text-xs text-right">Qtd</TableHead>
                  <TableHead className="text-xs">Operação</TableHead>
                  <TableHead className="text-xs">Estado</TableHead>
                  <TableHead className="text-xs">Reservado por</TableHead>
                  <TableHead className="text-xs">Data</TableHead>
                  <TableHead className="text-xs">Expira</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReservations.map(res => (
                  <TableRow key={res.id}>
                    <TableCell className="text-xs">{res.product}</TableCell>
                    <TableCell className="text-xs font-mono">{res.lotNumber}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{res.quantity}</TableCell>
                    <TableCell className="text-xs">{res.relatedTo}</TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] ${res.status === 'confirmada' ? 'bg-success/20 text-success' : res.status === 'provisoria' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                        {res.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{res.reservedBy}</TableCell>
                    <TableCell className="text-xs">{res.reservedAt}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{res.expiresAt || '—'}</TableCell>
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
