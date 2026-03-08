import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProcurementActivities } from "@/data/procurement-mock";
import { CheckCircle, Circle, Phone, Calendar, Bell, ClipboardList, MessageSquare, Plus } from "lucide-react";

const typeIcons: Record<string, typeof Phone> = { tarefa: ClipboardList, follow_up: MessageSquare, chamada: Phone, reuniao: Calendar, reminder: Bell };

export function ProcurementActivities() {
  const [activities, setActivities] = useState(mockProcurementActivities);

  const toggle = (id: string) => setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  const pending = activities.filter(a => !a.completed);
  const done = activities.filter(a => a.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Atividades Procurement</h2>
          <p className="text-sm text-muted-foreground">{pending.length} pendentes · {done.length} concluídas</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Atividade</Button>
      </div>

      <div className="space-y-6">
        {[{ title: 'Pendentes', items: pending }, { title: 'Concluídas', items: done }].map(group => (
          <div key={group.title}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{group.title}</p>
            <Card className="card-shadow">
              <CardContent className="p-0 divide-y">
                {group.items.length === 0 && <p className="text-sm text-muted-foreground p-4">Nenhuma atividade</p>}
                {group.items.map(a => {
                  const Icon = typeIcons[a.type] || ClipboardList;
                  const overdue = !a.completed && new Date(a.dueDate) < new Date();
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <button onClick={() => toggle(a.id)} className="shrink-0">
                        {a.completed ? <CheckCircle className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                      </button>
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${a.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.relatedTo} · {a.owner}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{a.type.replace('_', ' ')}</Badge>
                        <span className={`text-xs ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{a.dueDate}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
