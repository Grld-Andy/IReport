import { Input } from "@/components/ui/input";
import React from "react";
import SortButton from "../SortButton";
import { CiSearch } from "react-icons/ci";

interface Props {
  totalIncidents: number;
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  orderBy: string;
  setOrderBy: (value: React.SetStateAction<string>) => void;
}
const IncidentsTableHeader: React.FC<Props> = ({totalIncidents, search, setSearch, orderBy, setOrderBy}) => {
  return (
    <div className="px-6 py-4 border-b flex md:items-center justify-between flex-col md:flex-row gap-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Incidents</h1>
        <p className="text-sm text-gray-500">
          {totalIncidents} total record{totalIncidents > 1 && "s"}
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
          <SortButton orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
      </div>
    </div>
  );
};

export default IncidentsTableHeader;
