"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  VacationRequest,
  VacationRequestFilter,
  VacationRequestType,
  VacationSearchParams,
  VacationStatus,
} from "../types";
import {
  approveVacationRequest,
  getVacationRequests,
  rejectVacationRequest,
} from "../api/vacation-api";
import { VACATION_CONSTANTS, VACATION_ERROR_MESSAGES } from "../constants";

export const useVacationManagement = () => {
  const searchParams = useSearchParams();

  // 상태 관리
  const [data, setData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 페이지네이션 상태
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // URL 파라미터에서 현재 페이지와 필터 가져오기
  const currentPage = Number(searchParams.get("page") || 1);
  const currentFilters: VacationRequestFilter = {
    request_type:
      (searchParams.get("request_type") as VacationRequestType) || "",
    status: (searchParams.get("status") as VacationStatus) || "",
    searchTerm: searchParams.get("search") || "",
  };

  // 초기 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: VacationSearchParams = {
        page: currentPage,
        page_size: VACATION_CONSTANTS.PAGE_SIZE,
      };

      if (currentFilters.request_type) {
        params.request_type =
          currentFilters.request_type as VacationRequestType;
      }

      if (currentFilters.status) {
        params.status = currentFilters.status as VacationStatus;
      }

      if (currentFilters.searchTerm) {
        params.search = currentFilters.searchTerm;
      }

      const response = await getVacationRequests(params);
      setData(response.results);
      setTotalPages(response.total_pages);
      setTotalCount(response.count);
      setFilteredCount(response.count); // API에서 필터링된 결과를 받으므로 count 사용
    } catch (err) {
      setError(VACATION_ERROR_MESSAGES.FETCH_FAILED);
      console.error("Failed to load vacation data:", err);
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
        await approveVacationRequest(id);
        // 데이터 새로고침
        await loadData();
      } catch (err) {
        setError(VACATION_ERROR_MESSAGES.APPROVE_FAILED);
        console.error("Failed to approve vacation request:", err);
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
        await rejectVacationRequest(id);
        // 데이터 새로고침
        await loadData();
      } catch (err) {
        setError(VACATION_ERROR_MESSAGES.REJECT_FAILED);
        console.error("Failed to reject vacation request:", err);
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
