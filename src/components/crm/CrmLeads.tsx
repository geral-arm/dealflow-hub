import { useState } from "react";
import { motion } from "framer-motion";
import { mockLeads } from "@/data/crm-mock";
import { LEAD_STATUS_CONFIG, type Lead, type LeadStatus } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, LayoutGrid, List, Filter, ArrowUpDown, Phone, Mail, Globe, MapPin, Star, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = 'table' | 'kanban';

const kanbanColumns: LeadStatus[] = ['novo', 'por_qualificar', 'qualificado', 'proposta_enviada', 'em_negociacao', 'convertido', 'perdido'];

export function CrmLeads() {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

  const filtered = mockLeads.filter(l => {
    const matchSearch = l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">Todos os estados</option>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <button onClick={() => setView('table')} className={cn("px-3 py-2", view === 'table' ? 'bg-muted' : '')}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setView('kanban')} className={cn("px-3 py-2", view === 'kanban' ? 'bg-muted' : '')}>
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Lead</Button>
        </div>
      </div>

      {view === 'table' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Última Interação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(lead => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLead(lead)}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.companyName}</p>
                      <p className="text-xs text-muted-foreground">{lead.categoriesOfInterest.join(', ')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{lead.contactName}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactRole}</p>
                  </TableCell>
                  <TableCell className="text-sm">{lead.country}</TableCell>
                  <TableCell className="text-sm">{lead.source}</TableCell>
                  <TableCell>
                    <span className={cn("font-mono font-bold text-sm", lead.score >= 80 ? "text-success" : lead.score >= 50 ? "text-warning" : "text-muted-foreground")}>{lead.score}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-[11px] px-2 py-1 rounded-full font-medium", LEAD_STATUS_CONFIG[lead.status].color)}>
                      {LEAD_STATUS_CONFIG[lead.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{lead.owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.lastInteraction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map(status => {
            const leads = filtered.filter(l => l.status === status);
            const config = LEAD_STATUS_CONFIG[status];
            return (
              <div key={status} className="min-w-[280px] flex-shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.color)}>{config.label}</span>
                    <span className="text-xs text-muted-foreground">{leads.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {leads.map(lead => (
                    <div key={lead.id} onClick={() => setSelectedLead(lead)} className="rounded-lg border bg-card p-3 card-shadow cursor-pointer hover:card-shadow-hover transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium leading-tight">{lead.companyName}</p>
                        <span className={cn("font-mono text-xs font-bold", lead.score >= 80 ? "text-success" : lead.score >= 50 ? "text-warning" : "text-muted-foreground")}>{lead.score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{lead.contactName} · {lead.contactRole}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {lead.country}
                        <span className="ml-auto">{lead.potentialVolume}</span>
                      </div>
                      {lead.nextAction && (
                        <div className="mt-2 text-[11px] px-2 py-1 rounded bg-muted text-muted-foreground">
                          ➜ {lead.nextAction}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedLead.companyName}
                  <span className={cn("text-xs px-2 py-1 rounded-full", LEAD_STATUS_CONFIG[selectedLead.status].color)}>
                    {LEAD_STATUS_CONFIG[selectedLead.status].label}
                  </span>
                </DialogTitle>
                <DialogDescription>{selectedLead.contactName} · {selectedLead.contactRole}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Contacto</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {selectedLead.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {selectedLead.phone}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {selectedLead.country} · {selectedLead.market}</div>
                    {selectedLead.website && <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" /> {selectedLead.website}</div>}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Comercial</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-muted-foreground" /> Score: <span className="font-bold">{selectedLead.score}/100</span></div>
                    <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /> {selectedLead.owner}</div>
                    <div>Volume: {selectedLead.potentialVolume}</div>
                    <div>Incoterm: {selectedLead.preferredIncoterm} · {selectedLead.currency}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Interesses</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.categoriesOfInterest.map(c => (
                    <span key={c} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">{c}</span>
                  ))}
                  {selectedLead.brandsOfInterest.map(b => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{b}</span>
                  ))}
                </div>
              </div>

              {selectedLead.notes && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Notas</h4>
                  {selectedLead.notes}
                </div>
              )}

              {selectedLead.nextAction && (
                <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                  <h4 className="text-xs font-semibold uppercase text-warning tracking-wider mb-1">Próxima Ação</h4>
                  {selectedLead.nextAction} {selectedLead.nextActionDate && `· ${selectedLead.nextActionDate}`}
                </div>
              )}

              <DialogFooter className="mt-4">
                <Button variant="outline" size="sm">Editar</Button>
                {selectedLead.status !== 'convertido' && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">Converter em Cliente</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
