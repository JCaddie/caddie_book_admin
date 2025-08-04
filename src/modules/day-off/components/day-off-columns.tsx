"use client";

import { useMemo } from "react";
import { basicRenderers } from "@/shared/components/ui";
import { Column } from "@/shared/types/table";
import { DayOffRequest } from "../types";

// 사유 텍스트 말줄임표 렌더러
const reasonRenderer = (value: unknown) => (
  <div className="truncate" title={String(value)}>
    {String(value)}
  </div>
);

// 휴무 관리 테이블 컬럼 정의
export const useDayOffColumns = (): Column<DayOffRequest>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 60,
        render: basicRenderers.index,
      },
      {
        key: "display_status",
        title: "신청구분",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "caddie_name",
        title: "이름",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "request_reason",
        title: "사유",
        width: 280,
        render: reasonRenderer,
      },
      {
        key: "date",
        title: "휴무 신청일",
        width: 140,
        render: basicRenderers.dateOnly,
      },
      {
        key: "process_result",
        title: "처리결과",
        width: 100,
        render: (value: unknown) => {
          const result = String(value);
          const getStatusColor = (status: string) => {
            switch (status) {
              case "APPROVED":
                return "text-green-600";
              case "REJECTED":
                return "text-red-600";
              case "PENDING":
                return "text-yellow-600";
              default:
                return "text-gray-600";
            }
          };
          return (
            <span className={`font-medium ${getStatusColor(result)}`}>
              {result === "APPROVED"
                ? "승인"
                : result === "REJECTED"
                ? "반려"
                : result === "PENDING"
                ? "대기"
                : result}
            </span>
          );
        },
      },
      {
        key: "process_notes",
        title: "처리내용",
        width: 200,
        render: reasonRenderer,
      },
      {
        key: "processed_by_name",
        title: "처리자",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "created_at",
        title: "신청 날짜",
        width: 160,
        render: basicRenderers.date,
      },
      {
        key: "processed_at",
        title: "처리 날짜",
        width: 160,
        render: basicRenderers.date,
      },
    ],
    []
  );
};
