"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";

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
  const apiParams = useMemo((): DayOffSearchParams => {
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

  // React Query를 사용한 데이터 페칭
  const {
    data: apiResponse,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      CACHE_KEYS.DAY_OFF_REQUESTS,
      currentPage,
      currentFilters.request_type,
      currentFilters.status,
      currentFilters.searchTerm,
    ],
    queryFn: () => getDayOffRequests(apiParams),
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
  });

  // 데이터 추출
  const data = apiResponse?.data?.results || [];
  const totalPages = apiResponse?.data?.total_pages || 1;
  const filteredCount = apiResponse?.data?.count || 0;

  // 표준화된 에러 처리
  const error = useQueryError(queryError, DAY_OFF_ERROR_MESSAGES.FETCH_FAILED);

  // 기존 인터페이스 호환성을 위한 함수들
  const clearError = () => {
    // React Query에서는 자동으로 에러가 관리되므로 빈 함수
  };

  const refreshData = () => refetch();

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
