"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DayOffRequest,
  DayOffRequestFilter,
  DayOffRequestType,
  DayOffSearchParams,
  DayOffStatus,
} from "../types";
import { getDayOffRequests } from "../api/day-off-api";
import { DAY_OFF_CONSTANTS, DAY_OFF_ERROR_MESSAGES } from "../constants";

interface UseDayOffListReturn {
  // 데이터
  data: DayOffRequest[];
  filteredCount: number;
  totalPages: number;
  currentPage: number;

  // 필터
  filters: DayOffRequestFilter;

  // 상태
  loading: boolean;
  error: string | null;

  // 유틸리티
  clearError: () => void;
  refreshData: () => void;
}

export const useDayOffList = (): UseDayOffListReturn => {
  const searchParams = useSearchParams();

  // 상태 관리
  const [data, setData] = useState<DayOffRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [totalPages, setTotalPages] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);

  // URL 파라미터에서 현재 페이지와 필터 가져오기
  const currentPage = Number(searchParams.get("page") || 1);
  const currentFilters = useMemo(
    (): DayOffRequestFilter => ({
      request_type:
        (searchParams.get("request_type") as DayOffRequestType) || "",
      status: (searchParams.get("status") as DayOffStatus) || "",
      searchTerm: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  // API 파라미터 생성
  const createApiParams = useCallback((): DayOffSearchParams => {
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

    return params;
  }, [currentPage, currentFilters]);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = createApiParams();
      const response = await getDayOffRequests(params);

      setData(response.results);
      setTotalPages(response.total_pages);
      setFilteredCount(response.count);
    } catch (err) {
      setError(DAY_OFF_ERROR_MESSAGES.FETCH_FAILED);
      console.error("Failed to load day-off data:", err);
    } finally {
      setLoading(false);
    }
  }, [createApiParams]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

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
    filteredCount,
    totalPages,
    currentPage,

    // 필터
    filters: currentFilters,

    // 상태
    loading,
    error,

    // 유틸리티
    clearError,
    refreshData,
  };
};
