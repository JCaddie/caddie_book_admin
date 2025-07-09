export interface FieldData {
  id: string;
  no: number;
  fieldName: string;
  golfCourse: string;
  availablePersonnel: number;
  carts: number;
  operationStatus: "operating" | "maintenance";
}

export interface FieldTableRow extends Record<string, unknown> {
  id: string;
  no: number;
  fieldName: string;
  golfCourse: string;
  availablePersonnel: number;
  carts: number;
  operationStatus: string;
  selected?: boolean;
}
