import CreateIncidentButton from "@/components/custom/IncidentsPage/CreateButton";
import IncidentsTable from "@/components/custom/IncidentsTable";
import PageHeader from "@/components/custom/PageHeader";
import React from "react";

const IncidentsPage: React.FC = () => {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Incidents"
          subtitle="Manage and track all incidents"
        />

        <CreateIncidentButton/>
      </div>

      <IncidentsTable />
    </div>
  );
};

export default IncidentsPage;
