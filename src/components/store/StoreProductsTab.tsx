import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { StoreProduct, StoreCategory } from "@/types/store";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
  products: StoreProduct[];
  categories: StoreCategory[];
  onAdd: (product: Omit<StoreProduct, "id" | "createdAt" | "updatedAt" | "syncStatus">) => void;
  onUpdate: (id: string, updates: Partial<StoreProduct>) => void;
  onDelete: (id: string) => void;
}

const emptyProduct = {
  sku: "", name: "", description: "", categoryId: "", brand: "", unit: "Pack",
  costPrice: 0, salePrice: 0, stock: 0, minStock: 0, images: [] as string[],
  isActive: true, isFeatured: false, tags: [] as string[], barcode: "",
};

export function StoreProductsTab({ products, categories, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [detailProduct, setDetailProduct] = useState<StoreProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.categoryId === filterCategory;
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "active" && p.isActive) ||
      (filterStatus === "inactive" && !p.isActive) ||
      (filterStatus === "pending" && p.syncStatus === "pending") ||
      (filterStatus === "error" && p.syncStatus === "error");
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };

  const openEdit = (p: StoreProduct) => {
    setEditingProduct(p);
    setForm({
      sku: p.sku, name: p.name, description: p.description, categoryId: p.categoryId,
      brand: p.brand, unit: p.unit, costPrice: p.costPrice, salePrice: p.salePrice,
      stock: p.stock, minStock: p.minStock, images: p.images, isActive: p.isActive,
      isFeatured: p.isFeatured, tags: p.tags, barcode: p.barcode || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku || !form.categoryId) return;
    if (editingProduct) {
      onUpdate(editingProduct.id, form);
    } else {
      onAdd(form as any);
    }
    setDialogOpen(false);
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "—";

  const syncBadge = (status: string) => {
    if (status === "synced") return <Badge variant="default" className="bg-secondary text-secondary-foreground text-[10px]">Sync</Badge>;
    if (status === "pending") return <Badge variant="outline" className="border-accent text-accent text-[10px]">Pendente</Badge>;
    return <Badge variant="destructive" className="text-[10px]">Erro</Badge>;
  };

  const margin = (cost: number, sale: number) => sale > 0 ? ((sale - cost) / sale * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por nome ou SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="error">Com Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Novo Produto</Button>
      </div>

      {/* Table */}
      <Card className="card-shadow">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">PVP</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className={!p.isActive ? "opacity-50" : ""}>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium text-sm">{p.name}</span>
                      {p.isFeatured && <Badge variant="outline" className="ml-2 text-[10px]">Destaque</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{p.brand}</span>
                  </TableCell>
                  <TableCell className="text-sm">{getCategoryName(p.categoryId)}</TableCell>
                  <TableCell className="text-right text-sm">€{p.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-sm">
                    €{p.salePrice.toFixed(2)}
                    {p.promoPrice && <div className="text-xs text-accent">Promo: €{p.promoPrice.toFixed(2)}</div>}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{margin(p.costPrice, p.salePrice)}%</TableCell>
                  <TableCell className="text-right text-sm">
                    <span className={p.stock <= p.minStock ? "text-destructive font-medium" : ""}>{p.stock}</span>
                  </TableCell>
                  <TableCell>{syncBadge(p.syncStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailProduct(p)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Nenhum produto encontrado</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>{editingProduct ? "Atualize os dados do produto" : "Preencha os dados do novo produto"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="BEB-001" />
              </div>
              <div className="space-y-2">
                <Label>Código de Barras</Label>
                <Input value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} placeholder="5449000000996" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome do produto" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.isActive).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={form.unit} onValueChange={v => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pack">Pack</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Unidade">Unidade</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Litro">Litro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Preço Custo (€)</Label>
                <Input type="number" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Preço Venda (€)</Label>
                <Input type="number" step="0.01" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Stock Mínimo</Label>
                <Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={v => setForm({ ...form, isFeatured: v })} />
                <Label>Destaque</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingProduct ? "Guardar" : "Criar Produto"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailProduct?.name}</DialogTitle>
            <DialogDescription>Detalhes do produto</DialogDescription>
          </DialogHeader>
          {detailProduct && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">SKU:</span> {detailProduct.sku}</div>
                <div><span className="text-muted-foreground">Marca:</span> {detailProduct.brand}</div>
                <div><span className="text-muted-foreground">Categoria:</span> {getCategoryName(detailProduct.categoryId)}</div>
                <div><span className="text-muted-foreground">Unidade:</span> {detailProduct.unit}</div>
                <div><span className="text-muted-foreground">Custo:</span> €{detailProduct.costPrice.toFixed(2)}</div>
                <div><span className="text-muted-foreground">PVP:</span> €{detailProduct.salePrice.toFixed(2)}</div>
                <div><span className="text-muted-foreground">Margem:</span> {margin(detailProduct.costPrice, detailProduct.salePrice)}%</div>
                <div><span className="text-muted-foreground">Stock:</span> {detailProduct.stock} (min: {detailProduct.minStock})</div>
                <div><span className="text-muted-foreground">Sync:</span> {syncBadge(detailProduct.syncStatus)}</div>
                {detailProduct.lastSyncAt && <div><span className="text-muted-foreground">Última sync:</span> {new Date(detailProduct.lastSyncAt).toLocaleString("pt-PT")}</div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminação</DialogTitle>
            <DialogDescription>Tem a certeza que deseja eliminar este produto? Esta ação não pode ser revertida.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { if (deleteConfirm) { onDelete(deleteConfirm); setDeleteConfirm(null); } }}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
