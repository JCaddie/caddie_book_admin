"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  Caddie,
  CaddieFilters,
  CaddieListParams,
  CaddieSelection,
} from "@/modules/caddie/types";
import { deleteCaddies, getCaddieList } from "@/modules/caddie/api";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/shared/constants/caddie";

export const useCaddieList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 관리
  const [caddies, setCaddies] = useState<Caddie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // 필터 상태
  const [filters, setFilters] = useState<CaddieFilters>(DEFAULT_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<CaddieSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // URL 검색 파라미터로부터 필터 상태 및 페이지 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const golfCourseParam = searchParams.get("golf_course");
    const groupParam = searchParams.get("group");
    const specialTeamParam = searchParams.get("special_team");
    const pageParam = searchParams.get("page");

    setFilters((prev) => ({
      ...prev,
      searchTerm: searchParam ? decodeURIComponent(searchParam) : "",
      selectedGolfCourseId: golfCourseParam || "",
      selectedGroup: groupParam || "그룹",
      selectedSpecialTeam: specialTeamParam || "특수반",
    }));

    setCurrentPage(pageParam ? parseInt(pageParam, 10) : 1);
  }, [searchParams]);

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
        params.golf_course_id = filters.selectedGolfCourseId;
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

  // 페이지 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 필터 업데이트 함수들
  const updateSelectedGroup = (selectedGroup: string) => {
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (selectedGroup && selectedGroup !== "그룹") {
      params.set("group", selectedGroup);
    } else {
      params.delete("group");
    }
    params.delete("page");

    router.push(`?${params.toString()}`);
    setFilters((prev) => ({ ...prev, selectedGroup }));
  };

  const updateSelectedSpecialTeam = (selectedSpecialTeam: string) => {
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (selectedSpecialTeam && selectedSpecialTeam !== "특수반") {
      params.set("special_team", selectedSpecialTeam);
    } else {
      params.delete("special_team");
    }
    params.delete("page");

    router.push(`?${params.toString()}`);
    setFilters((prev) => ({ ...prev, selectedSpecialTeam }));
  };

  const updateSelectedGolfCourse = (selectedGolfCourseId: string) => {
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (selectedGolfCourseId) {
      params.set("golf_course", selectedGolfCourseId);
    } else {
      params.delete("golf_course");
    }
    // 페이지를 1로 리셋
    params.delete("page");

    router.push(`?${params.toString()}`);
    setFilters((prev) => ({ ...prev, selectedGolfCourseId }));
  };

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

  const handlePageChange = (page: number) => {
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
    setCurrentPage(page);
  };

  return {
    // 데이터
    filteredCaddies: caddies, // API에서 이미 필터링된 데이터
    currentData: caddies,
    realDataCount: caddies.length,
    totalCount,

    // 상태
    isLoading,
    error,

    // 필터 상태
    filters,
    updateSelectedGroup,
    updateSelectedSpecialTeam,
    updateSelectedGolfCourse,

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

    // 데이터 새로고침
    refreshData: loadCaddies,
  };
};
