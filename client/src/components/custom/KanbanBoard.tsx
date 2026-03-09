import { getSeverityColor } from "@/constants/getColors";
import { getAllIncidents } from "@/services/getIncidents";
import { updateIncidentStatus } from "@/services/updateIncidentStatus";
import type { Incident } from "@/types/Incident";
import { getStatusNum, IncidentStatus } from "@/types/StatusEnum";
import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { ReactSortable } from "react-sortablejs";

const KanbanBoard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      const result = await getAllIncidents();
      setIncidents(result.incidents);
    };
    fetchIncidents();
  }, []);

  const statusColumns = [
    { name: "Open", value: "Open", color: "green" },
    { name: "In Progress", value: "InProgress", color: "yellow" },
    { name: "Resolved", value: "Resolved", color: "blue" },
    { name: "Closed", value: "Closed", color: "red" },
  ];

  const updateColumn = (columnStatus: IncidentStatus, newList: Incident[]) => {
    setIncidents((prev) => {
      const updated = prev.map((incident) => {
        const moved = newList.find((i) => i.id === incident.id);

        if (moved && incident.status != columnStatus) {
          console.log("column status: ", columnStatus);
          updateIncidentStatus(
            incident.id,
            getStatusNum(columnStatus.toString()),
          ).then(() => {
            return { ...incident, status: columnStatus };
          }).catch(() => {
            return incident;
          });
          
        }

        return incident;
      });

      return updated;
    });
  };

  return (
    <div className="py-2 rounded-lg">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {statusColumns.map((column) => {
          const columnIncidents = incidents.filter(
            (i) => i.status.toString() == column.value,
          );

          return (
            <div
              key={column.value}
              className="bg-gray-100 p-3 border rounded-xl w-[300px] flex-shrink-0"
            >
              <div className="flex justify-between items-center pb-2">
                <h2 className="text-lg font-semibold">{column.name}</h2>
                <p>{columnIncidents.length}</p>
              </div>

              <div className="px-1 py-3 relative overflow-y-scroll max-h-[395px] h-full hide-scrollbar">
                <ReactSortable
                  list={columnIncidents}
                  setList={(newList) =>
                    updateColumn(
                      column.value as unknown as IncidentStatus,
                      newList,
                    )
                  }
                  group="kanban"
                  animation={150}
                  className="flex min-h-full flex-col gap-2"
                >
                  {columnIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="bg-white z-10 p-2 rounded-lg shadow-md border border-black/10 flex flex-col gap-1 cursor-grab"
                    >
                      <div
                        className={`${getSeverityColor(
                          incident.severity.toString(),
                        )} border-[1px] font-semibold w-min rounded-full px-2 text-sm`}
                      >
                        {incident.severity}
                      </div>

                      <h3 className="font-semibold text-[17px]">
                        {incident.subject}
                      </h3>

                      <p className="text-sm line-clamp-2 text-gray-800">
                        {incident.description}
                      </p>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <FaRegCommentDots />
                          <span>0</span>
                        </div>

                        <div className="w-[25px] h-[25px] grid place-content-center text-white bg-orange-700 rounded-full overflow-hidden">
                          {incident.reporter.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>

                {columnIncidents.length === 0 && (
                  <p className="text-sm text-gray-400 text-center w-full py-4 absolute top-0">
                    No incidents
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
