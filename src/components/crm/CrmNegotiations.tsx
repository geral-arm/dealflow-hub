import { useState } from "react";
import { motion } from "framer-motion";
import { mockNegotiations } from "@/data/crm-mock";
import type { Negotiation } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Search, Plus, MessageSquare, Phone, Mail, Video, MessagesSquare, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  chamada: Phone, email: Mail, reuniao: Video, whatsapp: MessagesSquare, mensagem: MessageSquare, nota_interna: StickyNote,
};

export function CrmNegotiations() {
  const [search, setSearch] = useState('');
  const [selectedNeg, setSelectedNeg] = useState<Negotiation | null>(null);

  const filtered = mockNegotiations.filter(n =>
    n.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar negociações..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Negociação</Button>
      </div>

      <div className="space-y-3">
        {filtered.map(neg => (
          <motion.div
            key={neg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-4 cursor-pointer hover:card-shadow-hover transition-shadow"
            onClick={() => setSelectedNeg(neg)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{neg.clientName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{neg.currentStatus}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono">{neg.probability}%</span>
                <p className="text-xs text-muted-foreground">{neg.entries.length} interações</p>
              </div>
            </div>
            {neg.obstacles && (
              <p className="text-xs text-destructive mt-2">⚠ {neg.obstacles}</p>
            )}
            {neg.entries.length > 0 && (
              <div className="mt-3 text-xs text-muted-foreground border-t pt-2">
                Última: {neg.entries[neg.entries.length - 1].summary.substring(0, 80)}...
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Negotiation Detail */}
      <Dialog open={!!selectedNeg} onOpenChange={() => setSelectedNeg(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedNeg && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Negociação · {selectedNeg.clientName}
                </DialogTitle>
                <DialogDescription>{selectedNeg.currentStatus} · Probabilidade: {selectedNeg.probability}%</DialogDescription>
              </DialogHeader>

              {selectedNeg.perceivedCompetitor && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <span className="font-medium">Concorrente:</span> {selectedNeg.perceivedCompetitor}
                </div>
              )}
              {selectedNeg.obstacles && (
                <div className="mt-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                  <span className="font-medium">Obstáculos:</span> {selectedNeg.obstacles}
                </div>
              )}

              {/* Timeline */}
              <div className="mt-4 space-y-0">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Timeline</h4>
                {selectedNeg.entries.map((entry, i) => {
                  const Icon = typeIcons[entry.type] || MessageSquare;
                  return (
                    <div key={entry.id} className="flex gap-3 pb-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {i < selectedNeg.entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium capitalize">{entry.type.replace('_', ' ')}</p>
                          <span className="text-xs text-muted-foreground">{entry.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{entry.summary}</p>
                        {(entry.proposedPrice || entry.counterPrice) && (
                          <div className="flex gap-4 mt-2 text-xs">
                            {entry.proposedPrice && <span>Proposto: <span className="font-mono font-bold">€{entry.proposedPrice}</span></span>}
                            {entry.counterPrice && <span className="text-destructive">Contra: <span className="font-mono font-bold">€{entry.counterPrice}</span></span>}
                          </div>
                        )}
                        {entry.nextStep && (
                          <p className="text-xs mt-1 text-secondary">➜ {entry.nextStep}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <Button size="sm" className="w-full"><Plus className="h-4 w-4 mr-1" /> Registar Interação</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
