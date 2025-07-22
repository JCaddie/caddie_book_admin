"use client";

import { useCallback, useEffect, useState } from "react";
import type { CaddieDetail } from "../../types";
import { getCaddieDetail } from "../../api";

export interface UseCaddieDetailReturn {
  caddie: CaddieDetail | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCaddieDetail = (id: string): UseCaddieDetailReturn => {
  const [caddie, setCaddie] = useState<CaddieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 데이터 로드
  const loadCaddieDetail = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCaddieDetail(id);
      setCaddie(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "캐디 상세정보를 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("캐디 상세정보 로드 에러:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // 초기 데이터 로드
  useEffect(() => {
    loadCaddieDetail();
  }, [loadCaddieDetail]);

  return {
    caddie,
    isLoading,
    error,
    refreshData: loadCaddieDetail,
  };
};
