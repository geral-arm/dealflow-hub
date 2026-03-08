import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DealsDashboard } from "./DealsDashboard";
import { DealsPipeline } from "./DealsPipeline";
import { DealsDirectory } from "./DealsDirectory";
import { DealsApprovals } from "./DealsApprovals";
import { DealsTasks } from "./DealsTasks";
import { DealsRisks } from "./DealsRisks";
import { DealsReports } from "./DealsReports";
import { DealDetail } from "./DealDetail";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pipeline", label: "Pipeline" },
  { id: "directory", label: "Diretório" },
  { id: "approvals", label: "Aprovações" },
  { id: "tasks", label: "Tarefas" },
  { id: "risks", label: "Riscos" },
  { id: "reports", label: "Relatórios" },
];

export function DealsLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  if (selectedDealId) {
    return <DealDetail dealId={selectedDealId} onBack={() => setSelectedDealId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Deals</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestão centralizada de operações comerciais FMCG</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard"><DealsDashboard onOpenDeal={setSelectedDealId} /></TabsContent>
        <TabsContent value="pipeline"><DealsPipeline onOpenDeal={setSelectedDealId} /></TabsContent>
        <TabsContent value="directory"><DealsDirectory onOpenDeal={setSelectedDealId} /></TabsContent>
        <TabsContent value="approvals"><DealsApprovals onOpenDeal={setSelectedDealId} /></TabsContent>
        <TabsContent value="tasks"><DealsTasks /></TabsContent>
        <TabsContent value="risks"><DealsRisks /></TabsContent>
        <TabsContent value="reports"><DealsReports /></TabsContent>
      </Tabs>
    </div>
  );
}
