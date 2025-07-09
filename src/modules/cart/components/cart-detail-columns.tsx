"use client";

import { Column } from "@/shared/types";
import { CartHistoryItem } from "../types";

/**
 * 카트 이력 테이블 컬럼 정의
 * Figma 디자인에 맞춘 고정 폭 컬럼들
 */
export const cartHistoryColumns: Column<CartHistoryItem>[] = [
  {
    key: "no",
    title: "No.",
    width: 48,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as number}</span>;
    },
  },
  {
    key: "date",
    title: "일자",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "time",
    title: "시간",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "cartName",
    title: "카트명",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "group",
    title: "그룹",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "personInCharge",
    title: "담당자",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "fieldName",
    title: "필드명",
    width: 160,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "managerName",
    title: "관리자",
    width: 120,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-sm text-gray-800">{value as string}</span>;
    },
  },
];
