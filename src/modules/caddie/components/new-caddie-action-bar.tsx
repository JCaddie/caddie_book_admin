"use client";

import React from "react";
import { Search, Button, Badge } from "@/shared/components/ui";
import { NEW_CADDIE_CONSTANTS } from "@/modules/caddie/constants";

interface NewCaddieActionBarProps {
  pendingCount: number;
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
  onRejectSelected: () => void;
  onApproveAll: () => void;
}

const NewCaddieActionBar: React.FC<NewCaddieActionBarProps> = ({
  pendingCount,
  selectedCount,
  searchTerm,
  onSearchChange,
  onSearchClear,
  onRejectSelected,
  onApproveAll,
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 신규 캐디 수 */}
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-black">신규</span>
        <Badge variant="orange">{pendingCount}</Badge>
      </div>

      {/* 오른쪽: 검색 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* 검색 */}
        <div className="w-[400px]">
          <Search
            placeholder={NEW_CADDIE_CONSTANTS.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={onSearchChange}
            onClear={onSearchClear}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRejectSelected}
            disabled={selectedCount === 0}
            className="w-24"
          >
            {NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
          </Button>
          <Button onClick={onApproveAll} className="w-24">
            {NEW_CADDIE_CONSTANTS.BULK_APPROVE_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCaddieActionBar;
