import { useState, useCallback } from "react";
import { StoreProduct, StoreCategory, StorePromotion, StoreSyncLog } from "@/types/store";
import { mockProducts, mockCategories, mockPromotions, mockSyncLogs } from "@/data/store-mock";
import { toast } from "sonner";

export function useStoreState() {
  const [products, setProducts] = useState<StoreProduct[]>(mockProducts);
  const [categories, setCategories] = useState<StoreCategory[]>(mockCategories);
  const [promotions, setPromotions] = useState<StorePromotion[]>(mockPromotions);
  const [syncLogs, setSyncLogs] = useState<StoreSyncLog[]>(mockSyncLogs);
  const [isSyncing, setIsSyncing] = useState(false);

  // Products CRUD
  const addProduct = useCallback((product: Omit<StoreProduct, "id" | "createdAt" | "updatedAt" | "syncStatus">) => {
    const newProduct: StoreProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      syncStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    toast.success(`Produto "${newProduct.name}" adicionado`);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<StoreProduct>) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString(), syncStatus: "pending" as const } : p
    ));
    toast.success("Produto atualizado");
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Produto removido");
  }, []);

  // Categories CRUD
  const addCategory = useCallback((category: Omit<StoreCategory, "id" | "createdAt" | "updatedAt" | "productCount">) => {
    const newCategory: StoreCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success(`Categoria "${newCategory.name}" criada`);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<StoreCategory>) => {
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
    toast.success("Categoria atualizada");
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) {
      toast.error("Não é possível remover uma categoria com produtos associados");
      return false;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success("Categoria removida");
    return true;
  }, [products]);

  // Promotions CRUD
  const addPromotion = useCallback((promo: Omit<StorePromotion, "id" | "createdAt" | "updatedAt" | "usedCount">) => {
    const newPromo: StorePromotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPromotions(prev => [...prev, newPromo]);
    toast.success(`Promoção "${newPromo.name}" criada`);
    return newPromo;
  }, []);

  const updatePromotion = useCallback((id: string, updates: Partial<StorePromotion>) => {
    setPromotions(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
    toast.success("Promoção atualizada");
  }, []);

  const deletePromotion = useCallback((id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    toast.success("Promoção removida");
  }, []);

  // Price update
  const updatePrice = useCallback((productId: string, costPrice?: number, salePrice?: number, promoPrice?: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        ...(costPrice !== undefined && { costPrice }),
        ...(salePrice !== undefined && { salePrice }),
        ...(promoPrice !== undefined ? { promoPrice } : {}),
        updatedAt: new Date().toISOString(),
        syncStatus: "pending" as const,
      };
    }));
    toast.success("Preço atualizado");
  }, []);

  // Sync
  const triggerSync = useCallback(async () => {
    setIsSyncing(true);
    const pendingProducts = products.filter(p => p.syncStatus === "pending" || p.syncStatus === "error");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const failed = Math.random() > 0.8 ? 1 : 0;
    const processed = pendingProducts.length;

    const log: StoreSyncLog = {
      id: `sync-${Date.now()}`,
      type: "push",
      status: failed > 0 ? "partial" : "success",
      itemsProcessed: processed,
      itemsFailed: failed,
      details: failed > 0
        ? `${processed - failed} itens sincronizados, ${failed} falha(s)`
        : `${processed} itens sincronizados com sucesso`,
      triggeredBy: "Manual",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setSyncLogs(prev => [log, ...prev]);

    // Update product sync statuses
    setProducts(prev => prev.map(p => {
      if (p.syncStatus === "pending" || p.syncStatus === "error") {
        return { ...p, syncStatus: "synced" as const, lastSyncAt: new Date().toISOString() };
      }
      return p;
    }));

    setIsSyncing(false);
    toast.success(`Sincronização concluída: ${processed} itens processados`);
    return log;
  }, [products]);

  return {
    products, categories, promotions, syncLogs, isSyncing,
    addProduct, updateProduct, deleteProduct,
    addCategory, updateCategory, deleteCategory,
    addPromotion, updatePromotion, deletePromotion,
    updatePrice, triggerSync,
  };
}
