import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOpportunities } from "@/data/procurement-mock";
import { OPPORTUNITY_STATUS_CONFIG, PRIORITY_CONFIG } from "@/types/procurement";
import { Search, Plus, Filter, LayoutList, LayoutGrid, Clock, AlertTriangle } from "lucide-react";

export function ProcurementOpportunities() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockOpportunities.filter(o => {
    const matchSearch = !search || o.product.toLowerCase().includes(search.toLowerCase()) || o.supplierName.toLowerCase().includes(search.toLowerCase()) || o.brand.toLowerCase().includes(search.toLowerCase()) || o.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const isExpiringSoon = (date: string) => {
    const d = new Date(date);
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 5 && diff > 0;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar produto, fornecedor, código..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Todos os estados</option>
            {Object.entries(OPPORTUNITY_STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setView('table')} className={view === 'table' ? 'bg-muted' : ''}><LayoutList className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setView('cards')} className={view === 'cards' ? 'bg-muted' : ''}><LayoutGrid className="h-4 w-4" /></Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Oportunidade</Button>
        </div>
      </div>

      {view === 'table' ? (
        <Card className="card-shadow">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Código</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produto</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fornecedor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qtd</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Preço</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Margem Est.</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Expira</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prioridade</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(opp => {
                    const sc = OPPORTUNITY_STATUS_CONFIG[opp.status];
                    const pc = PRIORITY_CONFIG[opp.priority];
                    const expiring = isExpiringSoon(opp.offerExpiry);
                    return (
                      <tr key={opp.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{opp.code}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{opp.product}</p>
                            <p className="text-xs text-muted-foreground">{opp.brand} · {opp.category}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-foreground">{opp.supplierName}</p>
                          <p className="text-xs text-muted-foreground">{opp.country}</p>
                        </td>
                        <td className="px-4 py-3 text-foreground">{opp.quantityAvailable.toLocaleString()} {opp.unitOfMeasure}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{opp.currency} {opp.buyPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">{opp.estimatedMarginPct ? <span className={`font-medium ${opp.estimatedMarginPct < 5 ? 'text-destructive' : 'text-success'}`}>{opp.estimatedMarginPct}%</span> : <span className="text-muted-foreground">—</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {expiring && <AlertTriangle className="h-3 w-3 text-destructive" />}
                            <span className={expiring ? 'text-destructive font-medium' : 'text-foreground'}>{opp.offerExpiry}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="outline" className={`${pc.color} text-xs`}>{pc.label}</Badge></td>
                        <td className="px-4 py-3"><Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(opp => {
            const sc = OPPORTUNITY_STATUS_CONFIG[opp.status];
            const pc = PRIORITY_CONFIG[opp.priority];
            const expiring = isExpiringSoon(opp.offerExpiry);
            return (
              <Card key={opp.id} className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{opp.code}</p>
                      <CardTitle className="text-sm mt-1">{opp.product}</CardTitle>
                    </div>
                    <Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fornecedor</span>
                    <span className="text-foreground font-medium">{opp.supplierName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço</span>
                    <span className="text-foreground font-medium">{opp.currency} {opp.buyPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantidade</span>
                    <span className="text-foreground">{opp.quantityAvailable.toLocaleString()} {opp.unitOfMeasure}</span>
                  </div>
                  {opp.estimatedMarginPct && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Margem Est.</span>
                      <span className={`font-medium ${opp.estimatedMarginPct < 5 ? 'text-destructive' : 'text-success'}`}>{opp.estimatedMarginPct}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant="outline" className={`${pc.color} text-xs`}>{pc.label}</Badge>
                    <div className="flex items-center gap-1 text-xs">
                      {expiring && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className={expiring ? 'text-destructive' : 'text-muted-foreground'}>{opp.offerExpiry}</span>
                    </div>
                  </div>
                  {opp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {opp.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
