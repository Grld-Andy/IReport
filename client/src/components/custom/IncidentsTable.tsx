import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortButton from "./IncidentsPage/SortButton";
import FilterButton from "./IncidentsPage/FilterButton";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import Badge from "./Badge";
import { severityConfig, statusConfig } from "@/constants/getColors";
import { incidentColumns } from "@/constants/incidentColumns";
import { getIncidents } from "@/services/getIncidents";
import type { Incident } from "@/types/Incident";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import UpdateIncidentModal from "./IncidentsPage/UpdateIncidentModal";
import DeleteIncidentModal from "./IncidentsPage/DeleteIncidentModal";
import { useAppSelector } from "@/redux/app/hooks";

const IncidentsTable: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalIncidents, setTotalIncidents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const stateTotalIncidents = useAppSelector((state) => state.incidents.totalIncidents)

  const navigate = useNavigate();
  const { page } = useParams();

  const currentPage = Math.max(1, Number(page) || 1);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getIncidents(currentPage);
      setIncidents(result.incidents ?? []);
      setTotalIncidents(result.totalIncidents ?? 0);
      setTotalPages(result.totalPages ?? 1);
      console.log(result)
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents, stateTotalIncidents]);

  const changePage = (pageTo: number) => {
    if (pageTo < 1 || pageTo > totalPages) return;
    navigate(`/incidents/${pageTo}`);
  };

  const updateIncident = (incident: Incident) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incident.id ? incident : i)),
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    setTotalIncidents((prev) => prev - 1);

    const currentTotalPages = Math.ceil(totalIncidents / 10);
    setTotalPages(currentTotalPages);
  };

  useEffect(() => {
    if (incidents.length < 1 && currentPage > 1) {
      navigate(`/incidents/${currentPage - 1}`);
    }
  }, [currentPage, incidents.length, navigate]);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex md:items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Incidents</h1>
          <p className="text-sm text-gray-500">
            {totalIncidents} total records
          </p>
        </div>

        <div className="flex items-center gap-2 justify-between">
          {/* Search */}
          <div className="relative w-full">
            <CiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-9 w-full md:w-56 bg-white"
            />
          </div>

          <div className="flex gap-2">
            <SortButton />
            <FilterButton />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {incidentColumns.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs text-gray-500 font-medium"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {loading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12">
                  Loading incidents...
                </TableCell>
              </TableRow>
            )}

            {/* Empty */}
            {!loading && incidents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-gray-500"
                >
                  No incidents found
                </TableCell>
              </TableRow>
            )}

            {/* Data */}
            {!loading &&
              incidents?.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="hover:bg-gray-50 transition"
                >
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
                        },
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
                    <p className="line-clamp-2">{incident.description}</p>
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
                      <div className="text-sm text-gray-700">Not Assigned</div>
                    )}
                  </TableCell>

                  {/* Date Assigned */}
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(incident.updatedAt).toLocaleDateString()}
                  </TableCell>

                  {/* Last Updated */}
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(incident.updatedAt).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-1">
                    <UpdateIncidentModal
                      incident={incident}
                      updateIncident={updateIncident}
                    />
                    <DeleteIncidentModal
                      id={incident.id}
                      deleteIncident={deleteIncident}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t flex items-center justify-between text-sm text-gray-500">
        <p>
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
          >
            Prev
          </Button>

          <Button className="px-3 py-1 rounded border border-black/20 bg-white hover:bg-gray-200 text-black">
            {currentPage}
          </Button>

          <Button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTable;
