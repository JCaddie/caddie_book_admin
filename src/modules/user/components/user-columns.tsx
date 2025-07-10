import React from "react";
import { Column } from "@/shared/types/table";
import { UserRole } from "@/shared/types/user";
import { User } from "../types";
import { ROLE_LABELS } from "../constants";

/**
 * 기본 셀 렌더러 (빈 행 체크 포함)
 */
const renderBasicCell = (value: unknown, record: User): React.ReactNode => {
  if (record.isEmpty) return null;
  return <div>{String(value || "")}</div>;
};

/**
 * 번호 셀 렌더러 (빈 행 체크 포함)
 */
const renderNumberCell = (value: unknown, record: User): React.ReactNode => {
  if (record.isEmpty) return null;
  return <div>{record.no}</div>;
};

/**
 * 권한 셀 렌더러 (빈 행 체크 포함)
 */
const renderRoleCell = (value: unknown, record: User): React.ReactNode => {
  if (record.isEmpty) return null;
  const role = value as UserRole;
  return <div>{ROLE_LABELS[role] || String(role)}</div>;
};

// 테이블 컬럼 정의
export const userColumns: Column<User>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: renderNumberCell,
  },
  {
    key: "username",
    title: "아이디",
    width: 160,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "phone",
    title: "연락처",
    width: 160,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "email",
    title: "이메일",
    width: 320,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "role",
    title: "권한",
    width: 160,
    align: "center",
    render: renderRoleCell,
  },
];
