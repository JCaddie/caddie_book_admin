import { TableItem } from "@/shared/hooks";

export interface FieldData {
  id: string;
  no: number;
  fieldName: string;
  golfCourse: string;
  availablePersonnel: number;
  carts: number;
  operationStatus: "operating" | "maintenance";
}

export interface FieldTableRow extends TableItem {
  no: number;
  fieldName: string;
  golfCourse: string;
  capacity: number;
  cart: string;
  status: string;
  isEmpty?: boolean;
}

export interface FieldFilters {
  searchTerm: string;
}

export interface FieldSelection {
  selectedRowKeys: string[];
  selectedRows: FieldTableRow[];
}
