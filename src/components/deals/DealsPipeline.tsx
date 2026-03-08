import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES, DEAL_HEALTH_CONFIG, DEAL_PRIORITY_CONFIG, type DealStage } from "@/types/deals";
import { GripVertical, Eye, ArrowRight, Filter, LayoutList, BarChart3 } from "lucide-react";

interface Props {
  onOpenDeal: (id: string) => void;
}

type ViewMode = 'kanban' | 'list' | 'forecast';

export function DealsPipeline({ onOpenDeal }: Props) {
  const [view, setView] = useState<ViewMode>('kanban');
  const [filterOwner, setFilterOwner] = useState<string>('');

  const activePipelineStages = DEAL_STAGES.filter(s => !['concluido', 'perdido', 'cancelado'].includes(s.id));
  const filteredDeals = filterOwner ? mockDeals.filter(d => d.owner === filterOwner) : mockDeals;
  const owners = [...new Set(mockDeals.map(d => d.owner))];

  if (view === 'list') {
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <ViewSwitcher view={view} setView={setView} />
          <OwnerFilter owners={owners} value={filterOwner} onChange={setFilterOwner} />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Deal</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Cliente</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Fornecedor</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase">Valor</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Margem</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Fase</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Owner</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map(deal => {
                    const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
                    return (
                      <tr key={deal.id} className="border-b border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => onOpenDeal(deal.id)}>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{deal.code}</td>
                        <td className="p-3 font-medium text-card-foreground">{deal.clientName}</td>
                        <td className="p-3 text-muted-foreground hidden lg:table-cell">{deal.supplierName}</td>
                        <td className="p-3 text-right font-semibold">€{(deal.totalSellValue / 1000).toFixed(0)}K</td>
                        <td className="p-3 text-right text-success font-medium hidden md:table-cell">{deal.marginPercent.toFixed(1)}%</td>
                        <td className="p-3"><Badge variant="outline" className={`text-[10px] ${stageConf?.color}`}>{stageConf?.label}</Badge></td>
                        <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{deal.owner}</td>
                        <td className="p-3"><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'forecast') {
    const forecastStages = activePipelineStages.map(stage => {
      const deals = filteredDeals.filter(d => d.stage === stage.id);
      const weighted = deals.reduce((s, d) => s + (d.totalSellValue * d.probability / 100), 0);
      return { ...stage, deals, total: deals.reduce((s, d) => s + d.totalSellValue, 0), weighted };
    }).filter(s => s.deals.length > 0);

    const totalWeighted = forecastStages.reduce((s, st) => s + st.weighted, 0);

    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <ViewSwitcher view={view} setView={setView} />
          <OwnerFilter owners={owners} value={filterOwner} onChange={setFilterOwner} />
        </div>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">Forecast Comercial</CardTitle>
              <span className="text-sm font-semibold text-success">Ponderado: €{(totalWeighted / 1000).toFixed(0)}K</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {forecastStages.map(stage => (
              <div key={stage.id} className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={stage.color}>{stage.label}</Badge>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">{stage.deals.length} deals</span>
                    <span className="font-medium">€{(stage.total / 1000).toFixed(0)}K</span>
                    <span className="font-semibold text-success">Pond: €{(stage.weighted / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Kanban
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <ViewSwitcher view={view} setView={setView} />
        <OwnerFilter owners={owners} value={filterOwner} onChange={setFilterOwner} />
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {activePipelineStages.map((stage, si) => {
            const deals = filteredDeals.filter(d => d.stage === stage.id);
            const stageValue = deals.reduce((s, d) => s + d.totalSellValue, 0);
            const stageMargin = deals.reduce((s, d) => s + d.marginTotal, 0);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.05 }}
                className="w-72 shrink-0"
              >
                <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Badge variant="outline" className={`text-[10px] ${stage.color}`}>{stage.label}</Badge>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{deals.length} deals</span>
                        <span className="text-xs font-medium text-card-foreground">€{(stageValue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {deals.map((deal, di) => {
                      const health = DEAL_HEALTH_CONFIG[deal.health];
                      const priority = DEAL_PRIORITY_CONFIG[deal.priority];
                      return (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 + di * 0.03 }}
                          onClick={() => onOpenDeal(deal.id)}
                          className="p-3 rounded-md bg-card border border-border/60 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-mono text-[10px] text-muted-foreground">{deal.code}</span>
                            <div className="flex items-center gap-1">
                              {deal.watchlist && <Eye className="h-3 w-3 text-warning" />}
                              <span className={`text-[10px] ${health.color}`}>{health.icon}</span>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-card-foreground mb-1 line-clamp-2">{deal.name}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                            <span>{deal.clientName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-card-foreground">€{(deal.totalSellValue / 1000).toFixed(0)}K</span>
                            <span className="text-[10px] font-medium text-success">{deal.marginPercent.toFixed(1)}%</span>
                            <Badge variant="outline" className={`text-[9px] py-0 ${priority.color}`}>{priority.label}</Badge>
                          </div>
                          {deal.nextAction && (
                            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/30 truncate">→ {deal.nextAction}</p>
                          )}
                        </motion.div>
                      );
                    })}
                    {deals.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-6">Sem deals</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ViewSwitcher({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs" onClick={() => setView('kanban')}>
        <GripVertical className="h-3 w-3 mr-1" /> Kanban
      </Button>
      <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs" onClick={() => setView('list')}>
        <LayoutList className="h-3 w-3 mr-1" /> Lista
      </Button>
      <Button variant={view === 'forecast' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs" onClick={() => setView('forecast')}>
        <BarChart3 className="h-3 w-3 mr-1" /> Forecast
      </Button>
    </div>
  );
}

function OwnerFilter({ owners, value, onChange }: { owners: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      <select value={value} onChange={e => onChange(e.target.value)} className="text-xs bg-card border border-border rounded-md px-2 py-1.5 text-card-foreground">
        <option value="">Todos os owners</option>
        {owners.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
