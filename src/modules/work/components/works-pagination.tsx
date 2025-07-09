"use client";

import React from "react";

interface WorksPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const WorksPagination: React.FC<WorksPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center pt-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
        >
          <span className="text-base">{"<<"}</span>
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
        >
          <span className="text-base">{"<"}</span>
        </button>

        <div className="flex items-center justify-center w-6 h-6 bg-[#FFFAF2] text-[#FEB912] rounded-md text-[13px] font-bold">
          {currentPage}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
        >
          <span className="text-base">{">"}</span>
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-6 h-6 text-gray-400 disabled:opacity-40"
        >
          <span className="text-base">{">>"}</span>
        </button>
      </div>
    </div>
  );
};

export default WorksPagination;
