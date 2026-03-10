import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, CheckCircle2, AlertCircle, AlertTriangle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { StoreSyncLog, StoreProduct } from "@/types/store";

interface Props {
  syncLogs: StoreSyncLog[];
  products: StoreProduct[];
  isSyncing: boolean;
  onSync: () => void;
}

export function StoreSyncTab({ syncLogs, products, isSyncing, onSync }: Props) {
  const pending = products.filter(p => p.syncStatus === "pending").length;
  const errors = products.filter(p => p.syncStatus === "error").length;
  const synced = products.filter(p => p.syncStatus === "synced").length;

  const statusIcon = (s: string) => {
    if (s === "success") return <CheckCircle2 className="h-4 w-4 text-secondary" />;
    if (s === "partial") return <AlertTriangle className="h-4 w-4 text-accent" />;
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="space-y-6">
      {/* Sync overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display text-secondary">{synced}</div>
            <p className="text-xs text-muted-foreground">Sincronizados</p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display text-accent">{pending}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display text-destructive">{errors}</div>
            <p className="text-xs text-muted-foreground">Com Erro</p>
          </CardContent>
        </Card>
        <Card className="card-shadow flex items-center justify-center">
          <CardContent className="pt-6">
            <Button onClick={onSync} disabled={isSyncing} className="w-full">
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "A sincronizar..." : "Sincronizar Agora"}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">Push para KnownBrands Direct</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-display">Histórico de Sincronização</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {log.type === "push" ? <ArrowUpCircle className="h-3.5 w-3.5 text-primary" /> : <ArrowDownCircle className="h-3.5 w-3.5 text-secondary" />}
                      <span className="text-sm font-medium">{log.type === "push" ? "Push" : "Pull"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(log.status)}
                      <Badge variant={log.status === "success" ? "default" : log.status === "partial" ? "outline" : "destructive"}
                        className={`text-[10px] ${log.status === "success" ? "bg-secondary text-secondary-foreground" : log.status === "partial" ? "border-accent text-accent" : ""}`}>
                        {log.status === "success" ? "OK" : log.status === "partial" ? "Parcial" : "Erro"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.itemsProcessed} processados
                    {log.itemsFailed > 0 && <span className="text-destructive ml-1">({log.itemsFailed} falhas)</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{log.details}</TableCell>
                  <TableCell className="text-sm">{log.triggeredBy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.startedAt).toLocaleString("pt-PT")}</TableCell>
                </TableRow>
              ))}
              {syncLogs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sem registos de sincronização</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
