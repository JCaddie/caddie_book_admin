import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Cart, CartFilters, CartSelection, CartStatus } from "../types";
import { usePagination } from "@/shared/hooks";
import { createPaddedData, simulateApiDelay } from "@/shared/lib/data-utils";
import { DEFAULT_CART_FILTERS, CART_ITEMS_PER_PAGE } from "../constants";
import {
  generateSampleCarts,
  filterCarts,
  createEmptyCartTemplate,
} from "../utils";

export const useCartList = () => {
  const searchParams = useSearchParams();

  // 필터 상태
  const [filters, setFilters] = useState<CartFilters>(DEFAULT_CART_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<CartSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 로딩 및 에러 상태
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 검색 파라미터로부터 초기 검색어 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: decodeURIComponent(searchParam),
      }));
    }
  }, [searchParams]);

  // 샘플 데이터 생성 (메모이제이션)
  const allCarts = useMemo(() => generateSampleCarts(26), []);

  // 필터링된 데이터 (메모이제이션)
  const filteredCarts = useMemo(() => {
    return filterCarts(allCarts, filters);
  }, [allCarts, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCarts,
      itemsPerPage: CART_ITEMS_PER_PAGE,
    });

  // 빈 행이 추가된 데이터 (메모이제이션)
  const paddedData = useMemo(() => {
    return createPaddedData(
      currentData,
      CART_ITEMS_PER_PAGE,
      createEmptyCartTemplate()
    );
  }, [currentData]);

  // 필터 업데이트 함수들 (useCallback으로 최적화)
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const updateStatus = useCallback((status: CartStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateGolfCourse = useCallback((golfCourseId: string | undefined) => {
    setFilters((prev) => ({ ...prev, golfCourseId }));
  }, []);

  const updateField = useCallback((fieldId: string | undefined) => {
    setFilters((prev) => ({ ...prev, fieldId }));
  }, []);

  // 선택 관련 함수들 (useCallback으로 최적화)
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Cart[]) => {
      setSelection({ selectedRowKeys, selectedRows });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  }, []);

  // 선택된 카트 삭제 (useCallback으로 최적화)
  const deleteSelectedCarts = useCallback(async () => {
    if (selection.selectedRows.length === 0) return;

    setIsDeleting(true);
    setError(null);

    try {
      // API 호출 시뮬레이션
      await simulateApiDelay(1000);

      // TODO: 실제 삭제 API 호출
      console.log("삭제할 카트들:", selection.selectedRows);

      // 성공 후 선택 상태 초기화
      clearSelection();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("카트 삭제 중 오류 발생:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [selection.selectedRows, clearSelection]);

  // 새 카트 생성
  const createNewCart = useCallback(
    (cartData: Omit<Cart, "id" | "no" | "createdAt" | "updatedAt">) => {
      // TODO: 실제 생성 API 호출
      console.log("새 카트 생성:", cartData);
    },
    []
  );

  return {
    // 데이터
    data: paddedData,
    totalCount: filteredCarts.length,
    realDataCount: currentData.length,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 필터
    filters,
    updateSearchTerm,
    updateStatus,
    updateGolfCourse,
    updateField,

    // 선택
    selection,
    updateSelection,
    clearSelection,

    // 액션
    deleteSelectedCarts,
    createNewCart,

    // 상태
    isDeleting,
    error,
  };
};
