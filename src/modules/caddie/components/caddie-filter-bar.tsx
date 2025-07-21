"use client";

import React from "react";
import { Button, Dropdown, SearchWithButton } from "@/shared/components/ui";
import { CaddieFilters } from "@/shared/types/caddie";
import { GROUP_OPTIONS, SPECIAL_TEAM_OPTIONS } from "@/shared/constants/caddie";
import { GOLF_COURSE_DROPDOWN_OPTIONS } from "@/shared/constants/golf-course";
import { useAuth } from "@/shared/hooks/use-auth";

interface CaddieFilterBarProps {
  totalCount: number;
  selectedCount: number;
  filters: CaddieFilters;
  onGroupChange: (value: string) => void;
  onSpecialTeamChange: (value: string) => void;
  onGolfCourseChange: (value: string) => void;
  onDeleteSelected: () => void;
}

const CaddieFilterBar: React.FC<CaddieFilterBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onGroupChange,
  onSpecialTeamChange,
  onGolfCourseChange,
  onDeleteSelected,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const canViewAllGolfCourses = user?.role === "MASTER" || user?.role === "DEV";
  return (
    <div className="space-y-4">
      {/* 기존 필터 영역 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-black">
            총 {totalCount}건
          </span>
        </div>

        {/* 오른쪽: 필터 컨트롤들 + 검색창 + 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 필터 컨트롤들 */}
          <div className="flex items-center gap-8">
            {/* MASTER, DEV 권한일 때는 골프장 선택 드롭다운 표시 */}
            {canViewAllGolfCourses && (
              <Dropdown
                options={GOLF_COURSE_DROPDOWN_OPTIONS}
                value={filters.selectedGolfCourseId}
                onChange={onGolfCourseChange}
                placeholder="골프장 선택"
              />
            )}

            {/* ADMIN 권한일 때만 그룹/특수반 드롭다운 표시 */}
            {isAdmin && (
              <>
                <Dropdown
                  options={GROUP_OPTIONS}
                  value={filters.selectedGroup}
                  onChange={onGroupChange}
                  placeholder="그룹"
                />

                <Dropdown
                  options={SPECIAL_TEAM_OPTIONS}
                  value={filters.selectedSpecialTeam}
                  onChange={onSpecialTeamChange}
                  placeholder="특수반"
                />
              </>
            )}

            <SearchWithButton placeholder="캐디명 검색" />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2">
            {/* 삭제 버튼 */}
            <Button
              variant="secondary"
              size="md"
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              className="w-24"
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaddieFilterBar;
