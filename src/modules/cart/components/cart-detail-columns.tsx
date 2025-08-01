"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { CartHistoryItem } from "../types";
import { CART_COLUMN_WIDTHS } from "../constants";

// 카트 히스토리 테이블 컬럼 정의 (메모이제이션)
export const useCartHistoryColumns = (): Column<CartHistoryItem>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: CART_COLUMN_WIDTHS.no,
        render: basicRenderers.index,
      },
      {
        key: "caddieName",
        title: "캐디명",
        width: 120,
        render: basicRenderers.text,
      },

      {
        key: "usageDate",
        title: "사용일자",
        width: 100,
        render: basicRenderers.dateOnly,
      },
      {
        key: "startTime",
        title: "시작시간",
        width: 80,
        render: (value: unknown) => String(value).slice(0, 5), // HH:MM 형태로 표시
      },
      {
        key: "endTime",
        title: "종료시간",
        width: 80,
        render: (value: unknown) => String(value).slice(0, 5), // HH:MM 형태로 표시
      },
      {
        key: "duration",
        title: "사용시간",
        width: 80,
        render: (value: unknown) => `${value}분`,
      },
      {
        key: "isOngoing",
        title: "진행상태",
        width: 80,
        render: (value: unknown) => (value ? "진행중" : "완료"),
      },
      {
        key: "notes",
        title: "비고",
        width: 150,
        render: basicRenderers.textLeft,
      },
    ],
    []
  );
};
