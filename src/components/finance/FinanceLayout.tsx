import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FinanceCashPosition } from "./FinanceCashPosition";
import { FinanceCashFlow } from "./FinanceCashFlow";
import { FinanceDealToCash } from "./FinanceDealToCash";
import { FinanceKpis } from "./FinanceKpis";
import { FinanceScenarios } from "./FinanceScenarios";
import { FinanceAlerts } from "./FinanceAlerts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const tabs = [
  { value: "cash", label: "Cash Position" },
  { value: "flow", label: "Cash Flow" },
  { value: "deals", label: "Deal-to-Cash" },
  { value: "kpis", label: "KPIs & Tendências" },
  { value: "scenarios", label: "Cenários" },
  { value: "alerts", label: "Alertas" },
];

export function FinanceLayout() {
  const [tab, setTab] = useState("cash");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Financial Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tesouraria multi-banco, forecast de cash e inteligência de margem para a operação KnownBrands
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" /> Export PDF
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50 border border-border p-1 h-auto flex-wrap gap-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs data-[state=active]:bg-background">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="cash"><FinanceCashPosition /></TabsContent>
        <TabsContent value="flow"><FinanceCashFlow /></TabsContent>
        <TabsContent value="deals"><FinanceDealToCash /></TabsContent>
        <TabsContent value="kpis"><FinanceKpis /></TabsContent>
        <TabsContent value="scenarios"><FinanceScenarios /></TabsContent>
        <TabsContent value="alerts"><FinanceAlerts /></TabsContent>
      </Tabs>
    </div>
  );
}