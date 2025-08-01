import React from "react";
import { Column } from "@/shared/types/table";
import { UserRole } from "@/shared/types/user";
import { basicRenderers, textRenderer } from "@/shared/components/ui";
import { User } from "../types";
import { ROLE_LABELS } from "../constants";

/**
 * 권한 렌더러 (커스텀 라벨 매핑)
 */
const roleRenderer = textRenderer<User>({ align: "center" });

// 커스텀 렌더러로 권한 표시
const renderRole = (value: unknown, record: User): React.ReactNode => {
  if (record.isEmpty) return null;
  const role = value as UserRole;
  const label = ROLE_LABELS[role] || String(role);
  return roleRenderer(label, record);
};

// 활성 상태 렌더러
const renderActiveStatus = (value: unknown, record: User): React.ReactNode => {
  if (record.isEmpty) return null;
  const isActive = value as boolean;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "활성" : "비활성"}
    </span>
  );
};

// 테이블 컬럼 정의
export const userColumns: Column<User>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: basicRenderers.index,
  },
  {
    key: "username",
    title: "아이디",
    width: 140,
    align: "center",
    render: basicRenderers.text,
  },
  {
    key: "name",
    title: "이름",
    width: 120,
    align: "center",
    render: basicRenderers.text,
  },
  {
    key: "phone",
    title: "연락처",
    width: 140,
    align: "center",
    render: basicRenderers.phone,
  },
  {
    key: "email",
    title: "이메일",
    width: 220,
    align: "center",
    render: basicRenderers.email,
  },
  {
    key: "golf_course_name",
    title: "골프장",
    width: 160,
    align: "center",
    render: (value: unknown, record: User): React.ReactNode => {
      if (record.isEmpty) return null;
      const golfCourseName = value as string | null;
      return golfCourseName ? (
        <span className="text-gray-900">{golfCourseName}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    key: "role",
    title: "권한",
    width: 100,
    align: "center",
    render: renderRole,
  },
  {
    key: "is_active",
    title: "상태",
    width: 100,
    align: "center",
    render: renderActiveStatus,
  },
  {
    key: "created_at",
    title: "생성일",
    width: 140,
    align: "center",
    render: (value: unknown, record: User): React.ReactNode => {
      if (record.isEmpty) return null;
      const createdAt = value as string;
      // ISO 날짜 문자열을 사용자 친화적 형태로 변환
      const date = new Date(createdAt);
      const formattedDate = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <div className="text-sm">
          <div className="text-gray-900">{formattedDate}</div>
          <div className="text-gray-500 text-xs">{formattedTime}</div>
        </div>
      );
    },
  },
];
