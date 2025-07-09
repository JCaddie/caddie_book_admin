import React from "react";
import { Column } from "@/shared/types/table";
import { FieldTableRow } from "../types";

export const fieldColumns: Column<FieldTableRow>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;
      return String(value || "");
    },
  },
  {
    key: "fieldName",
    title: "필드명",
    flex: true,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;
      return String(value || "");
    },
  },
  {
    key: "golfCourse",
    title: "골프장",
    flex: true,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;
      return String(value || "");
    },
  },
  {
    key: "capacity",
    title: "가용인원수",
    width: 120,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;
      return String(value || "");
    },
  },
  {
    key: "cart",
    title: "카트",
    width: 120,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;
      return String(value || "");
    },
  },
  {
    key: "status",
    title: "운영현황",
    width: 120,
    align: "center",
    render: (value: unknown, record: FieldTableRow) => {
      if (record.isEmpty) return null;

      const status = String(value || "");
      const colorClass =
        status === "운영중" ? "text-green-600" : "text-red-600";

      return <span className={colorClass}>{status}</span>;
    },
  },
];
