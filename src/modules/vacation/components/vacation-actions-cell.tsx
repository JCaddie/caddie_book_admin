"use client";

import { useMemo } from "react";
import { basicRenderers } from "@/shared/components/ui";
import { Column } from "@/shared/types/table";
import { VacationRequest } from "../types";
import { useAuth } from "@/shared/hooks";

// 휴가 관리 테이블 컬럼 정의
export const useVacationColumns = (): Column<VacationRequest>[] => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 60,
        render: basicRenderers.index,
      },
      {
        key: "requestType",
        title: "신청구분",
        width: 100,
        render: basicRenderers.text,
      },
      {
        key: "caddieName",
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
      // MASTER 권한일 때는 소속골프장, ADMIN 권한일 때는 연락처
      isMaster
        ? {
            key: "golfCourse",
            title: "소속골프장",
            width: 140,
            render: basicRenderers.text,
          }
        : {
            key: "phone",
            title: "연락처",
            width: 140,
            render: basicRenderers.phone,
          },
      {
        key: "status",
        title: "상태",
        width: 100,
        render: basicRenderers.text,
      },
      {
        key: "approver",
        title: "승인자",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "requestDate",
        title: "요청일자",
        width: 200,
        render: basicRenderers.date,
      },
    ],
    [isMaster]
  );
};
