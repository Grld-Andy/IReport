import { getSeverityColor } from "@/constants/getColors";
import { incidents as initialIncidents } from "@/constants/incidents";
import type { Incident } from "@/types/Incident";
import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { ReactSortable } from "react-sortablejs";

const KanbanBoard: React.FC = () => {
  const [items, setItems] = useState<Incident[]>(initialIncidents);

  const status = [
    { name: "Open", value: "Open", color: "green" },
    { name: "In Progress", value: "InProgress", color: "yellow" },
    { name: "Resolved", value: "Resolved", color: "blue" },
    { name: "Closed", value: "Closed", color: "red" },
  ];

  const updateColumn = (columnStatus: Incident["status"], newList: Incident[]) => {
    setItems((prev) => {
      const otherItems = prev.filter((i) => i.status !== columnStatus);

      const updatedColumnItems = newList.map((item) => ({
        ...item,
        status: columnStatus,
      }));

      return [...otherItems, ...updatedColumnItems];
    });
  };

  return (
    <div className="py-2 rounded-lg">
      <div className="flex gap-2 overflow-x-scroll hide-scrollbar">
        {status.map((column) => {
          const columnIncidents = items.filter(
            (incident) => incident.status === column.value
          );

          return (
            <div
              key={column.value}
              className="bg-gray-100 p-3 border rounded-xl w-[300px] flex-shrink-0"
            >
              <div className="flex justify-between items-center pb-2">
                <h1 className="text-[1.1em]">{column.name}</h1>
                <p>{columnIncidents.length}</p>
              </div>

              <div className="px-1 py-3 overflow-y-scroll max-h-[395px] hide-scrollbar">

                <ReactSortable
                  list={columnIncidents}
                  setList={(newState) =>
                    updateColumn(column.value as Incident["status"], newState)
                  }
                  group="kanban"
                  animation={150}
                  className="flex flex-col gap-2"
                >
                  {columnIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="bg-white p-2 rounded-lg shadow-md border border-black/10 flex flex-col gap-1 cursor-grab"
                    >
                      <div
                        className={`${getSeverityColor(
                          incident.severity
                        )} border-[1px] font-semibold w-min rounded-full px-2 text-sm`}
                      >
                        {incident.severity}
                      </div>

                      <h1 className="font-semibold text-[17px]">
                        {incident.subject}
                      </h1>

                      <p className="text-sm line-clamp-2 text-gray-800">
                        {incident.descrition}
                      </p>

                      <div className="flex justify-between items-center mt-5">
                        <div className="flex items-center gap-2">
                          <FaRegCommentDots />
                          <span>0</span>
                        </div>

                        <div className="w-[25px] grid place-content-center text-white h-[25px] bg-orange-700 rounded-full overflow-hidden">
                          {incident.reporterId.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>

                {columnIncidents.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
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