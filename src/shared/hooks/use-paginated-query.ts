import { useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { QUERY_CONFIG } from "../lib/query-config";
import { useQueryError } from "./use-query-error";
import {
  addNumberToItems,
  createPaginationMeta,
} from "../utils/pagination-utils";

/**
 * 페이지네이션된 API 응답 타입
 */
export interface PaginatedApiResponse<T> {
  results: T[];
  count: number;
  total_pages: number;
  current_page?: number;
}

/**
 * 페이지네이션된 쿼리 훅의 설정
 */
export interface UsePaginatedQueryConfig<
  TData,
  TParams = Record<string, unknown>
> {
  // 필수 설정
  cacheKey: string;
  queryFn: (
    params: TParams & { page: number; page_size: number }
  ) => Promise<PaginatedApiResponse<TData>>;

  // 페이지네이션 설정
  itemsPerPage?: number;

  // URL 파라미터 파싱
  parseUrlParams?: (searchParams: URLSearchParams) => TParams;

  // 쿼리 옵션
  queryOptions?: Partial<UseQueryOptions<PaginatedApiResponse<TData>>>;

  // 에러 메시지
  errorMessage?: string;
}

/**
 * 페이지네이션된 쿼리 훅의 반환 타입
 */
export interface UsePaginatedQueryReturn<TData> {
  // 데이터
  data: (TData & { no: number })[];
  rawData: TData[];

  // 메타데이터
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pagination: ReturnType<typeof createPaginationMeta>;

  // 상태
  isLoading: boolean;
  error: string | null;

  // 함수
  refetch: () => void;
}

/**
 * 페이지네이션된 데이터를 가져오는 공통 훅
 */
export function usePaginatedQuery<TData, TParams = Record<string, unknown>>(
  config: UsePaginatedQueryConfig<TData, TParams>
): UsePaginatedQueryReturn<TData> {
  const {
    cacheKey,
    queryFn,
    itemsPerPage = 20,
    parseUrlParams,
    queryOptions,
    errorMessage = "데이터를 불러오는데 실패했습니다.",
  } = config;

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  // URL 파라미터 파싱
  const urlParams = useMemo(() => {
    return parseUrlParams ? parseUrlParams(searchParams) : ({} as TParams);
  }, [searchParams, parseUrlParams]);

  // React Query
  const {
    data: apiResponse,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [cacheKey, currentPage, urlParams],
    queryFn: () =>
      queryFn({
        ...urlParams,
        page: currentPage,
        page_size: itemsPerPage,
      }),
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
    ...queryOptions,
  });

  // 데이터 추출
  const rawData = apiResponse?.results || [];
  const totalCount = apiResponse?.count || 0;
  const totalPages = apiResponse?.total_pages || 1;

  // 번호가 추가된 데이터
  const data = useMemo(() => {
    return addNumberToItems(rawData, currentPage, itemsPerPage);
  }, [rawData, currentPage, itemsPerPage]);

  // 페이지네이션 메타데이터
  const pagination = useMemo(() => {
    return createPaginationMeta(currentPage, totalCount, itemsPerPage);
  }, [currentPage, totalCount, itemsPerPage]);

  // 에러 처리
  const error = useQueryError(queryError, errorMessage);

  return {
    data,
    rawData,
    totalCount,
    totalPages,
    currentPage,
    pagination,
    isLoading,
    error,
    refetch,
  };
}
