"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Caddie, CaddieFilters, CaddieSelection } from "@/shared/types/caddie";
import { usePagination } from "@/shared/hooks";
import {
  filterCaddies,
  generateSampleCaddies,
} from "@/shared/lib/caddie-utils";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/shared/constants/caddie";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGolfCourseFilter } from "@/shared/hooks/use-golf-course-filter";

export const useCaddieList = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  // 골프장 필터링 (MASTER 권한에서만 사용)
  const {
    selectedGolfCourseId,
    searchTerm: golfCourseSearchTerm,
    handleGolfCourseChange,
    handleSearchChange: handleGolfCourseSearchChange,
    getFilteredData,
  } = useGolfCourseFilter();

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

  // 골프장 필터링 적용 (MASTER 권한에서만)
  const golfCourseFilteredCaddies = useMemo(() => {
    if (!isMaster) return allCaddies;
    return getFilteredData(allCaddies);
  }, [allCaddies, getFilteredData, isMaster]);

  // 기존 필터링된 데이터
  const filteredCaddies = useMemo(() => {
    return filterCaddies(golfCourseFilteredCaddies, filters);
  }, [golfCourseFilteredCaddies, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredCaddies,
      itemsPerPage: ITEMS_PER_PAGE,
    });

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
    currentData,
    realDataCount: currentData.length, // 실제 데이터 개수 (빈 행 제외)

    // 필터 상태
    filters,
    updateSearchTerm,
    updateSelectedGroup,
    updateSelectedSpecialTeam,

    // 골프장 필터링 (MASTER 권한용)
    selectedGolfCourseId,
    golfCourseSearchTerm,
    handleGolfCourseChange,
    handleGolfCourseSearchChange,

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
