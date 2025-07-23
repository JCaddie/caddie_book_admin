"use client";

import { useMemo } from "react";
import { basicRenderers } from "@/shared/components/ui";
import { Column } from "@/shared/types/table";
import { VacationRequest } from "../types";

// 휴가 관리 테이블 컬럼 정의
export const useVacationColumns = (): Column<VacationRequest>[] => {
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
        width: 360,
        render: basicRenderers.textLeft,
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
        key: "approved_by_name",
        title: "승인자",
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
    ],
    []
  );
};
