"use client";

import React from "react";
import { Button, Dropdown, Search } from "@/shared/components/ui";
import { CaddieFilters } from "@/shared/types/caddie";
import { GROUP_OPTIONS, SPECIAL_TEAM_OPTIONS } from "@/shared/constants/caddie";

interface CaddieFilterBarProps {
  totalCount: number;
  selectedCount: number;
  filters: CaddieFilters;
  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onSpecialTeamChange: (value: string) => void;
  onDeleteSelected: () => void;
}

const CaddieFilterBar: React.FC<CaddieFilterBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onSearchChange,
  onGroupChange,
  onSpecialTeamChange,
  onDeleteSelected,
}) => {
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
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

          <div className="w-[360px]">
            <Search
              value={filters.searchTerm}
              onChange={handleSearchInputChange}
              placeholder="검색어 입력"
            />
          </div>
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
  );
};

export default CaddieFilterBar;
