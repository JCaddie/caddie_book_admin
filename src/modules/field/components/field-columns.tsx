import { Column } from "@/shared/types/table";
import { FieldTableRow } from "../types/field";

export const fieldColumns: Column<FieldTableRow>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "fieldName",
    title: "필드명",
    flex: true,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "golfCourse",
    title: "골프장",
    flex: true,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "availablePersonnel",
    title: "가용인원수",
    width: 160,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "carts",
    title: "카트",
    width: 160,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
  {
    key: "operationStatus",
    title: "운영현황",
    width: 160,
    align: "center",
    render: (value: unknown) => (
      <span className="text-sm font-medium text-gray-800">{String(value)}</span>
    ),
  },
];
