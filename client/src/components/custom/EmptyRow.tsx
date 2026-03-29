import React from "react";
import { TableCell, TableRow } from "../ui/table";

interface Props{
    text: string
}

const EmptyRow: React.FC<Props> = ({text}) => {
  return (
    <TableRow>
      <TableCell colSpan={10} className="text-center py-12 text-gray-500">
        {text}
      </TableCell>
    </TableRow>
  );
};

export default EmptyRow;
