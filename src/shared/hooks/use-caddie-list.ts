import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Caddie, CaddieFilters, CaddieSelection } from "@/shared/types/caddie";
import { usePagination } from "@/shared/hooks";
import {
  generateSampleCaddies,
  filterCaddies,
  createPaddedData,
} from "@/shared/lib/caddie-utils";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/shared/constants/caddie";

export const useCaddieList = () => {
  const searchParams = useSearchParams();

  // 필터 상태
  const [filters, setFilters] = useState<CaddieFilters>(DEFAULT_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<CaddieSelection>({
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
  const allCaddies = useMemo(() => generateSampleCaddies(), []);

  // 필터링된 데이터
  const filteredCaddies = useMemo(() => {
    return filterCaddies(allCaddies, filters);
  }, [allCaddies, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCaddies,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  // 빈 행이 추가된 데이터 (일정한 테이블 높이 유지)
  const paddedData = useMemo(() => {
    return createPaddedData(currentData);
  }, [currentData]);

  // 필터 업데이트 함수들
  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const updateSelectedGroup = (selectedGroup: string) => {
    setFilters((prev) => ({ ...prev, selectedGroup }));
  };

  const updateSelectedSpecialTeam = (selectedSpecialTeam: string) => {
    setFilters((prev) => ({ ...prev, selectedSpecialTeam }));
  };

  // 선택 상태 업데이트
  const updateSelection = (
    selectedRowKeys: string[],
    selectedRows: Caddie[]
  ) => {
    setSelection({ selectedRowKeys, selectedRows });
  };

  // 선택된 항목 삭제 (모달 확인 없이 직접 실행)
  const deleteSelectedItems = () => {
    // 실제 삭제 API 호출 로직 구현
    // TODO: API 호출

    // 삭제 후 선택 상태 초기화
    setSelection({ selectedRowKeys: [], selectedRows: [] });

    return Promise.resolve(); // 성공 시 resolve
  };

  // 삭제 가능 여부
  const canDelete = selection.selectedRows.length > 0;

  // 선택된 항목 수
  const selectedCount = selection.selectedRows.length;

  return {
    // 데이터
    filteredCaddies,
    paddedData,
    realDataCount: currentData.length, // 실제 데이터 개수 (빈 행 제외)

    // 필터 상태
    filters,
    updateSearchTerm,
    updateSelectedGroup,
    updateSelectedSpecialTeam,

    // 선택 상태
    selection,
    updateSelection,
    deleteSelectedItems,
    canDelete,
    selectedCount,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,
  };
};
