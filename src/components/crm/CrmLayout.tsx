import { ReactNode, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Target,
  Columns3,
  FileText,
  MessageSquare,
  CalendarCheck,
  PieChart,
  LucideIcon,
} from "lucide-react";

export type CrmTab = 'dashboard' | 'leads' | 'clients' | 'opportunities' | 'pipeline' | 'proposals' | 'negotiations' | 'activities' | 'reports';

interface CrmLayoutProps {
  activeTab: CrmTab;
  onTabChange: (tab: CrmTab) => void;
  children: ReactNode;
}

const tabs: { id: CrmTab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: UserPlus },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Columns3 },
  { id: 'proposals', label: 'Propostas', icon: FileText },
  { id: 'negotiations', label: 'Negociações', icon: MessageSquare },
  { id: 'activities', label: 'Atividades', icon: CalendarCheck },
  { id: 'reports', label: 'Relatórios', icon: PieChart },
];

export function CrmLayout({ activeTab, onTabChange, children }: CrmLayoutProps) {
  return (
    <AppLayout>
      <div className="space-y-4">
        {/* CRM Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">CRM Comercial</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestão de clientes, leads e pipeline de vendas
            </p>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex gap-1 border-b overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2",
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {children}
      </div>
    </AppLayout>
  );
}
