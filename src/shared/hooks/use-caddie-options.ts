"use client";

import { useCallback, useEffect, useState } from "react";
import { getCaddieList } from "@/modules/caddie/api";
import type { Caddie } from "@/modules/caddie/types";

export interface CaddieOption {
  value: string;
  label: string;
}

export interface UseCaddieOptionsProps {
  golfCourseId?: string;
  enabled?: boolean;
}

export interface UseCaddieOptionsReturn {
  caddieOptions: CaddieOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCaddieOptions = ({
  golfCourseId,
  enabled = true,
}: UseCaddieOptionsProps = {}): UseCaddieOptionsReturn => {
  const [caddieOptions, setCaddieOptions] = useState<CaddieOption[]>([
    { value: "", label: "캐디 선택" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 캐디 목록 로드
  const loadCaddieOptions = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const params: { page_size: number; golf_course_id?: string } = {
        page_size: 1000, // 모든 캐디 가져오기
      };

      if (golfCourseId) {
        params.golf_course_id = golfCourseId;
      }

      const response = await getCaddieList(params);

      // 캐디 목록을 드롭다운 옵션으로 변환
      const options: CaddieOption[] = [
        { value: "", label: "캐디 선택" },
        ...(response?.data?.results || []).map((caddie: Caddie) => ({
          value: caddie.id,
          label: caddie.name || "이름 없음",
        })),
      ];

      setCaddieOptions(options);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "캐디 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("캐디 옵션 로드 에러:", err);
      // 에러 발생 시 기본 옵션만 설정
      setCaddieOptions([{ value: "", label: "캐디 선택" }]);
    } finally {
      setIsLoading(false);
    }
  }, [golfCourseId, enabled]);

  // 골프장 ID가 변경되거나 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (enabled) {
      loadCaddieOptions();
    }
  }, [loadCaddieOptions, enabled]);

  return {
    caddieOptions,
    isLoading,
    error,
    refetch: loadCaddieOptions,
  };
};
