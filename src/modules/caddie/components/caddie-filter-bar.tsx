"use client";

import React from "react";
import { Button, Dropdown, SearchWithButton } from "@/shared/components/ui";
import { CaddieFilters } from "@/shared/types/caddie";
import { GROUP_OPTIONS, SPECIAL_TEAM_OPTIONS } from "@/shared/constants/caddie";
import { useAuth } from "@/shared/hooks/use-auth";

interface CaddieFilterBarProps {
  totalCount: number;
  selectedCount: number;
  filters: CaddieFilters;
  onGroupChange: (value: string) => void;
  onSpecialTeamChange: (value: string) => void;
  onDeleteSelected: () => void;
}

const CaddieFilterBar: React.FC<CaddieFilterBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onGroupChange,
  onSpecialTeamChange,
  onDeleteSelected,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
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
            {/* ADMIN 권한일 때만 드롭다운 표시 */}
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
