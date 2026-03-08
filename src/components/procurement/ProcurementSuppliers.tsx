import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSuppliers } from "@/data/procurement-mock";
import { SUPPLIER_STATUS_CONFIG } from "@/types/procurement";
import { Search, Plus, Star, MapPin, Phone, Mail, Globe, ArrowLeft } from "lucide-react";

export function ProcurementSuppliers() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = mockSuppliers.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.tradeName.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.brandsSupplied.some(b => b.toLowerCase().includes(q)) || s.categoriesSupplied.some(c => c.toLowerCase().includes(q));
  });

  const selected = selectedId ? mockSuppliers.find(s => s.id === selectedId) : null;

  if (selected) {
    const sc = SUPPLIER_STATUS_CONFIG[selected.status];
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">{selected.tradeName}</h2>
            <p className="text-sm text-muted-foreground">{selected.legalName} · {selected.vatNumber}</p>
          </div>
          <Badge variant="outline" className={`${sc.color}`}>{sc.label}</Badge>
        </div>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
            <TabsTrigger value="comercial">Comercial</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="card-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Dados Gerais</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">País</span><span className="text-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{selected.country}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Morada</span><span className="text-foreground">{selected.address}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Telefone</span><span className="text-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</span></div>
                {selected.website && <div className="flex justify-between"><span className="text-muted-foreground">Website</span><span className="text-foreground flex items-center gap-1"><Globe className="h-3 w-3" />{selected.website}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Moeda</span><span className="text-foreground">{selected.defaultCurrency}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Incoterm</span><span className="text-foreground">{selected.defaultIncoterm}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Classificação</span><span className="text-foreground font-medium">{selected.classification}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ABC</span><span className="text-foreground font-bold">{selected.abcClassification}</span></div>
              </CardContent></Card>

              <Card className="card-shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">Score & Resumo</CardTitle></CardHeader><CardContent className="space-y-3">
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-secondary">
                    <span className="text-2xl font-display font-bold text-foreground">{selected.scoreGlobal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Score Global</p>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Preço', score: selected.scorePrice },
                    { label: 'Entrega', score: selected.scoreDelivery },
                    { label: 'Qualidade', score: selected.scoreQuality },
                    { label: 'Resposta', score: selected.scoreResponsiveness },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: `${s.score}%` }} /></div>
                        <span className="text-foreground font-medium w-7 text-right">{s.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Compras</span><span className="text-foreground font-medium">€{selected.totalPurchases.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Nº Encomendas</span><span className="text-foreground">{selected.totalOrders}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">On-time</span><span className="text-foreground">{selected.onTimeDeliveryRate}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Incidentes</span><span className="text-foreground">{selected.incidentCount}</span></div>
                </div>
              </CardContent></Card>
            </div>
            {selected.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-4">{selected.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}</div>}
            {selected.strategicNotes && <Card className="card-shadow mt-4"><CardContent className="py-3"><p className="text-sm text-muted-foreground italic">{selected.strategicNotes}</p></CardContent></Card>}
          </TabsContent>

          <TabsContent value="contactos">
            <div className="grid sm:grid-cols-2 gap-4">
              {selected.contacts.map(c => (
                <Card key={c.id} className="card-shadow"><CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{c.name}</p>
                    {c.isPrimary && <Badge variant="secondary" className="text-xs">Principal</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{c.role}</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</p>
                    <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3" />{c.phone}</p>
                    <p className="text-xs text-muted-foreground">Idioma: {c.language}</p>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comercial">
            <Card className="card-shadow"><CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Categorias</span><span className="text-foreground">{selected.categoriesSupplied.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Marcas</span><span className="text-foreground">{selected.brandsSupplied.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mercados Origem</span><span className="text-foreground">{selected.marketsOfOrigin.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">MOQ Habitual</span><span className="text-foreground">{selected.avgMOQ}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lead Time Médio</span><span className="text-foreground">{selected.avgLeadTime}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Localizações Stock</span><span className="text-foreground">{selected.stockLocations.join(', ')}</span></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="financeiro">
            <Card className="card-shadow"><CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Condições Pagamento</span><span className="text-foreground">{selected.paymentTerms}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Prazo Médio (dias)</span><span className="text-foreground">{selected.avgPaymentDays}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pagamento Antecipado</span><span className="text-foreground">{selected.requiresAdvancePayment ? 'Sim' : 'Não'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Risco Financeiro</span><Badge variant="outline" className={selected.financialRisk === 'baixo' ? 'bg-success/20 text-success' : selected.financialRisk === 'medio' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}>{selected.financialRisk}</Badge></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="card-shadow"><CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Score Global</span><span className="text-foreground font-bold text-lg">{selected.scoreGlobal}/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxa Entrega no Prazo</span><span className="text-foreground">{selected.onTimeDeliveryRate}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nº Incidentes</span><span className="text-foreground">{selected.incidentCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Compras</span><span className="text-foreground font-medium">€{selected.totalPurchases.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Encomendas</span><span className="text-foreground">{selected.totalOrders}</span></div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar fornecedor, país, marca..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Fornecedor</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sup => {
          const sc = SUPPLIER_STATUS_CONFIG[sup.status];
          return (
            <Card key={sup.id} className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer" onClick={() => setSelectedId(sup.id)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">{sup.tradeName}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{sup.country} · {sup.defaultCurrency}</p>
                  </div>
                  <Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-accent" />
                    <span className="text-sm font-bold text-foreground">{sup.scoreGlobal}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">· {sup.abcClassification}</span>
                  <span className="text-xs text-muted-foreground">· On-time {sup.onTimeDeliveryRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{sup.categoriesSupplied.join(', ')}</p>
                <p className="text-xs text-muted-foreground">{sup.brandsSupplied.join(', ')}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t">
                  <span className="text-muted-foreground">€{(sup.totalPurchases / 1000).toFixed(0)}k compras</span>
                  <span className="text-muted-foreground">{sup.totalOrders} POs</span>
                </div>
                {sup.tags.length > 0 && <div className="flex flex-wrap gap-1">{sup.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
