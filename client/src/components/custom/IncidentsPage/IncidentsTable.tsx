import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  primaryIncidentColumns,
  adminIncidentColumns,
} from "@/constants/incidentColumns";
import { getIncidents } from "@/services/getIncidents";
import type { Incident } from "@/types/Incident";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/app/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import IncidentsRow from "./TableUI/IncidentsRow";
import PaginationFooter from "../PaginationFooter";
import EmptyRow from "../EmptyRow";
import IncidentsTableHeader from "./TableUI/IncidentsTableHeader";

const IncidentsTable: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalIncidents, setTotalIncidents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const stateIncidentsIsSet = useAppSelector((state) => state.incidents.isSet);
  const stateTotalIncidents = useAppSelector(
    (state) => state.incidents.totalIncidents,
  );
  const stateIncidents = useAppSelector((state) => state.incidents.incidents);
  const incidentColumns = useMemo(() => {
    return user?.role === "admin"
      ? adminIncidentColumns
      : primaryIncidentColumns;
  }, [user?.role]);
  const newIncidentColumns =
    user?.role == "responder"
      ? incidentColumns
      : [...incidentColumns, "Action"];

  const navigate = useNavigate();
  const { page } = useParams();
  const debouncedSearch = useDebounce(search, 500);

  const currentPage = Math.max(1, Number(page) || 1);

  const fetchIncidents = useCallback(async () => {
    try {
      const result = await getIncidents(
        currentPage,
        debouncedSearch,
        orderBy,
        user?.team,
      );
      setIncidents(result.incidents ?? []);
      setTotalIncidents(result.totalIncidents ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, orderBy, user?.team]);

  useEffect(() => {
    console.log("fetching incidents")
    if(!stateIncidentsIsSet) {
      console.log('cancel fetcing incidents')
      setLoading(true);
      return
    };
    fetchIncidents();
  }, [fetchIncidents, stateIncidentsIsSet, stateTotalIncidents]);

  const changePage = (pageTo: number) => {
    if (pageTo < 1 || pageTo > totalPages) return;
    navigate(`/incidents/${pageTo}`);
  };

  useEffect(() => {
    setIncidents((prev) =>
      prev.map((incident) => {
        const updated = stateIncidents.find((s) => s.id === incident.id);
        return updated ?? incident;
      }),
    );
  }, [stateIncidents]);

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    setTotalIncidents((prev) => {
      const newTotal = prev - 1;
      setTotalPages(Math.ceil(newTotal / 10));
      return newTotal;
    });
  };

  useEffect(() => {
    if (incidents.length < 1 && currentPage > 1) {
      navigate(`/incidents/${currentPage - 1}`);
    }
  }, [currentPage, incidents.length, navigate]);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <IncidentsTableHeader totalIncidents={totalIncidents}
        search={search} setSearch={setSearch}
        orderBy={orderBy} setOrderBy={setOrderBy}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {newIncidentColumns.map((col) => (
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
            {loading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {newIncidentColumns.map((_, cidx) => (
                    <TableCell key={cidx} className="py-3">
                      <Skeleton className="h-4 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && incidents.length === 0 && (
              <EmptyRow text={"No incidents found"}/>
            )}

            {/* Data */}
            {!loading &&
              incidents?.map((incident) => (
                <IncidentsRow key={incident.id} incident={incident} user={user} deleteIncident={deleteIncident}/>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <PaginationFooter totalPages={totalPages} currentPage={currentPage} changePage={changePage}/>
    </div>
  );
};

export default IncidentsTable;
