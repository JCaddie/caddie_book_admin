export interface Field {
  id: string;
  no: number;
  name: string;
  golfCourse: string;
  availablePersonnel: number;
  carts: number;
  operationStatus: "operating" | "maintenance";
}

export interface FieldListItem {
  id: string;
  no: number;
  name: string;
  golfCourse: string;
  availablePersonnel: number;
  carts: number;
  operationStatus: string;
}

export interface FieldFilters {
  search: string;
}
