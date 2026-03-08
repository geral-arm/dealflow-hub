import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDeals } from "@/data/deals-mock";
import { DEAL_PRIORITY_CONFIG } from "@/types/deals";

export function DealsTasks() {
  const allTasks = mockDeals.flatMap(d => d.tasks.map(t => ({ ...t, dealCode: d.code, dealName: d.name })));
  const pending = allTasks.filter(t => t.status !== 'concluida' && t.status !== 'cancelada');
  const overdue = allTasks.filter(t => t.status === 'atrasada');

  const statusColors: Record<string, string> = {
    pendente: 'bg-muted text-muted-foreground',
    em_progresso: 'bg-info/15 text-info',
    concluida: 'bg-success/15 text-success',
    atrasada: 'bg-destructive/15 text-destructive',
    cancelada: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6 mt-4">
      {overdue.length > 0 && (
        <Card className="border-destructive/20">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display text-destructive">Tarefas em Atraso ({overdue.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {overdue.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="font-mono">{task.dealCode}</span>
                    <span>·</span>
                    <span>{task.assignee}</span>
                    <span>·</span>
                    <span>{task.dueDate}</span>
                  </div>
                </div>
                <Badge variant="outline" className={DEAL_PRIORITY_CONFIG[task.priority].color}>{DEAL_PRIORITY_CONFIG[task.priority].label}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-display">Todas as Tarefas ({allTasks.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {allTasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="font-mono">{task.dealCode}</span>
                  <span>·</span>
                  <span>{task.assignee}</span>
                  <span>·</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>
              <Badge variant="outline" className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
            </motion.div>
          ))}
          {allTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Sem tarefas</p>}
        </CardContent>
      </Card>
    </div>
  );
}
