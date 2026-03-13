import KanbanBoard from "@/components/custom/KanbanBoard";
import PageHeader from "@/components/custom/PageHeader";
import React from "react";

const KanbanBoardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Incident Operations Board"
          subtitle="Organize cases, assign teams, and manage response workflows"
        />
      </div>

      <KanbanBoard/>
    </div>
  );
};

export default KanbanBoardPage;
