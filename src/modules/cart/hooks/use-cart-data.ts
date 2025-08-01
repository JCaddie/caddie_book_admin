import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Cart, CartFilters, CartStatus } from "../types";
import { mapApiCartsToCartList, mapCartStatusToApiStatus } from "../utils";
import { fetchCartList } from "../api";
import { CART_ITEMS_PER_PAGE } from "../constants";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";
import { addNumberToItems } from "@/shared/utils/pagination-utils";

interface UseCartDataProps {
  selectedGolfCourseId?: string;
  isMaster: boolean;
}

/**
 * 카트 데이터 로딩 및 관리 훅
 */
export const useCartData = ({
  selectedGolfCourseId,
  isMaster,
}: UseCartDataProps) => {
  // URL에서 현재 페이지 및 필터 파라미터 읽기
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const urlSearchTerm = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") as CartStatus | undefined;

  // 필터 상태 (URL과 동기화)
  const filters = useMemo(
    (): CartFilters => ({
      searchTerm: urlSearchTerm,
      status: urlStatus,
      golfCourseId: undefined,
      fieldId: undefined,
    }),
    [urlSearchTerm, urlStatus]
  );

  // React Query를 사용한 데이터 페칭
  const {
    data: apiResponse,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      CACHE_KEYS.CARTS,
      currentPage,
      urlSearchTerm,
      urlStatus,
      isMaster ? selectedGolfCourseId : undefined,
    ],
    queryFn: async () => {
      const apiStatus = urlStatus
        ? mapCartStatusToApiStatus(urlStatus)
        : undefined;
      const golfCourseId = isMaster ? selectedGolfCourseId : undefined;

      const response = await fetchCartList(
        currentPage,
        CART_ITEMS_PER_PAGE,
        urlSearchTerm || undefined,
        apiStatus,
        golfCourseId
      );

      // API 응답 구조 검증
      if (!response.data?.results || !Array.isArray(response.data.results)) {
        console.warn("⚠️ 예상과 다른 API 응답 구조:", response);
        return {
          results: [],
          count: 0,
          total_pages: 1,
        };
      }

      return response.data;
    },
    ...QUERY_CONFIG.REALTIME_OPTIONS,
  });

  // 데이터 변환
  const carts = useMemo(() => {
    if (!apiResponse?.results) return [];
    return mapApiCartsToCartList(apiResponse.results);
  }, [apiResponse?.results]);

  const totalCount = apiResponse?.count || 0;
  const totalPages = apiResponse?.total_pages || 1;

  // 표준화된 에러 처리
  const error = useQueryError(
    queryError,
    "카트 목록 조회 중 오류가 발생했습니다."
  );

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = useMemo(() => {
    return addNumberToItems(carts, currentPage, CART_ITEMS_PER_PAGE);
  }, [carts, currentPage]);

  // 기존 인터페이스 호환성을 위한 함수들
  const loadCarts = () => refetch();

  // React Query 구조에서는 필터가 URL에서 직접 관리되므로 빈 함수로 유지
  const setFilters = () => {
    // URL 파라미터는 외부에서 직접 관리됨
  };

  return {
    // 데이터
    data: paginatedData,
    totalCount,
    totalPages,
    currentPage,
    filters,

    // 상태
    isLoading,
    error,

    // 함수
    loadCarts,
    setFilters,
  };
};
