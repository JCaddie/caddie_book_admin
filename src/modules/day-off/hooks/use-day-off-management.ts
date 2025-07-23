"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DayOffRequest,
  DayOffRequestFilter,
  DayOffRequestType,
  DayOffSearchParams,
  DayOffStatus,
} from "../types";
import {
  approveDayOffRequest,
  getDayOffRequests,
  rejectDayOffRequest,
} from "../api/day-off-api";
import { DAY_OFF_CONSTANTS, DAY_OFF_ERROR_MESSAGES } from "../constants";

export const useDayOffManagement = () => {
  const searchParams = useSearchParams();

  // 상태 관리
  const [data, setData] = useState<DayOffRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 페이지네이션 상태
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // URL 파라미터에서 현재 페이지와 필터 가져오기
  const currentPage = Number(searchParams.get("page") || 1);
  const currentFilters: DayOffRequestFilter = {
    request_type: (searchParams.get("request_type") as DayOffRequestType) || "",
    status: (searchParams.get("status") as DayOffStatus) || "",
    searchTerm: searchParams.get("search") || "",
  };

  // 초기 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: DayOffSearchParams = {
        page: currentPage,
        page_size: DAY_OFF_CONSTANTS.PAGE_SIZE,
      };

      if (currentFilters.request_type) {
        params.request_type = currentFilters.request_type as DayOffRequestType;
      }

      if (currentFilters.status) {
        params.status = currentFilters.status as DayOffStatus;
      }

      if (currentFilters.searchTerm) {
        params.search = currentFilters.searchTerm;
      }

      const response = await getDayOffRequests(params);
      setData(response.results);
      setTotalPages(response.total_pages);
      setTotalCount(response.count);
      setFilteredCount(response.count); // API에서 필터링된 결과를 받으므로 count 사용
    } catch (err) {
      setError(DAY_OFF_ERROR_MESSAGES.FETCH_FAILED);
      console.error("Failed to load day-off data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    currentFilters.request_type,
    currentFilters.status,
    currentFilters.searchTerm,
  ]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 승인 처리
  const handleApprove = useCallback(
    async (id: string) => {
      setActionLoading(id);
      setError(null);

      try {
        await approveDayOffRequest(id);
        // 데이터 새로고침
        await loadData();
      } catch (err) {
        setError(DAY_OFF_ERROR_MESSAGES.APPROVE_FAILED);
        console.error("Failed to approve day-off request:", err);
      } finally {
        setActionLoading(null);
      }
    },
    [loadData]
  );

  // 반려 처리
  const handleReject = useCallback(
    async (id: string) => {
      setActionLoading(id);
      setError(null);

      try {
        await rejectDayOffRequest(id);
        // 데이터 새로고침
        await loadData();
      } catch (err) {
        setError(DAY_OFF_ERROR_MESSAGES.REJECT_FAILED);
        console.error("Failed to reject day-off request:", err);
      } finally {
        setActionLoading(null);
      }
    },
    [loadData]
  );

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
    data,
    totalCount,
    filteredCount,
    totalPages,
    currentPage,

    // 필터
    filters: currentFilters,

    // 액션
    handleApprove,
    handleReject,

    // 상태
    loading,
    error,
    actionLoading,

    // 유틸리티
    clearError,
    refreshData,
  };
};
