"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { VacationRequest, VacationRequestFilter } from "../types";
import { getVacationRequests } from "../utils";
import { VACATION_CONSTANTS, VACATION_ERROR_MESSAGES } from "../constants";
import { usePagination } from "@/shared/hooks";

export const useVacationManagement = () => {
  // 상태 관리
  const [data, setData] = useState<VacationRequest[]>([]);
  const [filters, setFilters] = useState<VacationRequestFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 초기 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 환경에서는 API 호출
      const result = await Promise.resolve(getVacationRequests());
      setData(result);
    } catch (err) {
      setError(VACATION_ERROR_MESSAGES.FETCH_FAILED);
      console.error("Failed to load vacation data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 신청구분 필터
      if (
        filters.requestType &&
        filters.requestType.trim() !== "" &&
        item.requestType !== filters.requestType
      ) {
        return false;
      }

      // 상태 필터
      if (
        filters.status &&
        filters.status.trim() !== "" &&
        item.status !== filters.status
      ) {
        return false;
      }

      // 검색어 필터
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchTerm = filters.searchTerm.toLowerCase().trim();
        return (
          item.caddieName.toLowerCase().includes(searchTerm) ||
          item.reason.toLowerCase().includes(searchTerm) ||
          item.phone.includes(searchTerm)
        );
      }

      return true;
    });
  }, [data, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredData,
      itemsPerPage: VACATION_CONSTANTS.PAGE_SIZE,
    });

  // 승인 처리
  const handleApprove = useCallback(async (id: string) => {
    setActionLoading(id);
    setError(null);

    try {
      // 실제 환경에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500)); // 시뮬레이션

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
    } catch (err) {
      setError(VACATION_ERROR_MESSAGES.APPROVE_FAILED);
      console.error("Failed to approve vacation request:", err);
    } finally {
      setActionLoading(null);
    }
  }, []);

  // 반려 처리
  const handleReject = useCallback(async (id: string) => {
    setActionLoading(id);
    setError(null);

    try {
      // 실제 환경에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500)); // 시뮬레이션

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
    } catch (err) {
      setError(VACATION_ERROR_MESSAGES.REJECT_FAILED);
      console.error("Failed to reject vacation request:", err);
    } finally {
      setActionLoading(null);
    }
  }, []);

  // 필터 변경
  const handleFilterChange = useCallback(
    (newFilters: VacationRequestFilter) => {
      setFilters(newFilters);
      // 필터 변경 시 첫 페이지로 이동
      handlePageChange(1);
    },
    [handlePageChange]
  );

  // 행 클릭 핸들러
  const handleRowClick = useCallback((record: VacationRequest) => {
    // 빈 행인 경우 무시
    if (record.isEmpty) return;

    // 필요시 디테일 페이지로 이동 등의 로직 추가
    console.log("Row clicked:", record);
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // 데이터
    data: currentData,
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 필터
    filters,
    handleFilterChange,

    // 액션
    handleApprove,
    handleReject,
    handleRowClick,

    // 상태
    loading,
    error,
    actionLoading,

    // 유틸리티
    clearError,
    refreshData,
  };
};
