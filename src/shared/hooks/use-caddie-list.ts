"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  Caddie,
  CaddieFilters,
  CaddieListParams,
  CaddieSelection,
} from "@/modules/caddie/types";
import { deleteCaddies, getCaddieList } from "@/modules/caddie/api";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/shared/constants/caddie";

export const useCaddieList = () => {
  const searchParams = useSearchParams();

  // 상태 관리
  const [caddies, setCaddies] = useState<Caddie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // currentPage 상태 제거 - URL에서 직접 읽어옴

  // 필터 상태
  const [filters, setFilters] = useState<CaddieFilters>(DEFAULT_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<CaddieSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // URL 검색 파라미터로부터 필터 상태 설정 (페이지는 제외)
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const golfCourseParam = searchParams.get("golf_course");
    const groupParam = searchParams.get("group");
    const specialTeamParam = searchParams.get("special_team");

    setFilters((prev) => ({
      ...prev,
      searchTerm: searchParam ? decodeURIComponent(searchParam) : "",
      selectedGolfCourseId: golfCourseParam || "",
      selectedGroup: groupParam || "그룹",
      selectedSpecialTeam: specialTeamParam || "특수반",
    }));
  }, [searchParams]);

  // URL에서 현재 페이지 읽어오기
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // API 데이터 로드
  const loadCaddies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: CaddieListParams = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      };

      // 검색 조건 추가
      if (filters.searchTerm.trim()) {
        params.search = filters.searchTerm.trim();
      }

      if (filters.selectedGroup !== "그룹") {
        params.group = filters.selectedGroup;
      }

      if (filters.selectedSpecialTeam !== "특수반") {
        params.special_team = filters.selectedSpecialTeam;
      }

      if (filters.selectedGolfCourseId) {
        params.golf_course = filters.selectedGolfCourseId;
      }

      const response = await getCaddieList(params);

      // 새로운 API 응답 구조에 맞게 데이터 추출
      const caddies = response.data.results.map((caddie) => ({
        ...caddie,
        // 호환성을 위한 필드 매핑
        name: caddie.user_name,
        phone: caddie.user_phone,
        id: String(caddie.id), // UI에서 string ID를 사용하므로 변환
      }));

      setCaddies(caddies);
      setTotalCount(response.data.count);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "캐디 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("캐디 목록 로드 에러:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // 데이터 로드 트리거
  useEffect(() => {
    loadCaddies();
  }, [loadCaddies]);

  // 선택 상태 업데이트
  const updateSelection = (
    selectedRowKeys: string[],
    selectedRows: Caddie[]
  ) => {
    setSelection({ selectedRowKeys, selectedRows });
  };

  // 선택된 항목 삭제
  const deleteSelectedItems = async () => {
    if (selection.selectedRowKeys.length === 0) {
      return Promise.resolve();
    }

    try {
      await deleteCaddies(selection.selectedRowKeys);

      // 삭제 후 데이터 새로고침
      await loadCaddies();

      // 선택 상태 초기화
      setSelection({ selectedRowKeys: [], selectedRows: [] });

      return Promise.resolve();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "캐디 삭제에 실패했습니다.";
      setError(errorMessage);
      console.error("캐디 삭제 에러:", err);
      return Promise.reject(err);
    }
  };

  // 삭제 가능 여부
  const canDelete = selection.selectedRows.length > 0;

  // 선택된 항목 수
  const selectedCount = selection.selectedRows.length;

  // 페이지네이션 계산 (API에서 제공하는 total_pages 사용)

  return {
    // 데이터
    filteredCaddies: caddies, // API에서 이미 필터링된 데이터
    currentData: caddies,
    realDataCount: caddies.length,
    totalCount,

    // 상태
    isLoading,
    error,

    // 필터 상태 (읽기 전용)
    filters,

    // 선택 상태
    selection,
    updateSelection,
    deleteSelectedItems,
    canDelete,
    selectedCount,

    // 페이지네이션
    totalPages,

    // 데이터 새로고침
    refreshData: loadCaddies,
  };
};
