"use client";

import React from "react";
import { Button } from "@/shared/components/ui";
import { VacationActionsProps } from "../types";
import { VACATION_UI_TEXT } from "../constants";

const VacationActionsCell: React.FC<VacationActionsProps> = ({
  request,
  onApprove,
  onReject,
  loading = false,
}) => {
  // 빈 행인 경우 렌더링하지 않음
  if (request.isEmpty) {
    return null;
  }

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove(request.id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReject(request.id);
  };

  return (
    <div className="flex gap-2 justify-center">
      {request.status === "검토 중" && (
        <Button
          variant="primary"
          size="sm"
          onClick={handleApprove}
          disabled={loading}
          className="px-4 py-2 text-sm"
          aria-label={`${request.caddieName} 휴무 신청 승인`}
        >
          {VACATION_UI_TEXT.APPROVE_BUTTON}
        </Button>
      )}
      {request.status === "승인" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={loading}
          className="px-4 py-2 text-sm border-primary text-primary"
          aria-label={`${request.caddieName} 휴무 신청 취소`}
        >
          {VACATION_UI_TEXT.CANCEL_BUTTON}
        </Button>
      )}
      {request.status === "반려" && (
        <span className="text-sm text-gray-500">처리완료</span>
      )}
    </div>
  );
};

export default VacationActionsCell;
