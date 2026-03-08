import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, CheckCircle2, Circle } from "lucide-react";
import { mockIncidents } from "@/data/inventory-mock";
import { INCIDENT_SEVERITY_CONFIG } from "@/types/inventory";

const typeLabels: Record<string, string> = {
  atraso: 'Atraso', dano: 'Dano', falta: 'Falta', excesso: 'Excesso',
  doc_problema: 'Doc. Problema', recusa_entrega: 'Recusa', outro: 'Outro',
};

export function InventoryIncidents() {
  const [search, setSearch] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  const filtered = mockIncidents.filter(i => {
    const matchSearch = `${i.title} ${i.relatedTo} ${i.carrierName || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchResolved = showResolved || !i.resolved;
    return matchSearch && matchResolved;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar incidências..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button variant={showResolved ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setShowResolved(!showResolved)}>
            {showResolved ? 'Mostrar todas' : 'Incluir resolvidas'}
          </Button>
        </div>
        <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Nova Incidência</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Abertas', value: mockIncidents.filter(i => !i.resolved).length, color: 'text-destructive' },
          { label: 'Alta/Crítica', value: mockIncidents.filter(i => !i.resolved && (i.severity === 'alta' || i.severity === 'critica')).length, color: 'text-warning' },
          { label: 'Resolvidas', value: mockIncidents.filter(i => i.resolved).length, color: 'text-success' },
          { label: 'Total', value: mockIncidents.length, color: 'text-foreground' },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className={`text-lg font-bold font-display ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-8"></TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Severidade</TableHead>
                <TableHead className="text-xs">Título</TableHead>
                <TableHead className="text-xs">Relacionado</TableHead>
                <TableHead className="text-xs">Transportadora</TableHead>
                <TableHead className="text-xs">Responsável</TableHead>
                <TableHead className="text-xs">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(inc => (
                <TableRow key={inc.id} className={inc.resolved ? 'opacity-60' : ''}>
                  <TableCell>{inc.resolved ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground" />}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[9px]">{typeLabels[inc.type] || inc.type}</Badge></TableCell>
                  <TableCell><Badge className={`text-[9px] ${INCIDENT_SEVERITY_CONFIG[inc.severity].color}`}>{INCIDENT_SEVERITY_CONFIG[inc.severity].label}</Badge></TableCell>
                  <TableCell className="text-xs font-medium max-w-[250px] truncate">{inc.title}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inc.relatedTo}</TableCell>
                  <TableCell className="text-xs">{inc.carrierName || '—'}</TableCell>
                  <TableCell className="text-xs">{inc.owner}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inc.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
