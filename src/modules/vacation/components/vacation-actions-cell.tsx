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
        render: basicRenderers.index, // 🎉 중복 제거!
      },
      {
        key: "requestType",
        title: "신청구분",
        width: 100,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "caddieName",
        title: "이름",
        width: 120,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "reason",
        title: "사유",
        width: 360,
        render: basicRenderers.textLeft, // 🎉 좌측 정렬!
      },
      {
        key: "phone",
        title: "연락처",
        width: 140,
        render: basicRenderers.phone, // 🎉 전화번호 포맷팅!
      },
      {
        key: "status",
        title: "상태",
        width: 100,
        render: basicRenderers.text, // 🎉 일반 텍스트로 변경!
      },
      {
        key: "approver",
        title: "승인자",
        width: 120,
        render: basicRenderers.text, // 🎉 중복 제거!
      },
      {
        key: "requestDate",
        title: "요청일자",
        width: 200,
        render: basicRenderers.date, // 🎉 날짜 포맷팅!
      },
    ],
    []
  );
};
