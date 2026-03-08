import { ModulePage } from "@/components/ModulePage";
import { FileText } from "lucide-react";

const CompliancePage = () => (
  <ModulePage
    title="Compliance & Documentação"
    description="Gestão documental e conformidade legal"
    icon={FileText}
    features={[
      "Geração de documentos comerciais",
      "Packing lists e invoices",
      "Documentos aduaneiros",
      "Arquivo documental organizado",
      "Gestão de contratos",
      "Validação fiscal",
    ]}
  />
);
export default CompliancePage;
