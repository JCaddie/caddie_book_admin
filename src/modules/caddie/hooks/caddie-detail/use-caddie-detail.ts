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

      // 새로운 API 응답 구조에서 데이터 추출 및 호환성 필드 매핑
      const caddieDetail = {
        ...response.data,
        // 호환성을 위한 필드 매핑
        name: response.data.user_name,
        phone: response.data.user_phone,
        email: response.data.user_email,
      };

      setCaddie(caddieDetail);
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
