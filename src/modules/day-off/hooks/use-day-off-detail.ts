"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DayOffRequest } from "../types";
import { getDayOffRequestDetail } from "../api/day-off-api";
import { DAY_OFF_ERROR_MESSAGES } from "../constants";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";

export const useDayOffDetail = (id: string) => {
  // React Query를 사용한 데이터 페칭
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [CACHE_KEYS.DAY_OFF_DETAIL, id],
    queryFn: () => getDayOffRequestDetail(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
  });

  // 표준화된 에러 처리
  const error = useQueryError(queryError, DAY_OFF_ERROR_MESSAGES.FETCH_FAILED);

  // 기존 인터페이스 호환성을 위한 함수들
  const refreshData = () => refetch();
  const clearError = () => {
    // React Query에서는 자동으로 에러가 관리되므로 빈 함수
  };

  return {
    data: data || null,
    loading,
    error,
    refreshData,
    clearError,
  };
};
