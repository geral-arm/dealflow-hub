import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useStoreState } from "@/hooks/useStoreState";
import { StoreDashboard } from "./StoreDashboard";
import { StoreProductsTab } from "./StoreProductsTab";
import { StoreCategoriesTab } from "./StoreCategoriesTab";
import { StorePricingTab } from "./StorePricingTab";
import { StorePromotionsTab } from "./StorePromotionsTab";
import { StoreSyncTab } from "./StoreSyncTab";

const tabs = [
  { value: "dashboard", label: "Dashboard" },
  { value: "products", label: "Produtos" },
  { value: "categories", label: "Categorias" },
  { value: "pricing", label: "Preços" },
  { value: "promotions", label: "Promoções" },
  { value: "sync", label: "Sincronização" },
];

export function StoreLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const store = useStoreState();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Loja Online</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão do catálogo, preços e sincronização com KnownBrands Direct
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 border border-border p-1 h-auto flex-wrap gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs data-[state=active]:bg-background">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard">
          <StoreDashboard products={store.products} categories={store.categories} promotions={store.promotions} isSyncing={store.isSyncing} />
        </TabsContent>
        <TabsContent value="products">
          <StoreProductsTab products={store.products} categories={store.categories} onAdd={store.addProduct} onUpdate={store.updateProduct} onDelete={store.deleteProduct} />
        </TabsContent>
        <TabsContent value="categories">
          <StoreCategoriesTab categories={store.categories} onAdd={store.addCategory} onUpdate={store.updateCategory} onDelete={store.deleteCategory} />
        </TabsContent>
        <TabsContent value="pricing">
          <StorePricingTab products={store.products} categories={store.categories} onUpdatePrice={store.updatePrice} />
        </TabsContent>
        <TabsContent value="promotions">
          <StorePromotionsTab promotions={store.promotions} categories={store.categories} onAdd={store.addPromotion} onUpdate={store.updatePromotion} onDelete={store.deletePromotion} />
        </TabsContent>
        <TabsContent value="sync">
          <StoreSyncTab syncLogs={store.syncLogs} products={store.products} isSyncing={store.isSyncing} onSync={store.triggerSync} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
