import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMarginScenarios } from "@/data/procurement-mock";
import { Calculator, TrendingUp, AlertTriangle, Plus } from "lucide-react";

export function ProcurementMargin() {
  const [scenarios] = useState(mockMarginScenarios);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Calculadora de Margem</h2>
          <p className="text-sm text-muted-foreground">Simule cenários de compra e calcule viabilidade comercial</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Cenário</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {scenarios.map(sc => (
          <Card key={sc.id} className={`card-shadow ${sc.belowMinMargin ? 'border-destructive/50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm">{sc.name}</CardTitle>
                {sc.belowMinMargin && <Badge className="bg-destructive/20 text-destructive text-xs"><AlertTriangle className="h-3 w-3 mr-1" /> Margem Baixa</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Costs breakdown */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custos</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Preço Compra</span><span className="text-foreground">€{sc.buyPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Quantidade</span><span className="text-foreground">{sc.quantity.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Transporte</span><span className="text-foreground">€{sc.transportCost.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Seguro</span><span className="text-foreground">€{sc.insuranceCost.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Documentação</span><span className="text-foreground">€{sc.documentCost.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Financeiro</span><span className="text-foreground">€{sc.financialCost.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resultado</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Landed Cost (unit.)</span><span className="text-foreground font-medium">€{sc.landedCost.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Custo Total</span><span className="text-foreground font-medium">€{sc.totalCost.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Preço Venda Alvo</span><span className="text-foreground font-medium">€{sc.targetSellPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Preço Mín. Venda</span><span className="text-foreground">€{sc.minSellPrice.toFixed(2)}</span></div>
              </div>

              <div className="border-t pt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Margem Unit.</p>
                  <p className={`text-lg font-display font-bold ${sc.marginUnit > 0 ? 'text-success' : 'text-destructive'}`}>€{sc.marginUnit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Margem Total</p>
                  <p className={`text-lg font-display font-bold ${sc.marginTotal > 0 ? 'text-success' : 'text-destructive'}`}>€{sc.marginTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Margem %</p>
                  <p className={`text-lg font-display font-bold ${sc.marginPct >= 8 ? 'text-success' : sc.marginPct >= 5 ? 'text-warning' : 'text-destructive'}`}>{sc.marginPct}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
