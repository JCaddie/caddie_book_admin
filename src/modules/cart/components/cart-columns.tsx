"use client";

import React from "react";
import { Column } from "@/shared/types/table";
import { Cart, CartStatus } from "../types";
import { CART_COLUMN_WIDTHS, CART_STATUS_STYLES } from "../constants";

// 상태 뱃지 컴포넌트
const StatusBadge: React.FC<{ status: CartStatus }> = ({ status }) => {
  const styleClass = CART_STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${styleClass}`}
    >
      {status}
    </span>
  );
};

// 카트 테이블 컬럼 정의
export const getCartColumns = (): Column<Cart>[] => [
  {
    key: "no",
    title: "No.",
    width: CART_COLUMN_WIDTHS.no,
    render: (value: unknown) => (
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">
          {value as number}
        </span>
      </div>
    ),
  },
  {
    key: "name",
    title: "카트명",
    width: CART_COLUMN_WIDTHS.name,
    render: (value: unknown) => (
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">
          {value as string}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    title: "상태",
    width: CART_COLUMN_WIDTHS.status,
    render: (value: unknown) => (
      <div className="flex justify-center">
        <StatusBadge status={value as CartStatus} />
      </div>
    ),
  },
  {
    key: "fieldName",
    title: "필드명",
    width: CART_COLUMN_WIDTHS.fieldName,
    render: (value: unknown) => (
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">
          {value as string}
        </span>
      </div>
    ),
  },
  {
    key: "golfCourseName",
    title: "골프장",
    width: CART_COLUMN_WIDTHS.golfCourseName,
    render: (value: unknown) => (
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">
          {value as string}
        </span>
      </div>
    ),
  },
  {
    key: "managerName",
    title: "담당자",
    width: CART_COLUMN_WIDTHS.managerName,
    render: (value: unknown) => (
      <div className="text-center">
        <span className="text-sm font-medium text-gray-800">
          {value as string}
        </span>
      </div>
    ),
  },
];
