import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QUERY_CONFIG } from "../lib/query-config";
import { useQueryError } from "./use-query-error";

/**
 * 상세 쿼리 훅의 설정
 */
export interface UseDetailQueryConfig<TData, TId = string> {
  // 필수 설정
  cacheKey: string;
  queryFn: (id: TId) => Promise<TData>;
  id: TId;

  // 쿼리 옵션
  queryOptions?: Partial<UseQueryOptions<TData>>;

  // 에러 메시지
  errorMessage?: string;

  // 활성화 조건 (기본: id가 존재할 때)
  enabled?: boolean;
}

/**
 * 상세 쿼리 훅의 반환 타입
 */
export interface UseDetailQueryReturn<TData> {
  // 데이터
  data: TData | null;

  // 상태
  isLoading: boolean;
  error: string | null;

  // 함수
  refetch: () => void;

  // 유틸리티
  hasData: boolean;
}

/**
 * 상세 데이터를 가져오는 공통 훅
 */
export function useDetailQuery<TData, TId = string>(
  config: UseDetailQueryConfig<TData, TId>
): UseDetailQueryReturn<TData> {
  const {
    cacheKey,
    queryFn,
    id,
    queryOptions,
    errorMessage = "상세 정보를 불러오는데 실패했습니다.",
    enabled = true,
  } = config;

  // React Query
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [cacheKey, id],
    queryFn: () => queryFn(id),
    enabled: enabled && !!id,
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
    ...queryOptions,
  });

  // 에러 처리
  const error = useQueryError(queryError, errorMessage);

  return {
    data: data || null,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
}
