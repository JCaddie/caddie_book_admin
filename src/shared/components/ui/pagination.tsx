"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export interface PaginationProps {
  totalPages: number;
  className?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalPages,
  className = "",
  onPageChange,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      // 외부에서 제공한 페이지 변경 핸들러 사용
      onPageChange(page);
    } else {
      // 기본 동작: URL 파라미터 직접 업데이트
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("page", String(page));
      router.push(`?${params.toString()}`);
    }
  };

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
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>

      {/* 이전 페이지로 이동 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(page)}
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
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-md border border-[#DDDDDD] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={16} className="text-[rgba(0,0,0,0.3)]" />
      </button>
    </div>
  );
}
