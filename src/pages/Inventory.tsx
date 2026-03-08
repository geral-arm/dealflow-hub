import { ModulePage } from "@/components/ModulePage";
import { Package } from "lucide-react";

const InventoryPage = () => (
  <ModulePage
    title="Inventário & Logística"
    description="Gestão de stock e transporte internacional"
    icon={Package}
    features={[
      "Inventário multi-armazém",
      "Gestão de bonded warehouses",
      "Rastreabilidade por lote (FIFO/FEFO)",
      "Planeamento logístico",
      "Tracking de envios em tempo real",
      "Gestão de transportadoras",
    ]}
  />
);
export default InventoryPage;
