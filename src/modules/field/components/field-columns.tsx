"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { FieldTableRow } from "../types";

// 필드 테이블 컬럼 정의 (메모이제이션)
export const useFieldColumns = (): Column<FieldTableRow>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 80,
        render: basicRenderers.index, // 🎉 중복 제거!
      },
      {
        key: "fieldName",
        title: "필드명",
        width: 200,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "golfCourse",
        title: "골프장",
        width: 200,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "capacity",
        title: "가용인원수",
        width: 120,
        render: basicRenderers.number, // 🎉 숫자 포맷팅!
      },
      {
        key: "cart",
        title: "카트",
        width: 120,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "status",
        title: "운영현황",
        width: 120,
        render: basicRenderers.status, // 🎉 상태 배지!
      },
    ],
    []
  );
};
