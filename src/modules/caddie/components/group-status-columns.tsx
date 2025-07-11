"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { CaddieGroup } from "../types";

// 그룹현황 테이블 컬럼 정의 (메모이제이션)
export const useGroupStatusColumns = (): Column<CaddieGroup>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 80,
        render: basicRenderers.index,
      },
      {
        key: "groupName",
        title: "그룹명",
        width: 120,
        render: basicRenderers.text,
      },

      {
        key: "leaderName",
        title: "그룹장",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "memberCount",
        title: "총원",
        width: 80,
        render: basicRenderers.number,
      },
      {
        key: "activeCount",
        title: "활동인원",
        width: 100,
        render: basicRenderers.number,
      },
      {
        key: "inactiveCount",
        title: "비활동인원",
        width: 110,
        render: basicRenderers.number,
      },

      {
        key: "golfCourse",
        title: "골프장",
        width: 200,
        render: basicRenderers.text,
      },
    ],
    []
  );
};
