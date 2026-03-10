import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { StorePromotion, StoreCategory } from "@/types/store";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
  promotions: StorePromotion[];
  categories: StoreCategory[];
  onAdd: (promo: Omit<StorePromotion, "id" | "createdAt" | "updatedAt" | "usedCount">) => void;
  onUpdate: (id: string, updates: Partial<StorePromotion>) => void;
  onDelete: (id: string) => void;
}

const emptyForm: { name: string; description: string; type: "percentage" | "fixed" | "bogo"; value: number; productIds: string[]; categoryIds: string[]; startDate: string; endDate: string; isActive: boolean; code: string; minQuantity: number | undefined } = {
  name: "", description: "", type: "percentage" as const, value: 0,
  productIds: [] as string[], categoryIds: [] as string[],
  startDate: "", endDate: "", isActive: true, code: "", minQuantity: undefined as number | undefined,
};

export function StorePromotionsTab({ promotions, categories, onAdd, onUpdate, onDelete }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StorePromotion | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedCatId, setSelectedCatId] = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: StorePromotion) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, type: p.type, value: p.value,
      productIds: p.productIds, categoryIds: p.categoryIds,
      startDate: p.startDate, endDate: p.endDate, isActive: p.isActive,
      code: p.code || "", minQuantity: p.minQuantity,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    if (editing) {
      onUpdate(editing.id, form);
    } else {
      onAdd(form as any);
    }
    setDialogOpen(false);
  };

  const addCategoryToForm = () => {
    if (selectedCatId && !form.categoryIds.includes(selectedCatId)) {
      setForm({ ...form, categoryIds: [...form.categoryIds, selectedCatId] });
      setSelectedCatId("");
    }
  };

  const typeLabels: Record<string, string> = { percentage: "Percentagem", fixed: "Valor Fixo", bogo: "Leve X Pague Y" };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{promotions.length} promoções · {promotions.filter(p => p.isActive).length} ativas</p>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Nova Promoção</Button>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promoção</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Usos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{typeLabels[p.type]}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">
                    {p.type === "percentage" ? `${p.value}%` : p.type === "fixed" ? `€${p.value.toFixed(2)}` : `${p.value} grátis`}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.startDate} → {p.endDate}</TableCell>
                  <TableCell className="font-mono text-xs">{p.code || "—"}</TableCell>
                  <TableCell className="text-right text-sm">{p.usedCount}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "default" : "secondary"} className={p.isActive ? "bg-secondary text-secondary-foreground text-[10px]" : "text-[10px]"}>
                      {p.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhuma promoção criada</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Promoção" : "Nova Promoção"}</DialogTitle>
            <DialogDescription>{editing ? "Atualize os dados da promoção" : "Crie uma nova promoção"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (€)</SelectItem>
                    <SelectItem value="bogo">Leve X Pague Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início *</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Fim *</Label>
                <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código Promo</Label>
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Opcional" />
              </div>
              <div className="space-y-2">
                <Label>Qtd. Mínima</Label>
                <Input type="number" value={form.minQuantity || ""} onChange={e => setForm({ ...form, minQuantity: parseInt(e.target.value) || undefined })} placeholder="—" />
              </div>
            </div>
            {/* Category association */}
            <div className="space-y-2">
              <Label>Categorias Abrangidas</Label>
              <div className="flex gap-2">
                <Select value={selectedCatId} onValueChange={setSelectedCatId}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.isActive && !form.categoryIds.includes(c.id)).map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={addCategoryToForm}>Adicionar</Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {form.categoryIds.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="cursor-pointer" onClick={() => setForm({ ...form, categoryIds: form.categoryIds.filter(i => i !== id) })}>
                      {cat?.name} ✕
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
              <Label>Ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Guardar" : "Criar Promoção"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
