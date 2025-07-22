"use client";

import React from "react";
import { Button, SearchWithButton } from "@/shared/components/ui";
import { NEW_CADDIE_CONSTANTS } from "@/modules/caddie/constants";

interface NewCaddieActionBarProps {
  pendingCount: number;
  selectedCount: number;
  onRejectSelected: () => void;
  onApproveSelected: () => void;
}

const NewCaddieActionBar: React.FC<NewCaddieActionBarProps> = ({
  pendingCount,
  selectedCount,
  onRejectSelected,
  onApproveSelected,
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 총 건수 */}
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-black">
          총 {pendingCount}건
        </span>
      </div>

      {/* 오른쪽: 검색 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* 검색 */}
        <div className="w-[460px]">
          <SearchWithButton
            placeholder={NEW_CADDIE_CONSTANTS.SEARCH_PLACEHOLDER}
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
          <Button
            onClick={onApproveSelected}
            disabled={selectedCount === 0}
            className="w-24"
          >
            {NEW_CADDIE_CONSTANTS.BULK_APPROVE_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCaddieActionBar;
