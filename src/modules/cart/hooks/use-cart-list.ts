import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cart, CartFilters, CartSelection, CartStatus } from "../types";
import { mapApiCartsToCartList, mapCartStatusToApiStatus } from "../utils";
import { deleteCartsBulk, fetchCartList } from "../api/cart-api";
import { CART_ITEMS_PER_PAGE } from "../constants";
import { useAuth, useGolfCourseFilter } from "@/shared/hooks";

export const useCartList = () => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";
  const router = useRouter();

  // URL에서 현재 페이지 및 필터 파라미터 읽기
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const urlSearchTerm = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") as CartStatus | undefined;

  // 골프장 필터링 (MASTER 권한에서만 사용)
  const {
    selectedGolfCourseId,
    searchTerm: golfCourseSearchTerm,
    handleGolfCourseChange,
    handleSearchChange: handleGolfCourseSearchChange,
  } = useGolfCourseFilter();

  // 상태 관리
  const [carts, setCarts] = useState<Cart[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // 선택 상태
  const [selection, setSelection] = useState<CartSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

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
      if (!response.results || !Array.isArray(response.results)) {
        console.warn("⚠️ 예상과 다른 API 응답 구조:", response);
        setCarts([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }

      const mappedCarts = mapApiCartsToCartList(response.results);
      setCarts(mappedCarts);
      setTotalCount(response.count || 0);
      setTotalPages(response.total_pages || 1);
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

  // 첫 페이지로 이동하는 헬퍼 함수
  const goToFirstPage = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("page"); // page 파라미터 제거하여 기본값(1)으로 설정
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl);
  }, [router, searchParams]);

  // 필터 업데이트 함수들 (useCallback으로 최적화)
  const updateSearchTerm = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }

      // 검색 시 첫 페이지로 이동
      params.delete("page");

      const newUrl = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    },
    [router, searchParams]
  );

  const updateStatus = useCallback(
    (status: CartStatus | undefined) => {
      setFilters((prev) => ({ ...prev, status }));
      // 필터 변경 시 첫 페이지로 이동
      if (currentPage > 1) {
        goToFirstPage();
      }
    },
    [currentPage, goToFirstPage]
  );

  const updateGolfCourse = useCallback(
    (golfCourseId: string | undefined) => {
      setFilters((prev) => ({ ...prev, golfCourseId }));
      // 필터 변경 시 첫 페이지로 이동
      if (currentPage > 1) {
        goToFirstPage();
      }
    },
    [currentPage, goToFirstPage]
  );

  const updateField = useCallback(
    (fieldId: string | undefined) => {
      setFilters((prev) => ({ ...prev, fieldId }));
      // 필터 변경 시 첫 페이지로 이동
      if (currentPage > 1) {
        goToFirstPage();
      }
    },
    [currentPage, goToFirstPage]
  );

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
      const cartIds = selection.selectedRows.map((cart) => cart.id);
      await deleteCartsBulk(cartIds);

      // 성공 후 목록 새로고침 및 선택 상태 초기화
      await loadCarts();
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
  }, [selection.selectedRows, loadCarts, clearSelection]);

  // 새 카트 생성
  const createNewCart = useCallback(
    (cartData: Omit<Cart, "id" | "no" | "createdAt" | "updatedAt">) => {
      // TODO: 실제 생성 API 호출 후 목록 새로고침
      if (process.env.NODE_ENV === "development") {
        console.log("새 카트 생성:", cartData);
      }
      // 생성 후 목록 새로고침
      loadCarts();
    },
    [loadCarts]
  );

  // 필터나 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

  return {
    // 데이터
    data: paginatedData,
    totalCount,
    realDataCount: carts.length,

    // 페이지네이션
    currentPage,
    totalPages,

    // 필터
    filters,
    updateSearchTerm,
    updateStatus,
    updateGolfCourse,
    updateField,

    // 골프장 필터링 (MASTER 권한용)
    selectedGolfCourseId,
    golfCourseSearchTerm,
    handleGolfCourseChange,
    handleGolfCourseSearchChange,

    // 선택
    selection,
    updateSelection,
    clearSelection,

    // 액션
    deleteSelectedCarts,
    createNewCart,

    // 상태
    isLoading,
    isDeleting,
    error,
  };
};
