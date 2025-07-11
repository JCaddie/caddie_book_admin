"use client";

import { useState, useMemo } from "react";
import { VacationRequest, VacationRequestFilter } from "../types";
import { getVacationRequests, getVacationRequestCount } from "../utils";

export const useVacationManagement = () => {
  const [filters, setFilters] = useState<VacationRequestFilter>({});
  const [data, setData] = useState<VacationRequest[]>(getVacationRequests());

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.requestType && item.requestType !== filters.requestType) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        return (
          item.caddieName.toLowerCase().includes(searchTerm) ||
          item.reason.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  }, [data, filters]);

  // 승인 처리
  const handleApprove = (id: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "승인",
              approver: "관리자",
              approvalDate: new Date()
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "."),
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  // 반려 처리
  const handleReject = (id: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "반려",
              approver: "관리자",
              approvalDate: new Date()
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "."),
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  // 필터 변경
  const handleFilterChange = (newFilters: VacationRequestFilter) => {
    setFilters(newFilters);
  };

  // 행 클릭 핸들러
  const handleRowClick = (record: VacationRequest) => {
    // 필요시 디테일 페이지로 이동 등의 로직 추가
    console.log("Row clicked:", record);
  };

  // 삭제 처리 (현재는 사용하지 않음)
  const handleDelete = () => {
    console.log("Delete functionality not implemented yet");
  };

  return {
    data: filteredData,
    filters,
    totalCount: getVacationRequestCount(),
    handleApprove,
    handleReject,
    handleFilterChange,
    handleRowClick,
    handleDelete,
  };
};
