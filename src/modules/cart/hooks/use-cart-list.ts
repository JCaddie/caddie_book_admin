import { useCallback, useMemo, useState } from "react";
import { Cart, CartFilters, CartSelection, CartStatus } from "../types";
import { generateSampleCarts } from "../utils";
import { CART_ITEMS_PER_PAGE } from "../constants";
import { usePagination } from "@/shared/hooks";
import { simulateApiDelay } from "@/shared/lib/data-utils";

export const useCartList = () => {
  // 필터 상태
  const [filters, setFilters] = useState<CartFilters>({
    searchTerm: "",
    status: undefined,
    golfCourseId: undefined,
    fieldId: undefined,
  });

  // 선택 상태
  const [selection, setSelection] = useState<CartSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 로딩 상태
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 카트 데이터 생성 (메모이제이션)
  const allCarts = useMemo(() => generateSampleCarts(), []);

  // 필터링된 카트 데이터 (메모이제이션)
  const filteredCarts = useMemo(() => {
    return allCarts.filter((cart) => {
      const matchesSearch =
        !filters.searchTerm ||
        cart.name.includes(filters.searchTerm) ||
        cart.golfCourseName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesStatus = !filters.status || cart.status === filters.status;
      const matchesGolfCourse =
        !filters.golfCourseId || cart.golfCourseName === filters.golfCourseId;
      const matchesField =
        !filters.fieldId || cart.fieldName === filters.fieldId;

      return (
        matchesSearch && matchesStatus && matchesGolfCourse && matchesField
      );
    });
  }, [allCarts, filters]);

  // 페이지네이션 처리
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCarts,
      itemsPerPage: CART_ITEMS_PER_PAGE,
    });

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * CART_ITEMS_PER_PAGE;
    return currentData.map((cart, index) => ({
      ...cart,
      no: startIndex + index + 1,
    }));
  }, [currentData, currentPage]);

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
      // 빈 행은 선택에서 제외
      const validSelectedRows = selectedRows.filter(
        (row) => row.id && !row.isEmpty
      );
      const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

      setSelection({
        selectedRowKeys: validSelectedRowKeys,
        selectedRows: validSelectedRows,
      });
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
      if (process.env.NODE_ENV === "development") {
        console.log("삭제할 카트들:", selection.selectedRows);
      }

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
      if (process.env.NODE_ENV === "development") {
        console.log("새 카트 생성:", cartData);
      }
    },
    []
  );

  return {
    // 데이터
    data: paginatedData,
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
