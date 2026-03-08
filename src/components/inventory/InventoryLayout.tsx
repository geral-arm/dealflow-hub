import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { InventoryDashboard } from "./InventoryDashboard";
import { InventoryWarehouses } from "./InventoryWarehouses";
import { InventoryStock } from "./InventoryStock";
import { InventoryShipments } from "./InventoryShipments";
import { InventoryCarriers } from "./InventoryCarriers";
import { InventoryMovements } from "./InventoryMovements";
import { InventoryIncidents } from "./InventoryIncidents";
import { InventoryReports } from "./InventoryReports";

const tabs = [
  { value: "dashboard", label: "Dashboard" },
  { value: "warehouses", label: "Armazéns" },
  { value: "stock", label: "Inventário" },
  { value: "shipments", label: "Envios" },
  { value: "carriers", label: "Transportadoras" },
  { value: "movements", label: "Movimentos" },
  { value: "incidents", label: "Incidências" },
  { value: "reports", label: "Relatórios" },
];

export function InventoryLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Inventário & Logística</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestão de stock, armazéns, envios e operações logísticas</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 border border-border p-1 h-auto flex-wrap gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs data-[state=active]:bg-background">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard"><InventoryDashboard /></TabsContent>
        <TabsContent value="warehouses"><InventoryWarehouses /></TabsContent>
        <TabsContent value="stock"><InventoryStock /></TabsContent>
        <TabsContent value="shipments"><InventoryShipments /></TabsContent>
        <TabsContent value="carriers"><InventoryCarriers /></TabsContent>
        <TabsContent value="movements"><InventoryMovements /></TabsContent>
        <TabsContent value="incidents"><InventoryIncidents /></TabsContent>
        <TabsContent value="reports"><InventoryReports /></TabsContent>
      </Tabs>
    </div>
  );
}
