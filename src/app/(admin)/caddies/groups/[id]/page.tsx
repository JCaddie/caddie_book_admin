"use client";

import React from "react";
import {
  Button,
  CaddieAssignmentModal,
  SearchWithButton,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus } from "lucide-react";
import {
  EmptyGroupsState,
  GROUP_OPTIONS,
  GroupSection,
  GroupSettingModal,
  SPECIAL_TEAM_OPTIONS,
  STATUS_OPTIONS,
  useGroupManagement,
} from "@/modules/group";
import { GroupFilterOption } from "@/modules/group/types";

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

      {/* 그룹이 없을 때 빈 상태 화면 */}
      {filteredGroups.length === 0 ? (
        <EmptyGroupsState onCreateGroup={openGroupSettingModal} />
      ) : (
        <>
          {/* 필터 및 액션바 */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  총 {totalCaddieCount}명
                </span>
              </div>

              {/* 필터 드롭다운들 */}
              <select
                value={filters.selectedGroup}
                onChange={(e) => updateFilter("selectedGroup", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-24"
              >
                {GROUP_OPTIONS.map((option: GroupFilterOption) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

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
              <SearchWithButton
                placeholder="캐디 검색"
                containerClassName="w-[460px]"
                searchClassName="w-[400px]"
              />
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
        </>
      )}

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
