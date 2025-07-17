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
        key: "fieldName",
        title: "필드명",
        width: 200,
        render: basicRenderers.text,
      },
      {
        key: "golfCourse",
        title: "골프장",
        width: 200,
        render: basicRenderers.text,
      },
      {
        key: "capacity",
        title: "홀수",
        width: 120,
        render: basicRenderers.number,
      },
      {
        key: "status",
        title: "운영현황",
        width: 120,
        render: basicRenderers.status,
      },
      {
        key: "description",
        title: "상세설명",
        width: 300,
        render: basicRenderers.text,
      },
    ],
    []
  );
};
