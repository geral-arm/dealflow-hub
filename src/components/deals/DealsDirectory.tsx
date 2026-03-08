import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES, DEAL_HEALTH_CONFIG } from "@/types/deals";
import { Search, ArrowRight, Eye } from "lucide-react";

interface Props {
  onOpenDeal: (id: string) => void;
}

export function DealsDirectory({ onOpenDeal }: Props) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filtered = mockDeals.filter(d => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.supplierName.toLowerCase().includes(search.toLowerCase());
    const matchesStage = !stageFilter || d.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar por deal, cliente, fornecedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="text-xs bg-card border border-border rounded-md px-3 py-2 text-card-foreground">
          <option value="">Todas as fases</option>
          {DEAL_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Código</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Nome</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Cliente</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Fornecedor</th>
                  <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase">Valor</th>
                  <th className="p-3 text-right text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Margem</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Fase</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Saúde</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Dias</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((deal, i) => {
                  const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
                  const health = DEAL_HEALTH_CONFIG[deal.health];
                  return (
                    <motion.tr key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-border/40 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => onOpenDeal(deal.id)}
                    >
                      <td className="p-3 font-mono text-xs text-muted-foreground">{deal.code}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          {deal.watchlist && <Eye className="h-3 w-3 text-warning shrink-0" />}
                          <span className="font-medium text-card-foreground truncate max-w-[200px]">{deal.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{deal.clientName}</td>
                      <td className="p-3 text-muted-foreground hidden lg:table-cell">{deal.supplierName}</td>
                      <td className="p-3 text-right font-semibold">€{(deal.totalSellValue / 1000).toFixed(0)}K</td>
                      <td className="p-3 text-right text-success font-medium hidden sm:table-cell">{deal.marginPercent.toFixed(1)}%</td>
                      <td className="p-3"><Badge variant="outline" className={`text-[10px] ${stageConf?.color}`}>{stageConf?.label}</Badge></td>
                      <td className="p-3"><span className={`text-xs ${health.color}`}>{health.icon} {health.label}</span></td>
                      <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{deal.daysInPipeline}d</td>
                      <td className="p-3"><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhum deal encontrado</p>}
        </CardContent>
      </Card>
    </div>
  );
}
