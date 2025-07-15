"use client";

import { useMemo, useState } from "react";
import { usePagination } from "@/shared/hooks";
import {
  CaddieGroup,
  GroupStatusFilters,
  GroupStatusSelection,
} from "../types";

// 모크 데이터 (실제 구현에서는 API로 대체)
const MOCK_GROUP_DATA: CaddieGroup[] = [
  {
    id: "1",
    no: 1,
    groupName: "1조",
    leaderName: "김철수",
    memberCount: 12,
    activeCount: 10,
    inactiveCount: 2,
    golfCourse: "송도골프클럽",
    members: ["김철수", "이영희", "박민수", "최수정", "정태영", "이미영"],
  },
  {
    id: "2",
    no: 2,
    groupName: "2조",
    leaderName: "이영희",
    memberCount: 10,
    activeCount: 8,
    inactiveCount: 2,
    golfCourse: "송도골프클럽",
    members: ["이영희", "박민수", "최수정", "정태영", "이미영"],
  },
  {
    id: "3",
    no: 3,
    groupName: "3조",
    leaderName: "박민수",
    memberCount: 14,
    activeCount: 12,
    inactiveCount: 2,
    golfCourse: "해운대골프클럽",
    members: ["박민수", "최수정", "정태영", "이미영", "김민지"],
  },
  {
    id: "4",
    no: 4,
    groupName: "4조",
    leaderName: "최수정",
    memberCount: 8,
    activeCount: 7,
    inactiveCount: 1,
    golfCourse: "제주골프클럽",
    members: ["최수정", "정태영", "이미영", "김민지"],
  },
  {
    id: "5",
    no: 5,
    groupName: "5조",
    leaderName: "정태영",
    memberCount: 11,
    activeCount: 9,
    inactiveCount: 2,
    golfCourse: "강남골프클럽",
    members: ["정태영", "이미영", "김민지", "황진우"],
  },
];

// 페이지네이션 상수
const ITEMS_PER_PAGE = 20;

// 기본 필터 값들
const DEFAULT_FILTERS: GroupStatusFilters = {
  searchTerm: "",
  selectedGroup: "전체",
};

export const useGroupStatusManagement = () => {
  // 필터 상태
  const [filters, setFilters] = useState<GroupStatusFilters>(DEFAULT_FILTERS);

  // 선택 상태
  const [selection, setSelection] = useState<GroupStatusSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 필터링된 데이터
  const filteredGroups = useMemo(() => {
    return MOCK_GROUP_DATA.filter((group) => {
      const matchesSearch =
        group.groupName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        group.leaderName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesGroup =
        filters.selectedGroup === "전체" ||
        group.groupName === filters.selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [filters]);

  // 페이지네이션
  const { currentData, currentPage, totalPages, handlePageChange } =
    usePagination({
      data: filteredGroups,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  // 실제 데이터 개수 (빈 행 제외)
  const realDataCount = filteredGroups.length;

  // 필터 업데이트 함수들
  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const updateSelectedGroup = (selectedGroup: string) => {
    setFilters((prev) => ({ ...prev, selectedGroup }));
  };

  // 선택 업데이트 함수
  const updateSelection = (
    selectedRowKeys: string[],
    selectedRows: CaddieGroup[]
  ) => {
    setSelection({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 선택된 항목 삭제
  const deleteSelectedItems = async () => {
    // 실제 구현에서는 API 호출
    console.log("선택된 그룹 삭제:", selection.selectedRowKeys);

    // 선택 상태 초기화
    setSelection({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  // 삭제 가능 여부
  const canDelete = selection.selectedRowKeys.length > 0;

  // 선택된 항목 개수
  const selectedCount = selection.selectedRowKeys.length;

  return {
    // 데이터
    filteredGroups,
    currentData,
    realDataCount,

    // 필터
    filters,
    updateSearchTerm,
    updateSelectedGroup,

    // 선택
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
