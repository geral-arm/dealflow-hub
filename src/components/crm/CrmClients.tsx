import { useState } from "react";
import { motion } from "framer-motion";
import { mockClients } from "@/data/crm-mock";
import type { Client } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Search, Plus, Building2, MapPin, Phone, Mail, Globe, CreditCard, TrendingUp, ShoppingCart, FileText, Users, AlertTriangle, Star, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrmClients() {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockClients.filter(c => {
    const matchSearch = c.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.vatNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="all">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Cliente</Button>
      </div>

      {/* Clients Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Classificação</TableHead>
              <TableHead>Ticket Médio</TableHead>
              <TableHead>Crédito</TableHead>
              <TableHead>Potencial</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(client => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedClient(client)}>
                <TableCell>
                  <div>
                    <p className="font-medium">{client.tradeName}</p>
                    <p className="text-xs text-muted-foreground">{client.legalName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{client.country}</TableCell>
                <TableCell>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded",
                    client.abcClassification === 'A' ? 'bg-success/20 text-success' :
                    client.abcClassification === 'B' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                  )}>{client.abcClassification}</span>
                </TableCell>
                <TableCell className="text-sm font-mono">€{(client.avgTicket / 1000).toFixed(0)}K</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-mono">€{(client.creditLimit / 1000).toFixed(0)}K</p>
                    {client.overdueInvoices > 0 && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {client.overdueInvoices} vencidas</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono">€{(client.estimatedPotential / 1000000).toFixed(1)}M</TableCell>
                <TableCell className="text-sm">{client.owner}</TableCell>
                <TableCell>
                  <span className={cn("text-[11px] px-2 py-1 rounded-full",
                    client.status === 'ativo' ? 'bg-success/20 text-success' :
                    client.status === 'bloqueado' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
                  )}>{client.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Client Detail Dialog (360° View) */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedClient && <ClientDetailView client={selectedClient} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDetailView({ client }: { client: Client }) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="flex items-center gap-2">
              {client.tradeName}
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded",
                client.abcClassification === 'A' ? 'bg-success/20 text-success' :
                client.abcClassification === 'B' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
              )}>{client.abcClassification}</span>
              <span className={cn("text-[11px] px-2 py-1 rounded-full",
                client.status === 'ativo' ? 'bg-success/20 text-success' :
                client.status === 'bloqueado' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
              )}>{client.status}</span>
            </DialogTitle>
            <DialogDescription>{client.legalName} · VAT: {client.vatNumber}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="commercial">Perfil Comercial</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={MapPin} label="País" value={client.country} />
            <InfoCard icon={Globe} label="Mercados" value={client.markets.join(', ')} />
            <InfoCard icon={DollarSign} label="Moeda" value={client.defaultCurrency} />
            <InfoCard icon={ShoppingCart} label="Incoterm" value={client.defaultIncoterm} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Dados Gerais</h4>
              <div className="space-y-1.5 text-sm">
                <p>Tipo: <span className="font-medium">{client.clientType}</span></p>
                <p>Idioma: <span className="font-medium">{client.preferredLanguage}</span></p>
                <p>Segmento: <span className="font-medium">{client.segment}</span></p>
                <p>Vertical: <span className="font-medium">{client.vertical}</span></p>
                <p>Prioridade: <span className="font-medium capitalize">{client.commercialPriority}</span></p>
              </div>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Resumo Financeiro</h4>
              <div className="space-y-1.5 text-sm">
                <p>Limite Crédito: <span className="font-medium font-mono">€{(client.creditLimit / 1000).toFixed(0)}K</span></p>
                <p>Saldo em Aberto: <span className="font-medium font-mono">€{(client.outstandingBalance / 1000).toFixed(0)}K</span></p>
                <p>Pagamento: <span className="font-medium">{client.paymentTerms}</span></p>
                <p>Risco: <span className={cn("font-medium capitalize", client.commercialRisk === 'alto' ? 'text-destructive' : client.commercialRisk === 'medio' ? 'text-warning' : 'text-success')}>{client.commercialRisk}</span></p>
                {client.overdueInvoices > 0 && (
                  <p className="text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {client.overdueInvoices} faturas vencidas</p>
                )}
              </div>
            </div>
          </div>
          {client.strategicNotes && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Nota Estratégica</h4>
              {client.strategicNotes}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {client.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{tag}</span>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <div className="space-y-3">
            {client.contacts.map(contact => (
              <div key={contact.id} className="rounded-lg border p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{contact.name}</p>
                    {contact.isPrimary && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Primário</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{contact.role}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {contact.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {contact.phone}</span>
                  </div>
                </div>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded",
                  contact.decisionLevel === 'alto' ? 'bg-success/20 text-success' :
                  contact.decisionLevel === 'medio' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                )}>Decisão: {contact.decisionLevel}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commercial" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Categorias Compradas</h4>
              <div className="flex flex-wrap gap-1.5">
                {client.categoriesBought.map(c => (
                  <span key={c} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">{c}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Marcas de Interesse</h4>
              <div className="flex flex-wrap gap-1.5">
                {client.brandsOfInterest.map(b => (
                  <span key={b} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{b}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InfoCard icon={TrendingUp} label="Ticket Médio" value={`€${(client.avgTicket / 1000).toFixed(0)}K`} />
            <InfoCard icon={Clock} label="Frequência" value={client.purchaseFrequency} />
            <InfoCard icon={Star} label="Potencial Anual" value={`€${(client.estimatedPotential / 1000000).toFixed(1)}M`} />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={CreditCard} label="Limite de Crédito" value={`€${(client.creditLimit / 1000).toFixed(0)}K`} />
            <InfoCard icon={DollarSign} label="Saldo em Aberto" value={`€${(client.outstandingBalance / 1000).toFixed(0)}K`} />
            <InfoCard icon={FileText} label="Condição Pagamento" value={client.paymentTerms} />
            <InfoCard icon={AlertTriangle} label="Faturas Vencidas" value={String(client.overdueInvoices)} />
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Utilização de Crédito</h4>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all",
                  (client.outstandingBalance / client.creditLimit) > 0.8 ? 'bg-destructive' :
                  (client.outstandingBalance / client.creditLimit) > 0.5 ? 'bg-warning' : 'bg-success'
                )}
                style={{ width: `${Math.min((client.outstandingBalance / client.creditLimit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((client.outstandingBalance / client.creditLimit) * 100)}% utilizado · €{((client.creditLimit - client.outstandingBalance) / 1000).toFixed(0)}K disponível
            </p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Histórico de compras será carregado da base de dados</p>
            <p className="text-xs mt-1">Última compra: {client.lastPurchase || 'N/A'}</p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
