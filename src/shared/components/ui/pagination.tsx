"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하인 경우 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 첫 번째 페이지
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // 현재 페이지 주변 페이지들
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // 마지막 페이지 (totalPages가 1보다 큰 경우에만)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {/* 첫 페이지로 이동 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>

      {/* 이전 페이지로 이동 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-4">
        {pages.map((page, index) => (
          <div key={index}>
            {typeof page === "number" ? (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[24px] h-[24px] px-2 rounded-md text-[13px] font-${
                  page === currentPage ? "bold" : "medium"
                } transition-colors ${
                  page === currentPage
                    ? "bg-[#FFFAF2] text-[#FEB912]"
                    : "text-[rgba(0,0,0,0.8)] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="text-[13px] font-medium text-[rgba(0,0,0,0.8)]">
                {page}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 다음 페이지로 이동 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>
    </div>
  );
}
