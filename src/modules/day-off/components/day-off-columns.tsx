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
        key: "request_type_display",
        title: "신청구분",
        width: 100,
        render: basicRenderers.text,
      },
      {
        key: "caddie_name",
        title: "이름",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "reason",
        title: "사유",
        width: 280,
        render: reasonRenderer,
      },
      {
        key: "golf_course_name",
        title: "골프장",
        width: 200,
        render: basicRenderers.text,
      },
      {
        key: "status_display",
        title: "상태",
        width: 100,
        render: basicRenderers.text,
      },
      {
        key: "processed_by_name",
        title: "처리자",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "date",
        title: "휴무 신청일",
        width: 140,
        render: basicRenderers.dateOnly,
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
