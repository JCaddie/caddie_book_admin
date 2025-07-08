"use client";

import React from "react";
import { Search, Dropdown } from "@/shared/components/ui";
import { CaddieFilters } from "@/shared/types/caddie";
import { GROUP_OPTIONS, SPECIAL_TEAM_OPTIONS } from "@/shared/constants/caddie";
import { Trash2 } from "lucide-react";

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

      {/* 오른쪽: 삭제 버튼 + 필터 컨트롤들 */}
      <div className="flex items-center gap-8">
        {/* 삭제 버튼 */}
        <button
          onClick={onDeleteSelected}
          className={[
            "flex items-center gap-2 text-[13px] font-medium transition-colors",
            selectedCount > 0
              ? "text-black hover:text-red-600 cursor-pointer"
              : "text-black opacity-60 cursor-not-allowed",
          ].join(" ")}
          disabled={selectedCount === 0}
        >
          <Trash2 size={16} />
          삭제
        </button>

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
              placeholder="제이캐디아카데미"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaddieFilterBar;
