import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cart, CartFilters, CartStatus } from "../types";
import { mapApiCartsToCartList, mapCartStatusToApiStatus } from "../utils";
import { fetchCartList } from "../api";
import { CART_ITEMS_PER_PAGE } from "../constants";

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

  // 상태 관리
  const [carts, setCarts] = useState<Cart[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태 (URL과 동기화)
  const [filters, setFilters] = useState<CartFilters>({
    searchTerm: urlSearchTerm,
    status: urlStatus,
    golfCourseId: undefined,
    fieldId: undefined,
  });

  // URL 파라미터 변경 시 필터 상태 동기화
  useEffect(() => {
    setFilters({
      searchTerm: urlSearchTerm,
      status: urlStatus,
      golfCourseId: undefined,
      fieldId: undefined,
    });
  }, [urlSearchTerm, urlStatus]);

  // API 호출 함수
  const loadCarts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
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
        setCarts([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }

      const mappedCarts = mapApiCartsToCartList(response.data.results);
      setCarts(mappedCarts);
      setTotalCount(response.data.count || 0);
      setTotalPages(response.data.total_pages || 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 목록 조회 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("카트 목록 조회 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, urlSearchTerm, urlStatus, selectedGolfCourseId, isMaster]);

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * CART_ITEMS_PER_PAGE;
    return carts.map((cart, index) => ({
      ...cart,
      no: startIndex + index + 1,
    }));
  }, [carts, currentPage]);

  // 필터나 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

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
