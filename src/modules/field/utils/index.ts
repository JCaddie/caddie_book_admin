import { FieldTableRow } from "../types";

/**
 * 샘플 필드 데이터 생성 (API 구조와 동일)
 */
export const generateSampleFieldData = (): FieldTableRow[] => {
  return [
    {
      id: "1",
      name: "샘플 필드 1",
      golf_course: "샘플 골프장",
      is_active: true,
      hole_count: 18,
    },
    {
      id: "2",
      name: "샘플 필드 2",
      golf_course: "샘플 골프장",
      is_active: false,
      hole_count: 9,
    },
  ];
};

/**
 * 필드 검색 필터링 (name, golf_course 기준)
 */
export const filterFields = (
  fields: FieldTableRow[],
  searchTerm: string
): FieldTableRow[] => {
  if (!searchTerm.trim()) return fields;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return fields.filter(
    (field) =>
      (typeof field.name === "string" &&
        field.name.toLowerCase().includes(lowerSearchTerm)) ||
      (typeof field.golf_course === "string" &&
        field.golf_course.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 빈 행 템플릿 생성
 */
export const createEmptyRowTemplate = (): Omit<
  FieldTableRow,
  "id" | "isEmpty"
> => ({
  no: 0,
  fieldName: "",
  golfCourse: "",
  capacity: 0,
  cart: "",
  status: "",
  description: "",
});

/**
 * 새 필드 데이터 생성 (API 구조와 동일)
 */
export const createNewField = (existingFieldsCount: number): FieldTableRow => ({
  id: String(Date.now()),
  name: `새 필드 ${existingFieldsCount + 1}`,
  golf_course: "샘플 골프장",
  is_active: true,
  hole_count: 18,
});

/**
 * 지연 시뮬레이션 (API 호출 시뮬레이션용)
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
