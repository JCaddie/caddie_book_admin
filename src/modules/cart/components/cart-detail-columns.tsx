"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { CartDetail } from "../types";
import { CART_COLUMN_WIDTHS } from "../constants";

// 카트 상세 테이블 컬럼 정의 (메모이제이션)
export const useCartDetailColumns = (): Column<CartDetail>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: CART_COLUMN_WIDTHS.no,
        render: basicRenderers.index as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
      {
        key: "caddieName",
        title: "캐디명",
        width: CART_COLUMN_WIDTHS.name,
        render: basicRenderers.text as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
      {
        key: "usageDate",
        title: "사용일자",
        width: CART_COLUMN_WIDTHS.golfCourseName,
        render:
          basicRenderers.dateOnly as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
      {
        key: "startTime",
        title: "시작시간",
        width: CART_COLUMN_WIDTHS.fieldName,
        render: basicRenderers.text as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
      {
        key: "endTime",
        title: "종료시간",
        width: CART_COLUMN_WIDTHS.fieldName,
        render: basicRenderers.text as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
      {
        key: "notes",
        title: "비고",
        width: CART_COLUMN_WIDTHS.golfCourseName,
        render:
          basicRenderers.textLeft as unknown as Column<CartDetail>["render"], // 안전한 타입 캐스팅
      },
    ],
    []
  );
};
