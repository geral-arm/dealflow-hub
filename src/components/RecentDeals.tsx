import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Deal {
  id: string;
  product: string;
  supplier: string;
  client: string;
  value: string;
  margin: string;
  status: "opportunity" | "proposal" | "negotiation" | "approved" | "closed";
  date: string;
}

const deals: Deal[] = [
  { id: "DL-2024-001", product: "Coca-Cola 330ml x24", supplier: "Iberian Beverages", client: "Metro Cash & Carry", value: "€45,200", margin: "12.4%", status: "closed", date: "07 Mar" },
  { id: "DL-2024-002", product: "Pringles Original 165g", supplier: "Kellogg's EU", client: "Carrefour France", value: "€28,900", margin: "15.1%", status: "negotiation", date: "06 Mar" },
  { id: "DL-2024-003", product: "Dove Shower Gel 500ml", supplier: "Unilever DACH", client: "Aldi Süd", value: "€67,500", margin: "9.8%", status: "approved", date: "06 Mar" },
  { id: "DL-2024-004", product: "Red Bull 250ml x24", supplier: "Red Bull Austria", client: "Lidl Portugal", value: "€32,100", margin: "11.2%", status: "proposal", date: "05 Mar" },
  { id: "DL-2024-005", product: "Nutella 750g", supplier: "Ferrero Italy", client: "Makro Netherlands", value: "€89,300", margin: "8.5%", status: "opportunity", date: "05 Mar" },
  { id: "DL-2024-006", product: "Heineken 330ml x24", supplier: "Heineken NL", client: "Selgros Romania", value: "€53,700", margin: "13.7%", status: "closed", date: "04 Mar" },
];

const statusConfig: Record<Deal["status"], { label: string; className: string }> = {
  opportunity: { label: "Oportunidade", className: "bg-info/15 text-info border-info/20" },
  proposal: { label: "Proposta", className: "bg-warning/15 text-warning border-warning/20" },
  negotiation: { label: "Negociação", className: "bg-accent/15 text-accent-foreground border-accent/20" },
  approved: { label: "Aprovado", className: "bg-secondary/15 text-secondary border-secondary/20" },
  closed: { label: "Fechado", className: "bg-success/15 text-success border-success/20" },
};

export function RecentDeals() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Deal</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Produto</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Fornecedor</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Cliente</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Valor</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right hidden sm:table-cell">Margem</th>
            <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal, i) => {
            const status = statusConfig[deal.status];
            return (
              <motion.tr
                key={deal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="py-3 font-mono text-xs text-muted-foreground">{deal.id}</td>
                <td className="py-3 font-medium text-card-foreground">{deal.product}</td>
                <td className="py-3 text-muted-foreground hidden md:table-cell">{deal.supplier}</td>
                <td className="py-3 text-muted-foreground hidden lg:table-cell">{deal.client}</td>
                <td className="py-3 text-right font-semibold text-card-foreground">{deal.value}</td>
                <td className="py-3 text-right font-medium text-success hidden sm:table-cell">{deal.margin}</td>
                <td className="py-3">
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
