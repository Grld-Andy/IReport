import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { getIncidents } from "@/services/getIncidents";
import { saveIncidents } from "@/redux/features/incidents/incidentsSlice";
import type { Incident } from "@/types/Incident";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import IncidentFormModal from "./IncidentsPage/IncidentFormModal";


const IncidentsTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const incidents = useAppSelector((state) => state.incidents.incidents)
  const totalIncidents = useAppSelector((state) => state.incidents.totalIncidents)
  const navigate = useNavigate()
  const { page } = useParams();
  const totalPages = Math.ceil(totalIncidents / 10);
  const currentPage = !page || isNaN(Number(page)) ? 1 : Number(page) > totalPages ? totalPages : Number(page);

  useEffect(() => {
    const fetchIncidents = async() => {
      console.log("fetching incidents")
      const result = await getIncidents(currentPage);
      dispatch(saveIncidents(result))
    }
    fetchIncidents()
  }, [dispatch, currentPage])

  const changePage = async (pageTo: number) => {
    pageTo = pageTo < 1 ? 1 : pageTo
    navigate(`/incidents/${pageTo}`)
  }

  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Incidents</h1>
          <p className="text-sm text-gray-500">
            {totalIncidents} total records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <CiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-9 w-56"
            />
          </div>

          <SortButton />
          <FilterButton />
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
            {incidents.map((incident: Incident, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition">
                {/* Incident */}
                <TableCell>
                  <p className="font-medium text-gray-900">
                    {incident.subject}
                  </p>
                  <p className="text-xs text-gray-500 text-nowrap">
                    {new Date(incident.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
                  <Badge value={incident.severity.toString()} config={severityConfig} />
                </TableCell>

                {/* Category */}
                <TableCell className="text-sm text-gray-700">
                  {incident.category}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge value={incident.status.toString()} config={statusConfig} />
                </TableCell>

                {/* Assigned To */}
                <TableCell className="min-w-[150px]">
                  {
                    incident.assignedTo ?
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                        {String(incident.assignedTo.name ?? "?")[0]?.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-700">
                        {incident.assignedTo.name}
                      </div>
                    </div>
                    : <div className="text-sm text-gray-700">Not Assigned</div>
                  }
                  
                </TableCell>

                {/* Date Assigned */}
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(incident.updatedAt).toLocaleDateString()}
                </TableCell>

                {/* Last Updated */}
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(incident.updatedAt).toLocaleDateString()}
                </TableCell>

                {/* Action */}
                <TableCell>
                  <IncidentFormModal isEditing={true} incident={incident}/>
                </TableCell>
              </TableRow>
            ))}

            {totalIncidents === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-gray-500"
                >
                  No incidents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t flex items-center justify-between text-sm text-gray-500">
        <p>
          Showing {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => {changePage(currentPage - 1)}}
            className={`px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded border  ${currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}`} disabled={currentPage == 0}>
            Prev
          </Button>
          <Button
            onClick={() => {changePage(currentPage)}}
            className="px-3 py-1 rounded border-black/20 bg-white border-[1px] hover:bg-gray-200 text-black">
            {page || 1}
          </Button>
          <Button
            onClick={() => {changePage(currentPage + 1)}}
            className={`px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded border  ${currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}`} disabled={Number(page) == totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTable;
