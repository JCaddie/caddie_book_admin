"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { Cart } from "../types";
import { CART_COLUMN_WIDTHS } from "../constants";

// 카트 테이블 컬럼 정의 (메모이제이션)
export const useCartColumns = (): Column<Cart>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: CART_COLUMN_WIDTHS.no,
        render: basicRenderers.index, // 🎉 중복 제거!
      },
      {
        key: "name",
        title: "카트명",
        width: CART_COLUMN_WIDTHS.name,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "status",
        title: "상태",
        width: CART_COLUMN_WIDTHS.status,
        render: basicRenderers.text, // 🎉 일반 텍스트로 변경!
      },
      {
        key: "fieldName",
        title: "필드명",
        width: CART_COLUMN_WIDTHS.fieldName,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "golfCourseName",
        title: "골프장",
        width: CART_COLUMN_WIDTHS.golfCourseName,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "managerName",
        title: "담당자",
        width: CART_COLUMN_WIDTHS.managerName,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
    ],
    []
  );
};
