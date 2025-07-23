"use client";

import React from "react";
import { Button, SearchWithButton, URLDropdown } from "@/shared/components/ui";
import { VacationRequestFilter } from "../types";
import {
  VACATION_REQUEST_TYPE_OPTIONS,
  VACATION_STATUS_OPTIONS,
  VACATION_UI_TEXT,
} from "../constants";

export interface VacationActionBarProps {
  totalCount: number;
  selectedCount?: number;
  filters: VacationRequestFilter;
  onDelete?: () => void;
  loading?: boolean;
}

const VacationActionBar: React.FC<VacationActionBarProps> = ({
  totalCount,
  selectedCount = 0,
  filters,
  onDelete,
  loading = false,
}) => {
  const handleDeleteClick = () => {
    if (onDelete && selectedCount > 0 && !loading) {
      onDelete();
    }
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
          <URLDropdown
            options={VACATION_REQUEST_TYPE_OPTIONS}
            value={filters.request_type || ""}
            paramName="request_type"
            className="w-[106px]"
            ariaLabel="신청구분 필터"
          />
          <URLDropdown
            options={VACATION_STATUS_OPTIONS}
            value={filters.status || ""}
            paramName="status"
            className="w-[106px]"
            ariaLabel="상태 필터"
          />
        </div>

        {/* 검색 필드 */}
        <SearchWithButton placeholder={VACATION_UI_TEXT.SEARCH_PLACEHOLDER} />

        {/* 버튼 그룹 */}
        {onDelete && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDeleteClick}
              disabled={selectedCount === 0 || loading}
              className="w-24"
              aria-label={`선택된 ${selectedCount}개 항목 삭제`}
            >
              {VACATION_UI_TEXT.DELETE_BUTTON}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationActionBar;
