import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_STAGES } from "@/types/deals";
import { ArrowRight } from "lucide-react";

interface Props {
  onOpenDeal: (id: string) => void;
}

export function DealsApprovals({ onOpenDeal }: Props) {
  const pending = mockDeals.filter(d => d.approvalStatus === 'pendente' || d.approvalStatus === 'em_revisao');
  const approved = mockDeals.filter(d => d.approvalStatus === 'aprovado' || d.approvalStatus === 'aprovado_condicao');

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Pendentes de Aprovação ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum deal pendente de aprovação</p>
          ) : pending.map((deal, i) => {
            const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
            const pendingApproval = deal.approvals.find(a => a.status === 'pendente' || a.status === 'em_revisao');
            return (
              <motion.div key={deal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-warning/20 bg-warning/5 cursor-pointer hover:bg-warning/10 transition-colors"
                onClick={() => onOpenDeal(deal.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{deal.code}</span>
                    <Badge variant="outline" className={stageConf?.color}>{stageConf?.label}</Badge>
                  </div>
                  <p className="text-sm font-medium text-card-foreground">{deal.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>€{(deal.totalSellValue / 1000).toFixed(0)}K</span>
                    <span>Margem: {deal.marginPercent.toFixed(1)}%</span>
                    {pendingApproval && <span>Aprovador: {pendingApproval.approver}</span>}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Aprovados Recentes ({approved.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {approved.slice(0, 5).map(deal => {
            const stageConf = DEAL_STAGES.find(s => s.id === deal.stage);
            return (
              <div key={deal.id} className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/10 cursor-pointer hover:bg-success/10 transition-colors" onClick={() => onOpenDeal(deal.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{deal.code}</span>
                    <span className="text-sm font-medium text-card-foreground">{deal.name}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/15 text-success border-success/20 text-xs">Aprovado</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
