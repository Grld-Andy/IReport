import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const UsersTableColumns: React.FC = () => {
  return (
    <TableRow>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-2 w-32 rounded-md" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-full" />
      </TableCell>
    </TableRow>
  );
};

export default UsersTableColumns;
