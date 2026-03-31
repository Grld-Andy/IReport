import React from "react";
import DeleteIncidentModal from "../DeleteIncidentModal";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import UpdateIncidentModal from "../UpdateIncidentModal";
import Badge from "../../Badge";
import type { Incident } from "@/types/Incident";
import type { User } from "@/types/User";
import { severityConfig, statusConfig } from "@/constants/getColors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import ViewIncidentModal from "../ViewIncidentModal";

interface Props {
  incident: Incident;
  user: User | null;
  deleteIncident: (id: string) => void;
}

const IncidentActionsMenuItems: React.FC<{
  incident: Incident;
  deleteIncident: (id: string) => void;
  variant?: "dropdown" | "context";
}> = ({ incident, deleteIncident, variant = "dropdown" }) => {
  const Item = variant === "dropdown" ? DropdownMenuItem : ContextMenuItem;

  return (
    <>
      <ViewIncidentModal
        incident={incident}
        trigger={
          <Item onSelect={(e) => e.preventDefault()}>
            View
          </Item>
        }/>
      <UpdateIncidentModal
        incident={incident}
        trigger={
          <Item onSelect={(e) => e.preventDefault()}>
            Edit
          </Item>
        }
      />

      <DeleteIncidentModal
        deleteFunc={deleteIncident}
        id={incident.id}
        trigger={
          <Item onSelect={(e) => e.preventDefault()}>
            Delete
          </Item>
        }
      />
    </>
  );
};

const IncidentsRow: React.FC<Props> = ({
  incident,
  user,
  deleteIncident,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow className="hover:bg-gray-50 transition">
          {/* Incident */}
          <TableCell>
            <p className="font-medium text-gray-900">
              {incident.subject}
            </p>
            <p className="text-xs text-gray-500 text-nowrap">
              {new Date(incident.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
              <span className="mx-1 text-gray-300">·</span>
              {new Date(incident.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </TableCell>

          {/* Description */}
          <TableCell className="text-sm text-gray-600 min-w-[220px]">
            <p className="line-clamp-2">
              {incident.description}
            </p>
          </TableCell>

          {/* Severity */}
          <TableCell>
            <Badge
              value={incident.severity}
              config={severityConfig}
            />
          </TableCell>

          {/* Category */}
          <TableCell className="text-sm text-gray-700">
            {incident.category}
          </TableCell>

          {/* Status */}
          <TableCell>
            <Badge
              value={incident.status.toString()}
              config={statusConfig}
            />
          </TableCell>

          {/* Assigned */}
          <TableCell className="min-w-[150px]">
            {incident.assignedTo ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {incident.assignedTo.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-sm text-gray-700">
                  {incident.assignedTo.name}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                Not Assigned
              </div>
            )}
          </TableCell>

          {/* Team */}
          {user?.role == "admin" && (
            <TableCell className="min-w-[150px]">
              <div className="text-sm text-gray-700">
                {incident.team}
              </div>
            </TableCell>
          )}

          {/* Last Updated */}
          <TableCell className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(incident.updatedAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </TableCell>

          {/* Actions */}
          {user?.role == "responder" || (
            <TableCell className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-7 h-7 bg-transparent border-transparent shadow-none rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <BsThreeDotsVertical className="cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <IncidentActionsMenuItems
                      incident={incident}
                      deleteIncident={deleteIncident}
                      variant="dropdown"
                    />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          )}
        </TableRow>
      </ContextMenuTrigger>

      {/* Right-click Context Menu */}
      {user?.role !== "responder" && (
        <ContextMenuContent>
          <IncidentActionsMenuItems
            incident={incident}
            deleteIncident={deleteIncident}
            variant="context"
          />
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default IncidentsRow;