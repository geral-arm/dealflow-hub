import { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  GitCompare,
  Calculator,
  FileText,
  Star,
  CalendarCheck,
  PieChart,
  LucideIcon,
} from "lucide-react";

export type ProcurementTab = 'dashboard' | 'opportunities' | 'suppliers' | 'quotes' | 'margin' | 'purchase_orders' | 'evaluations' | 'activities' | 'reports';

interface ProcurementLayoutProps {
  activeTab: ProcurementTab;
  onTabChange: (tab: ProcurementTab) => void;
  children: ReactNode;
}

const tabs: { id: ProcurementTab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'opportunities', label: 'Oportunidades', icon: Package },
  { id: 'suppliers', label: 'Fornecedores', icon: Users },
  { id: 'quotes', label: 'Cotações', icon: GitCompare },
  { id: 'margin', label: 'Margem', icon: Calculator },
  { id: 'purchase_orders', label: 'Purchase Orders', icon: FileText },
  { id: 'evaluations', label: 'Avaliações', icon: Star },
  { id: 'activities', label: 'Atividades', icon: CalendarCheck },
  { id: 'reports', label: 'Relatórios', icon: PieChart },
];

export function ProcurementLayout({ activeTab, onTabChange, children }: ProcurementLayoutProps) {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Procurement / Trading</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Sourcing, cotações, margens e ordens de compra
            </p>
          </div>
        </div>

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

        {children}
      </div>
    </AppLayout>
  );
}
