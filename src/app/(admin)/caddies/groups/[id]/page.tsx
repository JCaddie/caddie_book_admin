"use client";

import React from "react";
import {
  Button,
  CaddieAssignmentModal,
  GroupSettingModal,
  Search,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import {
  GROUP_OPTIONS,
  SPECIAL_TEAM_OPTIONS,
  STATUS_OPTIONS,
} from "@/modules/caddie/constants";
import { GroupSection } from "@/modules/caddie/components";
import { useGroupManagement } from "@/modules/caddie/hooks";
import { GroupFilterOption } from "@/modules/caddie/types";

interface GroupManagementPageProps {
  params: Promise<{
    id: string;
  }>;
}

const GroupManagementPage: React.FC<GroupManagementPageProps> = ({
  params,
}) => {
  const { id } = React.use(params);

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse ? "내 골프장 그룹현황" : `그룹현황`;
  useDocumentTitle({ title: pageTitle });

  // 그룹 관리 훅 사용
  const {
    filters,
    filteredGroups,
    totalCaddieCount,
    isGroupSettingModalOpen,
    isCaddieAssignmentModalOpen,
    draggedCaddie,
    updateFilter,
    handleSearchChange,
    handleSearchClear,
    openGroupSettingModal,
    closeGroupSettingModal,
    handleGroupSettingConfirm,
    openCaddieAssignmentModal,
    closeCaddieAssignmentModal,
    handleCaddieAssignmentConfirm,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  } = useGroupManagement();

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title={pageTitle} />

      {/* 액션바 - Figma 디자인 기반 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 캐디 수 */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-black">
            총 {totalCaddieCount}명
          </span>
        </div>

        {/* 오른쪽: 필터들 + 검색 + 버튼들 */}
        <div className="flex items-center gap-6">
          {/* 필터들 */}
          <div className="flex items-center gap-2">
            {/* 그룹 드롭다운 */}
            <select
              value={filters.selectedGroup}
              onChange={(e) => updateFilter("selectedGroup", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-28"
            >
              {GROUP_OPTIONS.map((option: GroupFilterOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 특수반 드롭다운 */}
            <select
              value={filters.selectedSpecialTeam}
              onChange={(e) =>
                updateFilter("selectedSpecialTeam", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-28"
            >
              {SPECIAL_TEAM_OPTIONS.map((option: GroupFilterOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 상태 드롭다운 */}
            <select
              value={filters.selectedStatus}
              onChange={(e) => updateFilter("selectedStatus", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-28"
            >
              {STATUS_OPTIONS.map((option: GroupFilterOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 검색창 */}
            <div className="w-[400px]">
              <Search
                placeholder="캐디 검색"
                value={filters.searchTerm}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
              />
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={openGroupSettingModal}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
            >
              그룹 설정
            </Button>
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-white flex items-center gap-1"
              onClick={openCaddieAssignmentModal}
            >
              <Plus className="w-4 h-4" />
              캐디 배정
            </Button>
          </div>
        </div>
      </div>

      {/* 그룹들 - 가로 스크롤 */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ width: "fit-content" }}>
          {filteredGroups.map((group) => (
            <GroupSection
              key={group.id}
              group={group}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedCaddie={draggedCaddie}
            />
          ))}
        </div>
      </div>

      {/* 그룹 설정 모달 */}
      <GroupSettingModal
        isOpen={isGroupSettingModalOpen}
        onClose={closeGroupSettingModal}
        onSave={handleGroupSettingConfirm}
        initialGroups={[
          { id: "1", name: "1조", order: 1 },
          { id: "2", name: "2조", order: 2 },
          { id: "3", name: "3조", order: 3 },
          { id: "4", name: "4조", order: 4 },
          { id: "5", name: "5조", order: 5 },
          { id: "6", name: "6조", order: 6 },
          { id: "7", name: "7조", order: 7 },
        ]}
      />

      {/* 캐디 배정 모달 */}
      <CaddieAssignmentModal
        isOpen={isCaddieAssignmentModalOpen}
        onClose={closeCaddieAssignmentModal}
        onConfirm={handleCaddieAssignmentConfirm}
      />
    </div>
  );
};

export default GroupManagementPage;
