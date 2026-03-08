import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPurchaseOrders } from "@/data/procurement-mock";
import { PO_STATUS_CONFIG } from "@/types/procurement";
import { Search, Plus, FileText } from "lucide-react";

export function ProcurementPOs() {
  const [search, setSearch] = useState("");

  const filtered = mockPurchaseOrders.filter(po => {
    if (!search) return true;
    const q = search.toLowerCase();
    return po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar PO, fornecedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova PO</Button>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nº PO</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fornecedor</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produtos</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Valor Total</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Incoterm</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Entrega Prev.</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pagamento</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(po => {
                  const sc = PO_STATUS_CONFIG[po.status];
                  return (
                    <tr key={po.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-mono font-medium text-foreground">{po.poNumber}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{po.supplierName}</p>
                        <p className="text-xs text-muted-foreground">{po.supplierContact}</p>
                      </td>
                      <td className="px-4 py-3">
                        {po.items.map(item => (
                          <p key={item.id} className="text-foreground text-xs">{item.quantity}x {item.product}</p>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{po.currency} {po.totalValue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">{po.incoterm}</td>
                      <td className="px-4 py-3 text-foreground">{po.expectedDelivery}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{po.paymentTerms}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={`${sc.color} text-xs`}>{sc.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
