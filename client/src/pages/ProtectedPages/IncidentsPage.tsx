import IncidentFormModal from "@/components/custom/IncidentsPage/IncidentFormModal";
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

        <IncidentFormModal isEditing={false}/>
      </div>

      <IncidentsTable />
    </div>
  );
};

export default IncidentsPage;
