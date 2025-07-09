import React from "react";
import { Column } from "@/shared/types/table";
import { FieldTableRow } from "../types";
import { FIELD_CONSTANTS, STATUS_COLORS } from "../constants";

/**
 * 기본 셀 렌더러 (빈 행 체크 포함)
 */
const renderBasicCell = (
  value: unknown,
  record: FieldTableRow
): React.ReactNode => {
  if (record.isEmpty) return null;
  return String(value || "");
};

/**
 * 상태 셀 렌더러 (색상 포함)
 */
const renderStatusCell = (
  value: unknown,
  record: FieldTableRow
): React.ReactNode => {
  if (record.isEmpty) return null;

  const status = String(value || "");
  const colorClass =
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "text-gray-600";

  return <span className={colorClass}>{status}</span>;
};

export const fieldColumns: Column<FieldTableRow>[] = [
  {
    key: "no",
    title: "No.",
    width: FIELD_CONSTANTS.COLUMN_WIDTHS.NO,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "fieldName",
    title: "필드명",
    flex: true,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "golfCourse",
    title: "골프장",
    flex: true,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "capacity",
    title: "가용인원수",
    width: FIELD_CONSTANTS.COLUMN_WIDTHS.CAPACITY,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "cart",
    title: "카트",
    width: FIELD_CONSTANTS.COLUMN_WIDTHS.CART,
    align: "center",
    render: renderBasicCell,
  },
  {
    key: "status",
    title: "운영현황",
    width: FIELD_CONSTANTS.COLUMN_WIDTHS.STATUS,
    align: "center",
    render: renderStatusCell,
  },
];
