import { useState } from "react";
import { motion } from "framer-motion";
import { mockOpportunities } from "@/data/crm-mock";
import { PIPELINE_STAGES, type Opportunity, type OpportunityStage } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, List, Columns3, DollarSign, Target, Calendar, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = 'kanban' | 'list' | 'forecast';

export function CrmPipeline() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const filtered = mockOpportunities.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const activeStages = PIPELINE_STAGES.filter(s => s.id !== 'fechado_ganho' && s.id !== 'fechado_perdido');
  const totalPipeline = filtered.filter(o => o.stage !== 'fechado_perdido').reduce((s, o) => s + o.estimatedValue, 0);
  const weightedPipeline = filtered.filter(o => o.stage !== 'fechado_perdido' && o.stage !== 'fechado_ganho')
    .reduce((s, o) => s + (o.estimatedValue * o.probability / 100), 0);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl border bg-card">
        <div>
          <p className="text-xs text-muted-foreground">Pipeline Total</p>
          <p className="text-lg font-bold font-mono">€{(totalPipeline / 1000).toFixed(0)}K</p>
        </div>
        <div className="border-l pl-4">
          <p className="text-xs text-muted-foreground">Ponderado</p>
          <p className="text-lg font-bold font-mono text-secondary">€{(weightedPipeline / 1000).toFixed(0)}K</p>
        </div>
        <div className="border-l pl-4">
          <p className="text-xs text-muted-foreground">Oportunidades</p>
          <p className="text-lg font-bold">{filtered.length}</p>
        </div>
        <div className="border-l pl-4">
          <p className="text-xs text-muted-foreground">Ganhos</p>
          <p className="text-lg font-bold text-success">{filtered.filter(o => o.stage === 'fechado_ganho').length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar oportunidades..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <button onClick={() => setView('kanban')} className={cn("px-3 py-2", view === 'kanban' ? 'bg-muted' : '')}><Columns3 className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={cn("px-3 py-2", view === 'list' ? 'bg-muted' : '')}><List className="h-4 w-4" /></button>
            <button onClick={() => setView('forecast')} className={cn("px-3 py-2", view === 'forecast' ? 'bg-muted' : '')}><TrendingUp className="h-4 w-4" /></button>
          </div>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Oportunidade</Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 overflow-x-auto pb-4">
          {activeStages.map(stage => {
            const opps = filtered.filter(o => o.stage === stage.id);
            const stageValue = opps.reduce((s, o) => s + o.estimatedValue, 0);
            return (
              <div key={stage.id} className="min-w-[280px] flex-shrink-0">
                <div className="mb-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{stage.label}</span>
                    <span className="text-xs text-muted-foreground">{opps.length}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">€{(stageValue / 1000).toFixed(0)}K</p>
                </div>
                <div className="space-y-2">
                  {opps.map(opp => (
                    <div key={opp.id} onClick={() => setSelectedOpp(opp)} className="rounded-lg border bg-card p-3 card-shadow cursor-pointer hover:card-shadow-hover transition-shadow">
                      <p className="text-sm font-medium mb-1 leading-tight">{opp.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{opp.clientName}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold">€{(opp.estimatedValue / 1000).toFixed(0)}K</span>
                        <span className="text-muted-foreground">{opp.probability}%</span>
                      </div>
                      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${opp.probability}%` }} />
                      </div>
                      {opp.nextAction && (
                        <div className="mt-2 text-[11px] px-2 py-1 rounded bg-muted text-muted-foreground">
                          ➜ {opp.nextAction}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                        <User className="h-3 w-3" /> {opp.owner}
                        <span className="ml-auto"><Calendar className="h-3 w-3 inline mr-1" />{opp.expectedCloseDate}</span>
                      </div>
                    </div>
                  ))}
                  {opps.length === 0 && (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      Sem oportunidades
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      ) : view === 'forecast' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Forecast Comercial</h3>
          <div className="space-y-3">
            {activeStages.filter(s => filtered.some(o => o.stage === s.id)).map(stage => {
              const opps = filtered.filter(o => o.stage === stage.id);
              const value = opps.reduce((s, o) => s + o.estimatedValue, 0);
              const weighted = opps.reduce((s, o) => s + (o.estimatedValue * o.probability / 100), 0);
              return (
                <div key={stage.id} className="flex items-center gap-4">
                  <span className="text-xs w-36 shrink-0">{stage.label}</span>
                  <div className="flex-1 h-8 bg-muted rounded overflow-hidden flex">
                    <div className="h-full bg-primary/30 flex items-center px-2" style={{ width: `${(value / totalPipeline) * 100}%` }}>
                      <span className="text-[10px] font-mono whitespace-nowrap">€{(value / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono w-20 text-right">~€{(weighted / 1000).toFixed(0)}K</span>
                </div>
              );
            })}
          </div>
          <div className="pt-4 border-t flex justify-between text-sm">
            <span className="text-muted-foreground">Forecast ponderado total:</span>
            <span className="font-bold font-mono text-secondary">€{(weightedPipeline / 1000).toFixed(0)}K</span>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Oportunidade</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Fase</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Valor</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Margem</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Prob.</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Fecho</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(opp => (
                <tr key={opp.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedOpp(opp)}>
                  <td className="p-3 font-medium">{opp.name}</td>
                  <td className="p-3">{opp.clientName}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{PIPELINE_STAGES.find(s => s.id === opp.stage)?.label}</span></td>
                  <td className="p-3 text-right font-mono">€{(opp.estimatedValue / 1000).toFixed(0)}K</td>
                  <td className="p-3 text-right font-mono">{opp.estimatedMargin}%</td>
                  <td className="p-3 text-right">{opp.probability}%</td>
                  <td className="p-3 text-muted-foreground">{opp.expectedCloseDate}</td>
                  <td className="p-3">{opp.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Opportunity Detail */}
      <Dialog open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
        <DialogContent className="max-w-lg">
          {selectedOpp && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedOpp.name}</DialogTitle>
                <DialogDescription>{selectedOpp.clientName} · {selectedOpp.currency}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2 text-sm">
                  <p>Fase: <span className="font-medium">{PIPELINE_STAGES.find(s => s.id === selectedOpp.stage)?.label}</span></p>
                  <p>Valor: <span className="font-bold font-mono">€{(selectedOpp.estimatedValue / 1000).toFixed(0)}K</span></p>
                  <p>Margem: <span className="font-medium">{selectedOpp.estimatedMargin}%</span></p>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Probabilidade: <span className="font-medium">{selectedOpp.probability}%</span></p>
                  <p>Fecho previsto: <span className="font-medium">{selectedOpp.expectedCloseDate}</span></p>
                  <p>Responsável: <span className="font-medium">{selectedOpp.owner}</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedOpp.categories.map(c => <span key={c} className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">{c}</span>)}
                {selectedOpp.brands.map(b => <span key={b} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{b}</span>)}
              </div>
              {selectedOpp.nextAction && (
                <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                  ➜ {selectedOpp.nextAction}
                </div>
              )}
              <DialogFooter className="mt-4">
                <Button variant="outline" size="sm">Editar</Button>
                {selectedOpp.stage !== 'fechado_ganho' && selectedOpp.stage !== 'fechado_perdido' && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">Criar Proposta</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
