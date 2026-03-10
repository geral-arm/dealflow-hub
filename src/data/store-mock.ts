import { StoreCategory, StoreProduct, StorePromotion, StoreSyncLog } from "@/types/store";

export const mockCategories: StoreCategory[] = [
  {
    id: "cat-1", name: "Bebidas", slug: "bebidas", description: "Refrigerantes, sumos, águas e bebidas alcoólicas",
    isActive: true, sortOrder: 1, productCount: 4, createdAt: "2024-01-15", updatedAt: "2024-03-01",
  },
  {
    id: "cat-2", name: "Snacks", slug: "snacks", description: "Batatas fritas, bolachas e aperitivos",
    isActive: true, sortOrder: 2, productCount: 3, createdAt: "2024-01-15", updatedAt: "2024-03-01",
  },
  {
    id: "cat-3", name: "Higiene Pessoal", slug: "higiene-pessoal", description: "Cuidados pessoais e higiene",
    isActive: true, sortOrder: 3, productCount: 2, createdAt: "2024-01-15", updatedAt: "2024-02-20",
  },
  {
    id: "cat-4", name: "Mercearia", slug: "mercearia", description: "Produtos alimentares de mercearia",
    isActive: false, sortOrder: 4, productCount: 0, createdAt: "2024-02-01", updatedAt: "2024-02-01",
  },
];

export const mockProducts: StoreProduct[] = [
  {
    id: "prod-1", sku: "BEB-001", name: "Coca-Cola 330ml (Pack 24)", description: "Lata 330ml, pack de 24 unidades",
    categoryId: "cat-1", brand: "Coca-Cola", unit: "Pack", costPrice: 8.50, salePrice: 12.99,
    stock: 450, minStock: 100, images: [], isActive: true, isFeatured: true, weight: 8.5, barcode: "5449000000996",
    tags: ["bestseller", "refrigerante"], syncStatus: "synced", lastSyncAt: "2024-03-10T08:00:00Z",
    createdAt: "2024-01-15", updatedAt: "2024-03-10",
  },
  {
    id: "prod-2", sku: "BEB-002", name: "Red Bull 250ml (Pack 12)", description: "Lata 250ml, pack de 12",
    categoryId: "cat-1", brand: "Red Bull", unit: "Pack", costPrice: 14.00, salePrice: 21.99,
    stock: 200, minStock: 50, images: [], isActive: true, isFeatured: false, weight: 3.2,
    tags: ["energética"], syncStatus: "synced", lastSyncAt: "2024-03-10T08:00:00Z",
    createdAt: "2024-01-20", updatedAt: "2024-03-10",
  },
  {
    id: "prod-3", sku: "BEB-003", name: "Heineken 330ml (Pack 24)", description: "Lata 330ml, pack de 24",
    categoryId: "cat-1", brand: "Heineken", unit: "Pack", costPrice: 16.00, salePrice: 24.99,
    stock: 320, minStock: 80, images: [], isActive: true, isFeatured: true, weight: 8.5,
    tags: ["cerveja", "premium"], syncStatus: "pending",
    createdAt: "2024-01-20", updatedAt: "2024-03-09",
  },
  {
    id: "prod-4", sku: "SNK-001", name: "Lay's Clássicas 150g (Cx 20)", description: "Batatas fritas clássicas, caixa de 20",
    categoryId: "cat-2", brand: "Lay's", unit: "Caixa", costPrice: 12.00, salePrice: 18.99,
    stock: 180, minStock: 40, images: [], isActive: true, isFeatured: false, weight: 3.5,
    tags: ["snack"], syncStatus: "synced", lastSyncAt: "2024-03-10T08:00:00Z",
    createdAt: "2024-01-25", updatedAt: "2024-03-10",
  },
  {
    id: "prod-5", sku: "SNK-002", name: "Pringles Original 165g (Cx 12)", description: "Tubo 165g, caixa de 12",
    categoryId: "cat-2", brand: "Pringles", unit: "Caixa", costPrice: 15.00, salePrice: 23.50, promoPrice: 19.99,
    stock: 95, minStock: 30, images: [], isActive: true, isFeatured: true, weight: 2.2,
    tags: ["snack", "promo"], syncStatus: "synced", lastSyncAt: "2024-03-10T08:00:00Z",
    createdAt: "2024-02-01", updatedAt: "2024-03-10",
  },
  {
    id: "prod-6", sku: "HIG-001", name: "Dove Gel Banho 500ml (Cx 6)", description: "Gel de banho hidratante, caixa de 6",
    categoryId: "cat-3", brand: "Dove", unit: "Caixa", costPrice: 9.00, salePrice: 14.99,
    stock: 60, minStock: 20, images: [], isActive: true, isFeatured: false, weight: 3.2,
    tags: ["higiene"], syncStatus: "error",
    createdAt: "2024-02-10", updatedAt: "2024-03-08",
  },
  {
    id: "prod-7", sku: "SNK-003", name: "Oreo Original 154g (Cx 16)", description: "Bolachas Oreo, caixa de 16",
    categoryId: "cat-2", brand: "Oreo", unit: "Caixa", costPrice: 10.50, salePrice: 16.99,
    stock: 140, minStock: 35, images: [], isActive: false, isFeatured: false, weight: 2.8,
    tags: ["bolacha"], syncStatus: "pending",
    createdAt: "2024-02-15", updatedAt: "2024-03-05",
  },
];

