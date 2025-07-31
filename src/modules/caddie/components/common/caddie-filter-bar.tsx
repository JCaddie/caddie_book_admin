"use client";

import React from "react";
import { Button, Dropdown, SearchWithButton } from "@/shared/components/ui";
import { useAuth, useGolfCourseSimpleOptions } from "@/shared/hooks";
import {
  DEFAULT_GROUP_OPTIONS,
  DEFAULT_SPECIAL_TEAM_OPTIONS,
} from "../../constants/caddie";
import { CaddieFilters } from "../../types";

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
  const { options: golfCourseOptions, isLoading: isGolfCourseLoading } =
    useGolfCourseSimpleOptions();

  const isAdmin = user?.role === "ADMIN";
  const canViewAllGolfCourses =
    user?.role === "MASTER" || user?.role === "ADMIN";

  // TODO: API에서 동적으로 로드해야 할 옵션들
  // 현재는 기본값 사용, 추후 커스텀 훅으로 대체 예정
  const groupOptions = DEFAULT_GROUP_OPTIONS;
  const specialTeamOptions = DEFAULT_SPECIAL_TEAM_OPTIONS;

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
            {/* MASTER, ADMIN 권한일 때는 골프장 선택 드롭다운 표시 */}
            {canViewAllGolfCourses && (
              <Dropdown
                options={golfCourseOptions}
                value={filters.selectedGolfCourseId}
                onChange={onGolfCourseChange}
                placeholder="골프장 선택"
                disabled={isGolfCourseLoading}
              />
            )}

            {/* ADMIN 권한일 때만 그룹/특수반 드롭다운 표시 */}
            {isAdmin && (
              <>
                <Dropdown
                  options={groupOptions as { value: string; label: string }[]}
                  value={filters.selectedGroup}
                  onChange={onGroupChange}
                  placeholder="그룹"
                />

                <Dropdown
                  options={
                    specialTeamOptions as { value: string; label: string }[]
                  }
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
