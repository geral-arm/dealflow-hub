export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  brand: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  promoPrice?: number;
  stock: number;
  minStock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  barcode?: string;
  tags: string[];
  syncStatus: "synced" | "pending" | "error";
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorePromotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "bogo";
  value: number;
  productIds: string[];
  categoryIds: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  minQuantity?: number;
  maxUses?: number;
  usedCount: number;
  code?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSyncLog {
  id: string;
  type: "push" | "pull";
  status: "success" | "error" | "partial";
  itemsProcessed: number;
  itemsFailed: number;
  details: string;
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
}
