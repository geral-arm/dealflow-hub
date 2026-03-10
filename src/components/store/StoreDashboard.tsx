import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, AlertTriangle, RefreshCw, ShoppingBag, Tag } from "lucide-react";
import { StoreProduct, StorePromotion, StoreCategory } from "@/types/store";

interface Props {
  products: StoreProduct[];
  categories: StoreCategory[];
  promotions: StorePromotion[];
  isSyncing: boolean;
}

export function StoreDashboard({ products, categories, promotions, isSyncing }: Props) {
  const activeProducts = products.filter(p => p.isActive).length;
  const pendingSync = products.filter(p => p.syncStatus === "pending").length;
  const errorSync = products.filter(p => p.syncStatus === "error").length;
  const activePromos = promotions.filter(p => p.isActive).length;
  const activeCategories = categories.filter(c => c.isActive).length;

  const totalRevenue = products.reduce((sum, p) => sum + (p.salePrice * p.stock), 0);
  const avgMargin = products.length > 0
    ? products.reduce((sum, p) => sum + ((p.salePrice - p.costPrice) / p.salePrice * 100), 0) / products.length
    : 0;

  const kpis = [
    { label: "Produtos Ativos", value: activeProducts, total: products.length, icon: Package, color: "text-primary" },
    { label: "Categorias Ativas", value: activeCategories, total: categories.length, icon: ShoppingBag, color: "text-secondary" },
    { label: "Promoções Ativas", value: activePromos, total: promotions.length, icon: Tag, color: "text-accent" },
    { label: "Margem Média", value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{kpi.value}</div>
              {"total" in kpi && kpi.total !== undefined && (
                <p className="text-xs text-muted-foreground">de {kpi.total} total</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync status */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            Estado da Sincronização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-secondary">{products.filter(p => p.syncStatus === "synced").length}</Badge>
              <span className="text-sm text-muted-foreground">Sincronizados</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-accent text-accent">{pendingSync}</Badge>
              <span className="text-sm text-muted-foreground">Pendentes</span>
            </div>
            {errorSync > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{errorSync}</Badge>
                <span className="text-sm text-muted-foreground">Com erro</span>
              </div>
            )}
          </div>
          {(pendingSync > 0 || errorSync > 0) && (
            <div className="mt-3 flex items-center gap-2 text-xs text-accent">
              <AlertTriangle className="h-3 w-3" />
              Existem itens por sincronizar com o KnownBrands Direct
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue overview */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-display">Valor em Stock (PVP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-display">
            €{totalRevenue.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Baseado em {products.reduce((s, p) => s + p.stock, 0)} unidades em stock
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
