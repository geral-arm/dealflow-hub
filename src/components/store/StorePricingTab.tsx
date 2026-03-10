import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save } from "lucide-react";
import { StoreProduct, StoreCategory } from "@/types/store";

interface Props {
  products: StoreProduct[];
  categories: StoreCategory[];
  onUpdatePrice: (id: string, cost?: number, sale?: number, promo?: number) => void;
}

export function StorePricingTab({ products, categories, onUpdatePrice }: Props) {
  const [edits, setEdits] = useState<Record<string, { cost?: number; sale?: number; promo?: string }>>({});

  const activeProducts = products.filter(p => p.isActive);

  const handleEdit = (id: string, field: "cost" | "sale" | "promo", value: string) => {
    setEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: field === "promo" ? value : parseFloat(value) || 0 },
    }));
  };

  const handleSave = (id: string) => {
    const edit = edits[id];
    if (!edit) return;
    onUpdatePrice(
      id,
      edit.cost,
      edit.sale,
      edit.promo !== undefined && edit.promo !== "" ? parseFloat(edit.promo) : undefined,
    );
    setEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  // Category margin summary
  const categoryMargins = categories.filter(c => c.isActive).map(cat => {
    const catProducts = activeProducts.filter(p => p.categoryId === cat.id);
    const avgMargin = catProducts.length > 0
      ? catProducts.reduce((s, p) => s + ((p.salePrice - p.costPrice) / p.salePrice * 100), 0) / catProducts.length
      : 0;
    return { ...cat, avgMargin, count: catProducts.length };
  });

  return (
    <div className="space-y-6">
      {/* Category margins */}
      <div className="grid gap-4 md:grid-cols-3">
        {categoryMargins.map(c => (
          <Card key={c.id} className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{c.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{c.avgMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">margem média · {c.count} produtos</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price table */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-display">Tabela de Preços</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Custo (€)</TableHead>
                <TableHead className="text-right">PVP (€)</TableHead>
                <TableHead className="text-right">Promo (€)</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeProducts.map(p => {
                const edit = edits[p.id];
                const cost = edit?.cost ?? p.costPrice;
                const sale = edit?.sale ?? p.salePrice;
                const margin = sale > 0 ? ((sale - cost) / sale * 100).toFixed(1) : "0";
                const hasChanges = !!edit;

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </TableCell>
                    <TableCell className="text-sm">{categories.find(c => c.id === p.categoryId)?.name}</TableCell>
                    <TableCell className="text-right">
                      <Input type="number" step="0.01" className="w-24 ml-auto text-right h-8 text-sm"
                        defaultValue={p.costPrice} onChange={e => handleEdit(p.id, "cost", e.target.value)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input type="number" step="0.01" className="w-24 ml-auto text-right h-8 text-sm"
                        defaultValue={p.salePrice} onChange={e => handleEdit(p.id, "sale", e.target.value)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input type="number" step="0.01" className="w-24 ml-auto text-right h-8 text-sm"
                        defaultValue={p.promoPrice || ""} placeholder="—"
                        onChange={e => handleEdit(p.id, "promo", e.target.value)} />
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">{margin}%</TableCell>
                    <TableCell>
                      {hasChanges && (
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSave(p.id)}>
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
