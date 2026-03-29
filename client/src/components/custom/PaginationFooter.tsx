import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  changePage: (pageTo: number) => void;
}
const PaginationFooter: React.FC<Props> = ({
  currentPage,
  totalPages,
  changePage,
}) => {
  return (
    <div className="px-6 py-3 border-t flex items-center justify-between text-sm text-gray-500">
      <p>
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">
        <Button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Prev
        </Button>

        <Button variant="outline">{currentPage}</Button>

        <Button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationFooter;
