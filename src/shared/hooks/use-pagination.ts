"use client";

import { useState, useMemo } from "react";

export interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  setCurrentPage: (page: number) => void;
  handlePageChange: (page: number) => void;
}

export function usePagination<T>({
  data,
  itemsPerPage = 20,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, currentData } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const current = data.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalPages: total,
      currentData: current,
    };
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    currentData,
    setCurrentPage,
    handlePageChange,
  };
}
