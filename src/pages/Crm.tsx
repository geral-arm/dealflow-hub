import { ModulePage } from "@/components/ModulePage";
import { Users } from "lucide-react";

const CrmPage = () => (
  <ModulePage
    title="CRM Comercial"
    description="Gestão de clientes, leads e pipeline de vendas"
    icon={Users}
    features={[
      "Gestão de leads B2B",
      "Ficha de cliente completa",
      "Pipeline de vendas visual",
      "Histórico de compras por cliente",
      "Segmentação por categoria e mercado",
      "Gestão de propostas e negociação",
    ]}
  />
);
export default CrmPage;
