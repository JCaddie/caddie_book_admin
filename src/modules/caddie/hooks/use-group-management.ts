"use client";

import { useMemo, useState } from "react";
import { CaddieGroupManagement, GroupManagementFilters } from "../types";
import { MOCK_GROUPS_DATA } from "../constants";
import { CaddieData } from "@/modules/work/types";

export function useGroupManagement() {
  // 그룹 데이터 상태 (드래그 앤 드롭을 위해 상태로 관리)
  const [groupsData, setGroupsData] =
    useState<CaddieGroupManagement[]>(MOCK_GROUPS_DATA);

  // 필터 상태
  const [filters, setFilters] = useState<GroupManagementFilters>({
    selectedGroup: "전체",
    selectedSpecialTeam: "전체",
    selectedStatus: "전체",
    searchTerm: "",
  });

  // 모달 상태
  const [isGroupSettingModalOpen, setIsGroupSettingModalOpen] = useState(false);

  // 드래그 상태
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);
  const [draggedFromGroup, setDraggedFromGroup] = useState<string | null>(null);

  // 필터링된 그룹 데이터
  const filteredGroups = useMemo(() => {
    return groupsData.filter((group) => {
      if (
        filters.selectedGroup !== "전체" &&
        group.name !== filters.selectedGroup
      ) {
        return false;
      }
      return true;
    });
  }, [groupsData, filters.selectedGroup]);

  // 전체 캐디 수 계산
  const totalCaddieCount = useMemo(() => {
    return filteredGroups.reduce(
      (total, group) => total + group.memberCount,
      0
    );
  }, [filteredGroups]);

  // 필터 업데이트 함수들
  const updateFilter = (key: keyof GroupManagementFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter("searchTerm", e.target.value);
  };

  const handleSearchClear = () => {
    updateFilter("searchTerm", "");
  };

  // 모달 제어 함수들
  const openGroupSettingModal = () => setIsGroupSettingModalOpen(true);
  const closeGroupSettingModal = () => setIsGroupSettingModalOpen(false);

  const handleGroupSettingConfirm = () => {
    console.log("그룹 설정");
    closeGroupSettingModal();
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = (caddie: CaddieData, groupId: string) => {
    setDraggedCaddie(caddie);
    setDraggedFromGroup(groupId);
  };

  const handleDragEnd = () => {
    setDraggedCaddie(null);
    setDraggedFromGroup(null);
  };

  const handleDrop = (targetGroupId: string, insertIndex?: number) => {
    if (!draggedCaddie || !draggedFromGroup) return;

    // 같은 그룹의 같은 위치로 드롭하는 경우 무시
    if (draggedFromGroup === targetGroupId && insertIndex === undefined) {
      return;
    }

    setGroupsData((prevGroups) => {
      const newGroups = [...prevGroups];

      // 원래 그룹에서 캐디 제거
      const sourceGroupIndex = newGroups.findIndex(
        (g) => g.id === draggedFromGroup
      );
      const targetGroupIndex = newGroups.findIndex(
        (g) => g.id === targetGroupId
      );

      if (sourceGroupIndex === -1 || targetGroupIndex === -1) return prevGroups;

      const sourceCaddies = [...newGroups[sourceGroupIndex].caddies];
      const draggedCaddieIndex = sourceCaddies.findIndex(
        (c) => c.id === draggedCaddie.id
      );

      if (draggedCaddieIndex === -1) return prevGroups;

      // 같은 그룹 내에서의 순서 변경
      if (sourceGroupIndex === targetGroupIndex) {
        if (insertIndex === undefined || insertIndex === draggedCaddieIndex) {
          return prevGroups; // 같은 위치로 드롭하면 변경 없음
        }

        // 같은 그룹 내에서 순서 변경
        const [removedCaddie] = sourceCaddies.splice(draggedCaddieIndex, 1);

        // 제거 후 인덱스 조정
        const adjustedInsertIndex =
          insertIndex > draggedCaddieIndex ? insertIndex - 1 : insertIndex;
        sourceCaddies.splice(adjustedInsertIndex, 0, removedCaddie);

        newGroups[sourceGroupIndex] = {
          ...newGroups[sourceGroupIndex],
          caddies: sourceCaddies,
          memberCount: sourceCaddies.length,
        };
      } else {
        // 다른 그룹으로 이동
        const [removedCaddie] = sourceCaddies.splice(draggedCaddieIndex, 1);
        const targetCaddies = [...newGroups[targetGroupIndex].caddies];

        if (insertIndex !== undefined) {
          targetCaddies.splice(insertIndex, 0, removedCaddie);
        } else {
          targetCaddies.push(removedCaddie);
        }

        // 그룹 데이터 업데이트
        newGroups[sourceGroupIndex] = {
          ...newGroups[sourceGroupIndex],
          caddies: sourceCaddies,
          memberCount: sourceCaddies.length,
        };

        newGroups[targetGroupIndex] = {
          ...newGroups[targetGroupIndex],
          caddies: targetCaddies,
          memberCount: targetCaddies.length,
        };
      }

      return newGroups;
    });

    // 드래그 상태 초기화
    setDraggedCaddie(null);
    setDraggedFromGroup(null);
  };

  return {
    // 상태
    filters,
    filteredGroups,
    totalCaddieCount,
    isGroupSettingModalOpen,
    draggedCaddie,
    draggedFromGroup,

    // 액션
    updateFilter,
    handleSearchChange,
    handleSearchClear,
    openGroupSettingModal,
    closeGroupSettingModal,
    handleGroupSettingConfirm,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
}
