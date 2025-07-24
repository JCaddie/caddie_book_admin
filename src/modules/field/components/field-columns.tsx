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
        key: "name",
        title: "필드명",
        width: 200,
        render: basicRenderers.text,
      },
      {
        key: "golf_course_name",
        title: "골프장",
        width: 200,
        render: basicRenderers.text,
      },
      {
        key: "hole_count",
        title: "홀 수",
        width: 120,
        render: basicRenderers.number,
      },
      {
        key: "is_active",
        title: "활성여부",
        width: 120,
        render: (value) => ((value as boolean) ? "활성" : "비활성"),
      },
    ],
    []
  );
};
