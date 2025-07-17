"use client";

import React from "react";
import { Button, Dropdown, SearchWithButton } from "@/shared/components/ui";
import { GroupStatusFilters } from "../types";

interface GroupStatusActionBarProps {
  totalCount: number;
  selectedCount: number;
  filters: GroupStatusFilters;
  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onDeleteSelected: () => void;
}

// 그룹 필터 옵션들
const GROUP_FILTER_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "1조", label: "1조" },
  { value: "2조", label: "2조" },
  { value: "3조", label: "3조" },
  { value: "4조", label: "4조" },
  { value: "5조", label: "5조" },
  { value: "6조", label: "6조" },
  { value: "7조", label: "7조" },
  { value: "8조", label: "8조" },
  { value: "9조", label: "9조" },
  { value: "10조", label: "10조" },
];

const GroupStatusActionBar: React.FC<GroupStatusActionBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onSearchChange,
  onGroupChange,
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
          총 {totalCount}개 그룹
        </span>
      </div>

      {/* 오른쪽: 필터 컨트롤들 + 검색창 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* 필터 컨트롤들 */}
        <div className="flex items-center gap-8">
          <Dropdown
            options={GROUP_FILTER_OPTIONS}
            value={filters.selectedGroup}
            onChange={onGroupChange}
            placeholder="그룹"
          />

          <SearchWithButton
            placeholder="그룹명 또는 그룹장 검색"
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
  );
};

export default GroupStatusActionBar;
