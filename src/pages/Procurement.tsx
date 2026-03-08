import { useState } from "react";
import { ProcurementLayout, ProcurementTab } from "@/components/procurement/ProcurementLayout";
import { ProcurementDashboard } from "@/components/procurement/ProcurementDashboard";
import { ProcurementOpportunities } from "@/components/procurement/ProcurementOpportunities";
import { ProcurementSuppliers } from "@/components/procurement/ProcurementSuppliers";
import { ProcurementQuotes } from "@/components/procurement/ProcurementQuotes";
import { ProcurementMargin } from "@/components/procurement/ProcurementMargin";
import { ProcurementPOs } from "@/components/procurement/ProcurementPOs";
import { ProcurementEvaluations } from "@/components/procurement/ProcurementEvaluations";
import { ProcurementActivities } from "@/components/procurement/ProcurementActivities";
import { ProcurementReports } from "@/components/procurement/ProcurementReports";

const ProcurementPage = () => {
  const [activeTab, setActiveTab] = useState<ProcurementTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <ProcurementDashboard />;
      case 'opportunities': return <ProcurementOpportunities />;
      case 'suppliers': return <ProcurementSuppliers />;
      case 'quotes': return <ProcurementQuotes />;
      case 'margin': return <ProcurementMargin />;
      case 'purchase_orders': return <ProcurementPOs />;
      case 'evaluations': return <ProcurementEvaluations />;
      case 'activities': return <ProcurementActivities />;
      case 'reports': return <ProcurementReports />;
      default: return <ProcurementDashboard />;
    }
  };

  return (
    <ProcurementLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </ProcurementLayout>
  );
};

export default ProcurementPage;
