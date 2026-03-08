import { ModulePage } from "@/components/ModulePage";
import { DollarSign } from "lucide-react";

const FinancePage = () => (
  <ModulePage
    title="Financeiro"
    description="Controlo financeiro, faturação e margens"
    icon={DollarSign}
    features={[
      "Controlo de crédito de clientes",
      "Contas a receber e a pagar",
      "Faturação automática",
      "Reconciliação bancária",
      "Cash flow em tempo real",
      "Gestão multi-moeda",
    ]}
  />
);
export default FinancePage;
