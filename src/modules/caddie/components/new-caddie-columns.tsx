"use client";

import { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { NewCaddieApplication } from "../types";

// 신규 캐디 테이블 컬럼 정의 (메모이제이션)
export const useNewCaddieColumns = (): Column<NewCaddieApplication>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 80,
        render: basicRenderers.index, // 🎉 중복 제거!
      },
      {
        key: "name",
        title: "이름",
        width: 120,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "phone",
        title: "연락처",
        width: 140,
        render: basicRenderers.phone, // 🎉 전화번호 포맷팅!
      },
      {
        key: "email",
        title: "이메일",
        width: 200,
        render: basicRenderers.email, // 🎉 이메일 스타일링!
      },
      {
        key: "requestDate",
        title: "요청일자",
        width: 140,
        render: basicRenderers.date, // 🎉 날짜 포맷팅!
      },
      {
        key: "status",
        title: "상태",
        width: 100,
        render: basicRenderers.status, // 🎉 상태 배지!
      },
    ],
    []
  );
};
