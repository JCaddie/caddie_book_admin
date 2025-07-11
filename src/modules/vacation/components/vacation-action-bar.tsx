"use client";

import React from "react";
import { Button, Search, Dropdown } from "@/shared/components/ui";
import { VacationRequestFilter } from "../types";
import {
  VACATION_REQUEST_TYPE_OPTIONS,
  VACATION_STATUS_OPTIONS,
  VACATION_SEARCH_PLACEHOLDER,
} from "../constants";

export interface VacationActionBarProps {
  totalCount: number;
  selectedCount: number;
  filters: VacationRequestFilter;
  onFilterChange: (filters: VacationRequestFilter) => void;
  onDelete?: () => void;
}

const VacationActionBar: React.FC<VacationActionBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onFilterChange,
  onDelete,
}) => {
  const handleRequestTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      requestType: value as VacationRequestFilter["requestType"],
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value as VacationRequestFilter["status"],
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: event.target.value,
    });
  };

  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 총 건수 */}
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-black">
          총 {totalCount}건
        </span>
        <div className="flex items-center justify-center w-6 h-6 bg-amber-50 rounded-md">
          <span className="text-sm font-bold text-black">{totalCount}</span>
        </div>
      </div>

      {/* 오른쪽: 필터 + 검색창 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* 필터 드롭다운들 */}
        <div className="flex items-center gap-2">
          <Dropdown
            options={VACATION_REQUEST_TYPE_OPTIONS}
            value={filters.requestType || ""}
            onChange={handleRequestTypeChange}
            className="w-[106px]"
          />
          <Dropdown
            options={VACATION_STATUS_OPTIONS}
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-[106px]"
          />
        </div>

        {/* 검색 필드 */}
        <Search
          placeholder={VACATION_SEARCH_PLACEHOLDER}
          containerClassName="w-[360px]"
          onChange={handleSearchChange}
          value={filters.searchTerm || ""}
        />

        {/* 버튼 그룹 */}
        {onDelete && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onDelete}
              disabled={selectedCount === 0}
              className="w-24"
            >
              삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationActionBar;
