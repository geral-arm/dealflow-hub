import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPnLHistory } from "@/data/finance-mock";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const fmt = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinanceHistory() {
  const peak = mockPnLHistory.reduce((m, y) => y.sales > m.sales ? y : m, mockPnLHistory[0]);

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Histórico (DRE) 2012–2025</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Pico histórico de vendas em {peak.year}: {fmt(peak.sales)} — track-record de 14 anos.</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockPnLHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `€${(v / 1_000_000).toFixed(1)}M`} />
                <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--success))" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Bar yAxisId="l" dataKey="sales" fill="hsl(var(--primary))" name="Vendas" radius={[4, 4, 0, 0]} />
                <Line yAxisId="r" type="monotone" dataKey="grossMarginPct" stroke="hsl(var(--success))" strokeWidth={2} name="Margem %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">DRE multi-ano</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  <TableHead className="text-right">CMV</TableHead>
                  <TableHead className="text-right">Lucro Bruto</TableHead>
                  <TableHead className="text-right">Margem %</TableHead>
                  <TableHead className="text-right">FSE</TableHead>
                  <TableHead className="text-right">Pessoal</TableHead>
                  <TableHead className="text-right">EBITDA</TableHead>
                  <TableHead className="text-right">Result. Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPnLHistory.map(y => (
                  <TableRow key={y.year}>
                    <TableCell className="font-medium">{y.year}</TableCell>
                    <TableCell className="text-right">{fmt(y.sales)}</TableCell>
                    <TableCell className="text-right">{fmt(y.cogs)}</TableCell>
                    <TableCell className="text-right">{fmt(y.grossProfit)}</TableCell>
                    <TableCell className="text-right">{y.grossMarginPct.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{fmt(y.fse)}</TableCell>
                    <TableCell className="text-right">{fmt(y.personnel)}</TableCell>
                    <TableCell className={`text-right ${y.ebitda >= 0 ? "text-success" : "text-destructive"}`}>{fmt(y.ebitda)}</TableCell>
                    <TableCell className={`text-right font-medium ${y.netResult >= 0 ? "text-success" : "text-destructive"}`}>{fmt(y.netResult)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}