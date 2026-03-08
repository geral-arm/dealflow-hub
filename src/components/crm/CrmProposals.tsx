import { useState } from "react";
import { motion } from "framer-motion";
import { mockProposals } from "@/data/crm-mock";
import { PROPOSAL_STATUS_CONFIG, type Proposal } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, FileText, Copy, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrmProposals() {
  const [search, setSearch] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const filtered = mockProposals.filter(p =>
    p.reference.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar propostas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Proposta</Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Incoterm</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(proposal => (
              <TableRow key={proposal.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedProposal(proposal)}>
                <TableCell className="font-medium font-mono">{proposal.reference}</TableCell>
                <TableCell>{proposal.clientName}</TableCell>
                <TableCell className="font-mono">
                  {proposal.currency === 'USD' ? '$' : '€'}{(proposal.totalValue / 1000).toFixed(1)}K
                </TableCell>
                <TableCell className="text-sm">{proposal.incoterm}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{proposal.validUntil}</TableCell>
                <TableCell className="text-center">v{proposal.version}</TableCell>
                <TableCell>
                  <span className={cn("text-[11px] px-2 py-1 rounded-full font-medium", PROPOSAL_STATUS_CONFIG[proposal.status].color)}>
                    {PROPOSAL_STATUS_CONFIG[proposal.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{proposal.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Proposal Detail */}
      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedProposal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  {selectedProposal.reference}
                  <span className={cn("text-xs px-2 py-1 rounded-full", PROPOSAL_STATUS_CONFIG[selectedProposal.status].color)}>
                    {PROPOSAL_STATUS_CONFIG[selectedProposal.status].label}
                  </span>
                  <span className="text-xs text-muted-foreground">v{selectedProposal.version}</span>
                </DialogTitle>
                <DialogDescription>{selectedProposal.clientName} · {selectedProposal.currency}</DialogDescription>
              </DialogHeader>

              {/* Items Table */}
              <div className="mt-4 rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Marca</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Qtd</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Preço Unit.</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Desc.</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProposal.items.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3 text-muted-foreground">{item.brand}</td>
                        <td className="p-3 text-right font-mono">{item.quantity.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">€{item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right">{item.discount}%</td>
                        <td className="p-3 text-right font-mono font-medium">€{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t bg-muted/30">
                    <tr>
                      <td colSpan={5} className="p-3 text-right font-semibold">Total</td>
                      <td className="p-3 text-right font-mono font-bold">
                        {selectedProposal.currency === 'USD' ? '$' : '€'}{selectedProposal.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5 text-sm">
                  <p>Incoterm: <span className="font-medium">{selectedProposal.incoterm}</span></p>
                  <p>Prazo entrega: <span className="font-medium">{selectedProposal.deliveryEstimate}</span></p>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p>Pagamento: <span className="font-medium">{selectedProposal.paymentTerms}</span></p>
                  <p>Válida até: <span className="font-medium">{selectedProposal.validUntil}</span></p>
                </div>
              </div>

              {selectedProposal.notes && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  {selectedProposal.notes}
                </div>
              )}

              <DialogFooter className="mt-4">
                <Button variant="outline" size="sm"><Copy className="h-4 w-4 mr-1" /> Duplicar</Button>
                <Button variant="outline" size="sm">Editar</Button>
                {selectedProposal.status === 'rascunho' && (
                  <Button size="sm"><Send className="h-4 w-4 mr-1" /> Enviar</Button>
                )}
                {selectedProposal.status === 'aceite' && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">Converter em Deal</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
