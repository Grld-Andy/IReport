import IncidentsTable from "@/components/custom/IncidentsTable";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import React from "react";

const IncidentsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Incidents"
          subtitle="Manage and track all incidents"
        />

        <Button className="bg-green-500 hover:bg-green-600 text-white">
          + Create New
        </Button>
      </div>

      <IncidentsTable />
    </div>
  );
};

export default IncidentsPage;
