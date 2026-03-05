import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { incidents } from "@/constants/incidents";
import SortButton from "./IncidentsPage/SortButton";
import FilterButton from "./IncidentsPage/FilterButton";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { getSeverityColor } from "@/constants/getColors";

const severityConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: getSeverityColor("Low"),
  },
  medium: {
    label:"Medium",
    className: getSeverityColor("Medium"),
  },
  high: {
    label: "High",
    className: getSeverityColor("High"),
  },
  critical: {
    label: "Critical",
    className: getSeverityColor("Critical"),
  },
};

const statusConfig: Record<
  string,
  { label: string; dot: string; className: string }
> = {
  open: {
    label: "Open",
    dot: "bg-blue-400",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-emerald-400",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  closed: {
    label: "Closed",
    dot: "bg-gray-400",
    className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  },
};

function Badge({
  value,
  config,
}: {
  value: string;
  config: Record<string, { label: string; className: string; dot?: string }>;
}) {
  const key = value?.toLowerCase().replace(" ", "_");
  const cfg = config[key] ?? {
    label: value,
    className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${cfg.className}`}
    >
      {"dot" in cfg && cfg.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
}

const IncidentsTable: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = incidents.filter(
    (i) =>
      i.subject?.toLowerCase().includes(search.toLowerCase()) ||
      i.descrition?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.04), 0 12px 32px -4px rgba(0,0,0,0.08)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-xl font-bold text-gray-900 tracking-tight"
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            Incidents
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="font-semibold text-gray-700">
              {incidents.length}
            </span>{" "}
            total records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <CiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
              className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg w-56 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 placeholder:text-gray-400"
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
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
              {[
                "Incident",
                "Description",
                "Severity",
                "Category",
                "Status",
                "Assigned To",
                "Date Assigned",
                "Last Updated",
                "Action",
              ].map((col) => (
                <TableHead
                  key={col}
                  className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 whitespace-nowrap"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((incident, index) => (
              <TableRow
                key={index}
                className="group border-b border-gray-50 hover:bg-indigo-50/30 transition-colors duration-150"
              >
                {/* Incident subject + time */}
                <TableCell className="py-4 min-w-[160px]">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">
                    {incident.subject}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 tabular-nums">
                    {incident.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <span className="mx-1 text-gray-300">·</span>
                    {incident.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </TableCell>

                {/* Description */}
                <TableCell className="text-sm text-gray-500 max-w-[220px]">
                  <p className="line-clamp-2 leading-relaxed">
                    {incident.descrition}
                  </p>
                </TableCell>

                {/* Severity */}
                <TableCell>
                  <Badge value={incident.severity} config={severityConfig} />
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="text-sm text-gray-600 font-medium">
                    {incident.category}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge value={incident.status} config={statusConfig} />
                </TableCell>

                {/* Assigned To */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {String(incident.assignedToId ?? "?")[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {incident.assignedToId}
                    </span>
                  </div>
                </TableCell>

                {/* Date Assigned */}
                <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
                  {incident.updatedAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Last Updated */}
                <TableCell className="text-sm text-gray-500 tabular-nums whitespace-nowrap">
                  {incident.updatedAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Action */}
                <TableCell>
                  <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap">
                    View →
                  </button>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-16 text-gray-400 text-sm"
                >
                  No incidents match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-600">
            {incidents.length}
          </span>{" "}
          incidents
        </p>
        <div className="flex gap-1">
          <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            ← Prev
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white font-semibold">
            1
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTable;
