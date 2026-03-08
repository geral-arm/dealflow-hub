import { useState } from "react";
import { CrmLayout, type CrmTab } from "@/components/crm/CrmLayout";
import { CrmDashboard } from "@/components/crm/CrmDashboard";
import { CrmLeads } from "@/components/crm/CrmLeads";
import { CrmClients } from "@/components/crm/CrmClients";
import { CrmPipeline } from "@/components/crm/CrmPipeline";
import { CrmProposals } from "@/components/crm/CrmProposals";
import { CrmNegotiations } from "@/components/crm/CrmNegotiations";
import { CrmActivities } from "@/components/crm/CrmActivities";
import { CrmReports } from "@/components/crm/CrmReports";

const CrmPage = () => {
  const [activeTab, setActiveTab] = useState<CrmTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <CrmDashboard />;
      case 'leads': return <CrmLeads />;
      case 'clients': return <CrmClients />;
      case 'pipeline': return <CrmPipeline />;
      case 'proposals': return <CrmProposals />;
      case 'negotiations': return <CrmNegotiations />;
      case 'activities': return <CrmActivities />;
      case 'reports': return <CrmReports />;
      default: return <CrmDashboard />;
    }
  };

  return (
    <CrmLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </CrmLayout>
  );
};

export default CrmPage;
