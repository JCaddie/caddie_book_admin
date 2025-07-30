"use client";

import React from "react";
import { Button } from "@/shared/components/ui";
import { NEW_CADDIE_CONSTANTS } from "../../constants";

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
    <div className="flex items-center justify-between">
      {/* 왼쪽: 승인 대기 메시지 */}
      <div className="text-base font-bold text-gray-900">
        <span className="text-blue-600">{pendingCount}명</span>의 캐디가 승인을
        기다리고 있습니다.
      </div>

      {/* 오른쪽: 액션 버튼들 */}
      <div className="flex items-center gap-4">
        {/* 거절 버튼 */}
        <Button
          variant="secondary"
          size="md"
          onClick={onRejectSelected}
          disabled={selectedCount === 0}
          className="w-24"
        >
          {NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
        </Button>

        {/* 승인 버튼 */}
        <Button
          variant="primary"
          size="md"
          onClick={onApproveSelected}
          disabled={selectedCount === 0}
          className="w-24"
        >
          {NEW_CADDIE_CONSTANTS.BULK_APPROVE_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

export default NewCaddieActionBar;
