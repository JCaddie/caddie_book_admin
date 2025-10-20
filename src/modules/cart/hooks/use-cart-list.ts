import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGolfCourseFilter } from "@/shared/hooks/use-golf-course-filter";
import { useCartData } from "./use-cart-data";
import { useCartSelection } from "./use-cart-selection";
import { useCartActions } from "./use-cart-actions";

export const useCartList = () => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";
  const router = useRouter();

  // 골프장 필터링 (MASTER 권한에서만 사용)
  const {
    selectedGolfCourseId,
    searchTerm: golfCourseSearchTerm,
    handleGolfCourseChange,
    handleSearchChange: handleGolfCourseSearchChange,
  } = useGolfCourseFilter();

  // 카트 데이터 관리
  const {
    data: cartData,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: loadCarts,
  } = useCartData({ selectedGolfCourseId, isMaster });

  // 선택 상태 관리
  const { selection, updateSelection, clearSelection } = useCartSelection();

  // 카트 액션 관리
  const {
    isDeleting,
    error: actionError,
    deleteSelectedCarts,
    createNewCart,
  } = useCartActions({
    onCartListUpdate: async () => {
      await loadCarts();
    },
    onSelectionClear: clearSelection,
  });

  // 첫 페이지로 이동하는 헬퍼 함수
  const goToFirstPage = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  }, [router]);

  // 필터 업데이트 함수들
  const updateSearchTerm = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(window.location.search);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // 첫 페이지로 이동
      router.replace(`?${params.toString()}`);
    },
    [router]
  );

  const updateStatusFilter = useCallback(
    (status: string | undefined) => {
      const params = new URLSearchParams(window.location.search);
      if (status) {
        params.set("status", status);
      } else {
        params.delete("status");
      }
      params.set("page", "1"); // 첫 페이지로 이동
      router.replace(`?${params.toString()}`);
    },
    [router]
  );

  const updateGolfCourseFilter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_golfCourseId: string | undefined) => {
      // 골프장 필터 업데이트 로직 (필요시 구현)
      goToFirstPage();
    },
    [goToFirstPage]
  );

  const updateFieldFilter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_fieldId: string | undefined) => {
      // 필드 필터 업데이트 로직 (필요시 구현)
      goToFirstPage();
    },
    [goToFirstPage]
  );

  // 선택된 카트 삭제 래퍼
  const handleDeleteSelectedCarts = useCallback(async () => {
    await deleteSelectedCarts(selection.selectedRows);
  }, [deleteSelectedCarts, selection.selectedRows]);

  // 실제 데이터 개수 계산 (빈 행 제외)
  const realDataCount = cartData?.filter((item) => !item.isEmpty).length || 0;

  return {
    // 데이터
    data: cartData,
    totalCount,
    realDataCount,
    totalPages,
    currentPage,

    // 선택 상태
    selection,
    selectedCount: selection.selectedRows.length,

    // 상태
    isLoading,
    isDeleting,
    error: error || actionError,

    // 골프장 필터 (MASTER 전용)
    isMaster,
    selectedGolfCourseId,
    golfCourseSearchTerm,

    // 함수들
    updateSelection,
    clearSelection,
    updateSearchTerm,
    updateStatusFilter,
    updateGolfCourseFilter,
    updateFieldFilter,
    deleteSelectedCarts: handleDeleteSelectedCarts,
    createNewCart,
    handleGolfCourseChange,
    handleGolfCourseSearchChange,
    loadCarts,
  };
};
