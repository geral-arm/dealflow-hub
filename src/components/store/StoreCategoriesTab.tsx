import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { StoreCategory } from "@/types/store";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
  categories: StoreCategory[];
  onAdd: (category: Omit<StoreCategory, "id" | "createdAt" | "updatedAt" | "productCount">) => void;
  onUpdate: (id: string, updates: Partial<StoreCategory>) => void;
  onDelete: (id: string) => boolean;
}

export function StoreCategoriesTab({ categories, onAdd, onUpdate, onDelete }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StoreCategory | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", isActive: true, sortOrder: 0 });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", isActive: true, sortOrder: categories.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (c: StoreCategory) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description, isActive: c.isActive, sortOrder: c.sortOrder });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (editing) {
      onUpdate(editing.id, { ...form, slug });
    } else {
      onAdd({ ...form, slug } as any);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{categories.length} categorias</p>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Nova Categoria</Button>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Produtos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.sort((a, b) => a.sortOrder - b.sortOrder).map(c => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm">{c.sortOrder}</TableCell>
                  <TableCell className="font-medium text-sm">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{c.description}</TableCell>
                  <TableCell className="text-right text-sm">{c.productCount}</TableCell>
                  <TableCell>
                    <Badge variant={c.isActive ? "default" : "secondary"} className={c.isActive ? "bg-secondary text-secondary-foreground text-[10px]" : "text-[10px]"}>
                      {c.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>{editing ? "Atualize os dados da categoria" : "Crie uma nova categoria de produtos"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome da categoria" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-gerado se vazio" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Ativa</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Guardar" : "Criar Categoria"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
