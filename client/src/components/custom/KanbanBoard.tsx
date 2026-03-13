/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { getAllIncidents } from "@/services/getIncidents";
import { updateIncidentStatus } from "@/services/updateIncidentStatus";
import type { Incident } from "@/types/Incident";
import { getStatusNum } from "@/types/StatusEnum";
import BoardCard from "./BoardCard";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/app/hooks";

type ColumnKey = "Open" | "InProgress" | "Resolved" | "Closed";
type KanbanState = Record<ColumnKey, Incident[]>;

const columns = [
  { name: "Open", value: "Open", color: "green" },
  { name: "In Progress", value: "InProgress", color: "yellow" },
  { name: "Resolved", value: "Resolved", color: "blue" },
  { name: "Closed", value: "Closed", color: "red" },
];

const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<KanbanState>({
    Open: [],
    InProgress: [],
    Resolved: [],
    Closed: [],
  });
  const [dragSource, setDragSource] = useState<ColumnKey | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    const fetchIncidents = async () => {
      const result = await getAllIncidents(currentUser?.team);

      const grouped: KanbanState = {
        Open: [],
        InProgress: [],
        Resolved: [],
        Closed: [],
      };

      result.incidents.forEach((incident: Incident) => {
        const status = incident.status as ColumnKey;
        if (grouped[status]) grouped[status].push(incident);
      });
      setBoard(grouped);
    };

    fetchIncidents();
  }, [currentUser?.team]);

  const handleDragAdd = async (evt: any, toColumn: ColumnKey) => {
    const incidentId = evt.item.dataset.id;

    if (!incidentId || !dragSource) return;
    const result = await updateIncidentStatus(
      incidentId,
      getStatusNum(toColumn),
    );

    if (result.success) {
      setDragSource(null);
      return;
    }

    toast.error(result.message, { position: "top-center" });

    setBoard((prev) => {
      const targetList = [...prev[toColumn]];
      const sourceList = [...prev[dragSource]];

      const index = targetList.findIndex((i) => i.id === incidentId);
      if (index === -1) return prev;

      const moved = targetList.splice(index, 1)[0];
      moved.status = dragSource;
      sourceList.unshift(moved);

      return {
        ...prev,
        [toColumn]: targetList,
        [dragSource]: sourceList,
      };
    });

    setDragSource(null);
  };

  const deleteIncidentFromBoard = (id: string) => {
    setBoard((prev) => {
      const updated = { ...prev };

      (Object.keys(updated) as ColumnKey[]).forEach((col) => {
        updated[col] = updated[col].filter((incident) => incident.id !== id);
      });

      return updated;
    });
  };

  const updateIncidentInBoard = (updatedIncident: Incident) => {
    setBoard((prev) => {
      const updated = { ...prev };

      (Object.keys(updated) as ColumnKey[]).forEach((col) => {
        updated[col] = updated[col].filter((i) => i.id !== updatedIncident.id);
      });

      const column = updatedIncident.status as ColumnKey;
      updated[column].unshift(updatedIncident);

      return updated;
    });
  };

  return (
    <div className="py-2 rounded-lg">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {columns.map((column) => (
          <div
            key={column.value}
            className="bg-gray-100 p-3 border rounded-xl w-[340px] flex-shrink-0"
          >
            <div className="flex justify-between items-center pb-2">
              <h2 className="text-lg font-semibold">{column.name}</h2>
              <p>{board[column.value as ColumnKey].length}</p>
            </div>

            <div className="px-1 py-3 relative overflow-y-scroll h-full max-h-[395px] hide-scrollbar">
              <ReactSortable
                list={board[column.value as ColumnKey]}
                setList={(newList) =>
                  setBoard((prev) => ({
                    ...prev,
                    [column.value]: newList,
                  }))
                }
                group="kanban"
                animation={150}
                delay={120}
                data-column={column.value}
                onStart={() => setDragSource(column.value as ColumnKey)}
                onAdd={(evt) => handleDragAdd(evt, column.value as ColumnKey)}
                className="flex min-h-full flex-col gap-2"
              >
                {board[column.value as ColumnKey].map((incident) => (
                  <div key={incident.id} data-id={incident.id}>
                    <BoardCard
                      incident={incident}
                      onDelete={deleteIncidentFromBoard}
                      onUpdate={updateIncidentInBoard}
                    />
                  </div>
                ))}
              </ReactSortable>

              {board[column.value as ColumnKey].length === 0 && (
                <p className="text-sm text-gray-400 text-center w-full py-4 absolute top-0 left-0">
                  No incidents
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
