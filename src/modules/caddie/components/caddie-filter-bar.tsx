"use client";

import React from "react";
import {
  Button,
  Dropdown,
  GolfCourseSelector,
  SearchWithButton,
} from "@/shared/components/ui";
import { CaddieFilters } from "@/shared/types/caddie";
import { GROUP_OPTIONS, SPECIAL_TEAM_OPTIONS } from "@/shared/constants/caddie";
import { useAuth } from "@/shared/hooks/use-auth";

interface CaddieFilterBarProps {
  totalCount: number;
  selectedCount: number;
  filters: CaddieFilters;
  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onSpecialTeamChange: (value: string) => void;
  onDeleteSelected: () => void;
  // 골프장 필터링 props (MASTER 권한에서만 사용)
  selectedGolfCourseId?: string;
  golfCourseSearchTerm?: string;
  onGolfCourseChange?: (golfCourseId: string) => void;
  onGolfCourseSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CaddieFilterBar: React.FC<CaddieFilterBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onSearchChange,
  onGroupChange,
  onSpecialTeamChange,
  onDeleteSelected,
  selectedGolfCourseId = "",
  golfCourseSearchTerm = "",
  onGolfCourseChange,
  onGolfCourseSearchChange,
}) => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* MASTER 권한일 때만 골프장 선택 영역 표시 */}
      {isMaster && onGolfCourseChange && onGolfCourseSearchChange && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-black">골프장 선택</span>
          </div>
          <GolfCourseSelector
            selectedGolfCourseId={selectedGolfCourseId}
            searchTerm={golfCourseSearchTerm}
            onGolfCourseChange={onGolfCourseChange}
            onSearchChange={onGolfCourseSearchChange}
          />
        </div>
      )}

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

            <SearchWithButton
              placeholder="캐디명 검색"
              containerClassName="w-[420px]"
              searchClassName="w-[360px]"
            />
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
