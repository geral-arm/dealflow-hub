import { ModulePage } from "@/components/ModulePage";
import { ShoppingCart } from "lucide-react";

const ProcurementPage = () => (
  <ModulePage
    title="Procurement / Trading"
    description="Sourcing de oportunidades e gestão de fornecedores"
    icon={ShoppingCart}
    features={[
      "Registo de oportunidades de stock",
      "Gestão de fornecedores internacionais",
      "Comparação de cotações",
      "Cálculo de margem estimada",
      "Emissão de Purchase Orders",
      "Avaliação de fornecedores",
    ]}
  />
);
export default ProcurementPage;
