"use client";

import { useCallback, useEffect, useState } from "react";
import { DayOffRequest } from "../types";
import { getDayOffRequestDetail } from "../api/day-off-api";
import { DAY_OFF_ERROR_MESSAGES } from "../constants";

export const useDayOffDetail = (id: string) => {
  const [data, setData] = useState<DayOffRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getDayOffRequestDetail(id);
      setData(response);
    } catch (err) {
      setError(DAY_OFF_ERROR_MESSAGES.FETCH_FAILED);
      console.error("Failed to load day-off detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    refreshData,
    clearError,
  };
};