export const mockPromotions: StorePromotion[] = [
  {
    id: "promo-1", name: "Campanha Primavera Snacks", description: "15% desconto em todos os snacks",
    type: "percentage", value: 15, productIds: [], categoryIds: ["cat-2"],
    startDate: "2024-03-01", endDate: "2024-03-31", isActive: true,
    usedCount: 42, createdAt: "2024-02-25", updatedAt: "2024-03-01",
  },
  {
    id: "promo-2", name: "Pringles Especial", description: "Preço fixo 19.99€ por caixa",
    type: "fixed", value: 19.99, productIds: ["prod-5"], categoryIds: [],
    startDate: "2024-03-01", endDate: "2024-03-15", isActive: true, code: "PRINGLES20",
    usedCount: 18, createdAt: "2024-02-28", updatedAt: "2024-03-01",
  },
  {
    id: "promo-3", name: "Leve 3 Pague 2 Bebidas", description: "Compre 3, pague apenas 2",
    type: "bogo", value: 1, productIds: [], categoryIds: ["cat-1"],
    startDate: "2024-04-01", endDate: "2024-04-30", isActive: false, minQuantity: 3,
    usedCount: 0, createdAt: "2024-03-05", updatedAt: "2024-03-05",
  },
];

export const mockSyncLogs: StoreSyncLog[] = [
  {
    id: "sync-1", type: "push", status: "success", itemsProcessed: 7, itemsFailed: 0,
    details: "Catálogo completo sincronizado com sucesso", triggeredBy: "Sistema (Automático)",
    startedAt: "2024-03-10T08:00:00Z", completedAt: "2024-03-10T08:00:12Z",
  },
  {
    id: "sync-2", type: "push", status: "partial", itemsProcessed: 7, itemsFailed: 1,
    details: "Falha ao sincronizar prod-6: timeout na API externa", triggeredBy: "Manual",
    startedAt: "2024-03-09T14:30:00Z", completedAt: "2024-03-09T14:30:25Z",
  },
  {
    id: "sync-3", type: "pull", status: "success", itemsProcessed: 12, itemsFailed: 0,
    details: "Encomendas e stock atualizados do site", triggeredBy: "Sistema (Automático)",
    startedAt: "2024-03-09T06:00:00Z", completedAt: "2024-03-09T06:00:08Z",
  },
  {
    id: "sync-4", type: "push", status: "error", itemsProcessed: 0, itemsFailed: 7,
    details: "API KnownBrands Direct indisponível (503)", triggeredBy: "Manual",
    startedAt: "2024-03-08T16:45:00Z", completedAt: "2024-03-08T16:45:03Z",
  },
];
