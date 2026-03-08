import { ModulePage } from "@/components/ModulePage";
import { Handshake } from "lucide-react";

const DealsPage = () => (
  <ModulePage
    title="Deals"
    description="Gestão centralizada de operações comerciais"
    icon={Handshake}
    features={[
      "Pipeline visual de deals com drag & drop",
      "Ligação automática fornecedor-cliente-produto",
      "Cálculo de margem em tempo real",
      "Workflow de aprovação integrado",
      "Histórico completo de negociação",
      "Documentação associada ao deal",
    ]}
  />
);
export default DealsPage;
