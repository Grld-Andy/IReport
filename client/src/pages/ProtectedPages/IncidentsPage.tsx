import CreateIncidentModal from "@/components/custom/IncidentsPage/CreateIncidentModal";
import IncidentsTable from "@/components/custom/IncidentsTable";
import PageHeader from "@/components/custom/PageHeader";
import { useIncidentHub } from "@/hooks/useIncidentHook";
import React from "react";

const IncidentsPage: React.FC = () => {
  useIncidentHub();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Incidents"
          subtitle="Manage and track all incidents"
        />

        <CreateIncidentModal/>
      </div>

      <IncidentsTable />
    </div>
  );
};

export default IncidentsPage;
