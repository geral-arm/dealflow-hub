import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LotsDashboard } from "./LotsDashboard";
import { LotsDirectory } from "./LotsDirectory";
import { LotDetail } from "./LotDetail";

const tabs = [
  { id: "dashboard", label: "Visão geral" },
  { id: "directory", label: "Lotes" },
];

export function DealsLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLot, setSelectedLot] = useState<string | null>(null);

  if (selectedLot) {
    return <LotDetail lotNumber={selectedLot} onBack={() => setSelectedLot(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Deals · Lotes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Camiões/paletes comprados (KB26-NNN) e respetivas vendas parciais (sub-lotes). Stock, margem e cobranças por lote.
        </p>
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

        <TabsContent value="dashboard"><LotsDashboard onOpenLot={setSelectedLot} /></TabsContent>
        <TabsContent value="directory"><LotsDirectory onOpenLot={setSelectedLot} /></TabsContent>
      </Tabs>
    </div>
  );
}
