import { useState } from "react";
import { motion } from "framer-motion";
import { mockActivities } from "@/data/crm-mock";
import type { Activity, ActivityType } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, CheckCircle2, Circle, Phone, Mail, CalendarCheck, Clock, ListTodo, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig: Record<ActivityType, { icon: any; label: string; color: string }> = {
  tarefa: { icon: ListTodo, label: 'Tarefa', color: 'bg-primary/10 text-primary' },
  follow_up: { icon: Bell, label: 'Follow-up', color: 'bg-warning/10 text-warning' },
  chamada: { icon: Phone, label: 'Chamada', color: 'bg-info/10 text-info' },
  reuniao: { icon: CalendarCheck, label: 'Reunião', color: 'bg-secondary/10 text-secondary' },
  reminder: { icon: Clock, label: 'Reminder', color: 'bg-muted text-muted-foreground' },
  email: { icon: Mail, label: 'Email', color: 'bg-accent/10 text-accent-foreground' },
};

export function CrmActivities() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('pending');
  const [activities, setActivities] = useState(mockActivities);

  const now = new Date();
  const filtered = activities.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.relatedTo.toLowerCase().includes(search.toLowerCase());
    if (filter === 'pending') return matchSearch && !a.completed;
    if (filter === 'completed') return matchSearch && a.completed;
    if (filter === 'overdue') return matchSearch && !a.completed && new Date(a.dueDate) < now;
    return matchSearch;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const toggleComplete = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar atividades..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex border rounded-md">
            {(['pending', 'overdue', 'completed', 'all'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-2 text-xs capitalize", filter === f ? 'bg-muted font-medium' : 'text-muted-foreground')}>
                {f === 'pending' ? 'Pendentes' : f === 'overdue' ? 'Em Atraso' : f === 'completed' ? 'Concluídas' : 'Todas'}
              </button>
            ))}
          </div>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Atividade</Button>
      </div>

      <div className="space-y-2">
        {filtered.map(activity => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          const isOverdue = !activity.completed && new Date(activity.dueDate) < now;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors", activity.completed && "opacity-60")}
            >
              <button onClick={() => toggleComplete(activity.id)} className="mt-0.5 shrink-0">
                {activity.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className={cn("h-5 w-5", isOverdue ? "text-destructive" : "text-muted-foreground")} />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={cn("text-sm font-medium", activity.completed && "line-through")}>{activity.title}</p>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", config.color)}>{config.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{activity.relatedTo}</span>
                  <span className={cn(isOverdue && "text-destructive font-medium")}>
                    {activity.dueDate}
                  </span>
                  <span>{activity.owner}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
            Nenhuma atividade encontrada
          </div>
        )}
      </div>
    </div>
  );
}
