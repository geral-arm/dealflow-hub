import { ModulePage } from "@/components/ModulePage";
import { BarChart3 } from "lucide-react";

const AnalyticsPage = () => (
  <ModulePage
    title="Business Intelligence"
    description="Dashboards executivos e análise de performance"
    icon={BarChart3}
    features={[
      "Dashboards executivos personalizáveis",
      "Análise de rentabilidade por deal",
      "Margem por cliente e fornecedor",
      "Previsão de procura",
      "Análise de rotação de stock",
      "Relatórios exportáveis",
    ]}
  />
);
export default AnalyticsPage;
