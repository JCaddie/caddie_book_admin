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

// 테이블 컬럼 정의
export const userColumns: Column<User>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: basicRenderers.index, // 🎉 중복 제거!
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center",
    render: basicRenderers.text, // 🎉 중복 제거!
  },
  {
    key: "phone",
    title: "연락처",
    width: 160,
    align: "center",
    render: basicRenderers.phone, // 🎉 전화번호 포맷팅까지!
  },
  {
    key: "email",
    title: "이메일",
    width: 280,
    align: "center",
    render: basicRenderers.email, // 🎉 이메일 스타일링까지!
  },
  {
    key: "golf_course_name",
    title: "골프장",
    width: 200,
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
    width: 120,
    align: "center",
    render: renderRole, // 커스텀 라벨 매핑
  },
];
