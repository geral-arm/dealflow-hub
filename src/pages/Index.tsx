import { AppLayout } from "@/components/AppLayout";
import { KpiCard, StatCard } from "@/components/KpiCard";
import { DealPipeline } from "@/components/DealPipeline";
import { RecentDeals } from "@/components/RecentDeals";
import {
  Handshake,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Truck,
} from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral da operação de trading · Março 2026
          </p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard icon={Handshake} title="Deals Ativos" value="77" change="+12 esta semana" changeType="positive" delay={0} />
          <KpiCard icon={TrendingUp} title="Volume Mensal" value="€2.4M" change="+18% vs fev" changeType="positive" delay={1} />
          <KpiCard icon={DollarSign} title="Margem Média" value="11.8%" change="+0.6pp" changeType="positive" delay={2} />
          <KpiCard icon={Package} title="SKUs em Stock" value="1,247" change="32 novos" changeType="neutral" delay={3} />
          <KpiCard icon={Truck} title="Envios Ativos" value="23" change="5 em trânsito" changeType="neutral" delay={4} />
          <KpiCard icon={AlertTriangle} title="Alertas" value="4" change="2 crédito, 2 stock" changeType="negative" delay={5} />
        </div>

        {/* Pipeline + Activity */}
        <div className="grid gap-4 lg:grid-cols-5">
          <StatCard title="Pipeline de Deals" className="lg:col-span-3" delay={6}>
            <DealPipeline />
          </StatCard>
          <StatCard title="Actividade Recente" className="lg:col-span-2" delay={7}>
            <div className="space-y-4">
              {[
                { time: "10:32", text: "Deal DL-2024-001 fechado com Metro Cash & Carry", type: "success" as const },
                { time: "09:15", text: "Nova oportunidade: Nutella 750g via Ferrero Italy", type: "info" as const },
                { time: "08:45", text: "Purchase Order PO-4521 aprovada", type: "neutral" as const },
                { time: "08:20", text: "Alerta: Crédito de Carrefour France próximo do limite", type: "warning" as const },
                { time: "Ontem", text: "Envio SH-891 confirmado em Rotterdam", type: "neutral" as const },
                { time: "Ontem", text: "Fatura INV-2024-089 liquidada por Aldi Süd", type: "success" as const },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-12 shrink-0 text-xs text-muted-foreground pt-0.5">{item.time}</span>
                  <div className="flex-1">
                    <div
                      className={`h-1.5 w-1.5 rounded-full mt-1.5 float-left mr-2 ${
                        item.type === "success"
                          ? "bg-success"
                          : item.type === "warning"
                          ? "bg-warning"
                          : item.type === "info"
                          ? "bg-info"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                    <p className="text-card-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </StatCard>
        </div>

        {/* Recent Deals Table */}
        <StatCard title="Deals Recentes" delay={8}>
          <RecentDeals />
        </StatCard>
      </div>
    </AppLayout>
  );
};

export default Index;
