"use client";

import React from "react";
import { Button, SearchWithButton } from "@/shared/components/ui";
import { NEW_CADDIE_CONSTANTS } from "../constants";

interface NewCaddieActionBarProps {
  pendingCount: number;
  selectedCount: number;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
}

const NewCaddieActionBar: React.FC<NewCaddieActionBarProps> = ({
  pendingCount,
  selectedCount,
  onApproveSelected,
  onRejectSelected,
}) => {
  return (
    <div className="flex justify-between items-center">
      {/* 왼쪽: 승인 대기 개수 */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">{pendingCount}명</span>의
          캐디가 승인을 기다리고 있습니다.
        </div>
        {selectedCount > 0 && (
          <div className="text-sm text-gray-500">{selectedCount}명 선택됨</div>
        )}
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
          {/* 승인 버튼 */}
          <Button
            onClick={onApproveSelected}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={selectedCount === 0}
          >
            {NEW_CADDIE_CONSTANTS.BULK_APPROVE_BUTTON_TEXT}
          </Button>

          {/* 거절 버튼 */}
          <Button
            onClick={onRejectSelected}
            variant="secondary"
            className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            disabled={selectedCount === 0}
          >
            {NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCaddieActionBar;
