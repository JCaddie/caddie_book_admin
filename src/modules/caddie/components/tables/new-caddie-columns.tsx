"use client";

import React, { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import type { NewCaddieApplication } from "../../types";

// 신규 캐디 테이블 컬럼 정의 (메모이제이션)
export const useNewCaddieColumns = (): Column<NewCaddieApplication>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: 80,
        render: (
          value: unknown,
          record: NewCaddieApplication,
          index: number
        ) => {
          return (index + 1).toString();
        },
      },
      {
        key: "name",
        title: "이름",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "phone",
        title: "연락처",
        width: 140,
        render: basicRenderers.phone,
      },
      {
        key: "email",
        title: "이메일",
        width: 200,
        render: basicRenderers.email,
      },
      {
        key: "golf_course",
        title: "골프장",
        width: 150,
        render: (value: unknown, record: NewCaddieApplication) => {
          if (!record.golf_course) return "-";
          return record.golf_course.name;
        },
      },
      {
        key: "created_at",
        title: "신청일자",
        width: 140,
        render: (value: unknown) => {
          if (!value || typeof value !== "string") return "-";
          // API에서 받은 날짜를 포맷팅
          const date = new Date(value);
          return date
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\./g, ".")
            .replace(/\s/g, "");
        },
      },
      {
        key: "registration_status",
        title: "승인상태",
        width: 100,
        render: (value: unknown, record: NewCaddieApplication) => {
          // registration_status 값을 기반으로 표시값 결정
          let displayValue = "대기";

          if (record.registration_status === "PENDING") {
            displayValue = "승인 대기";
          } else if (record.registration_status === "APPROVED") {
            displayValue = "승인";
          } else if (record.registration_status === "REJECTED") {
            displayValue = "거절";
          }

          // 상태에 따른 배지 스타일링 (고정 크기)
          let badgeClass =
            "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[60px] ";

          if (record.registration_status === "PENDING") {
            badgeClass += "bg-yellow-100 text-yellow-800";
          } else if (record.registration_status === "APPROVED") {
            badgeClass += "bg-green-100 text-green-800";
          } else if (record.registration_status === "REJECTED") {
            badgeClass += "bg-red-100 text-red-800";
          } else {
            badgeClass += "bg-gray-100 text-gray-800";
          }

          return React.createElement(
            "span",
            { className: badgeClass },
            displayValue
          );
        },
      },
    ],
    []
  );
};
