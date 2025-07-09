import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Cart, CartFilters, CartSelection, CartStatus } from "../types";
import { usePagination } from "@/shared/hooks";
import { DEFAULT_CART_FILTERS, CART_ITEMS_PER_PAGE } from "../constants";

// 샘플 카트 데이터 생성
const generateSampleCarts = (): Cart[] => {
  const statuses: CartStatus[] = [
    "사용중",
    "대기",
    "점검중",
    "고장",
    "사용불가",
  ];
  const fieldNames = [
    "한울(서남)",
    "누리(남서)",
    "청솔(동남)",
    "배롱(북동)",
    "소나무(서북)",
  ];
  const golfCourses = ["제이캐디아카데미", "라이딩클럽", "골프존"];
  const managers = ["홍길동", "김철수", "박영희", "이영수", "최민수"];

  return Array.from({ length: 26 }, (_, index) => ({
    id: `cart-${index + 1}`,
    no: index + 1,
    name: `카트${index + 1}`,
    status: statuses[index % statuses.length],
    fieldName: fieldNames[index % fieldNames.length],
    golfCourseName: golfCourses[index % golfCourses.length],
    managerName: managers[index % managers.length],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  }));
};

// 카트 필터링 함수
const filterCarts = (carts: Cart[], filters: CartFilters): Cart[] => {
  return carts.filter((cart) => {
    // 검색어 필터
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        cart.name.toLowerCase().includes(searchTerm) ||
        cart.fieldName.toLowerCase().includes(searchTerm) ||
        cart.golfCourseName.toLowerCase().includes(searchTerm) ||
        cart.managerName.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // 상태 필터
    if (filters.status && cart.status !== filters.status) {
      return false;
    }

    return true;
  });
};

// 빈 행을 추가하여 일정한 테이블 높이 유지
const createPaddedData = (data: Cart[]): Cart[] => {
  const paddingCount = Math.max(0, CART_ITEMS_PER_PAGE - data.length);
  const emptyRows = Array.from({ length: paddingCount }, (_, index) => ({
    id: `empty-${index}`,
    no: 0,
    name: "",
    status: "대기" as CartStatus,
    fieldName: "",
    golfCourseName: "",
    managerName: "",
    createdAt: "",
    updatedAt: "",
  }));

  return [...data, ...emptyRows];
};

export const useCartList = () => {
  const searchParams = useSearchParams();

  // 필터 상태
  const [filters, setFilters] = useState<CartFilters>(DEFAULT_CART_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<CartSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

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

  // 샘플 데이터 생성
  const allCarts = useMemo(() => generateSampleCarts(), []);

  // 필터링된 데이터
  const filteredCarts = useMemo(() => {
    return filterCarts(allCarts, filters);
  }, [allCarts, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCarts,
      itemsPerPage: CART_ITEMS_PER_PAGE,
    });

  // 빈 행이 추가된 데이터 (일정한 테이블 높이 유지)
  const paddedData = useMemo(() => {
    return createPaddedData(currentData);
  }, [currentData]);

  // 필터 업데이트 함수들
  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const updateStatus = (status: CartStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  // 선택 관련 함수들
  const updateSelection = (selectedRowKeys: string[], selectedRows: Cart[]) => {
    setSelection({ selectedRowKeys, selectedRows });
  };

  const clearSelection = () => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  };

  // 선택된 카트 삭제
  const deleteSelectedCarts = () => {
    // TODO: 실제 삭제 API 호출
    console.log("삭제할 카트들:", selection.selectedRows);
    clearSelection();
  };

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

    // 선택
    selection,
    updateSelection,
    clearSelection,
    deleteSelectedCarts,
  };
};
