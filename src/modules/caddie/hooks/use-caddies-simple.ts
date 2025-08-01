import { useQuery } from "@tanstack/react-query";
import { CaddieSimpleResponse, fetchCaddiesSimple } from "../api";

/**
 * 캐디 간소 목록을 가져오는 React Query 훅 (드롭다운용)
 */
export const useCaddiesSimple = (golfCourseId?: string) => {
  return useQuery<CaddieSimpleResponse, Error>({
    queryKey: ["caddies-simple", golfCourseId],
    queryFn: () => fetchCaddiesSimple(golfCourseId),
    enabled: !!golfCourseId, // golfCourseId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * 캐디 간소 목록 쿼리 키 상수
 */
export const CADDIES_SIMPLE_QUERY_KEY = ["caddies-simple"] as const;
