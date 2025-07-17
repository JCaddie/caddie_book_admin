import { Field, FieldTableRow } from "../types";

/**
 * 샘플 필드 데이터 생성 (API 구조와 동일)
 */
export const generateSampleFieldData = (): FieldTableRow[] => {
  return [
    {
      id: "1",
      name: "샘플 필드 1",
      golf_course_name: "샘플 골프장",
      is_active: true,
      hole_count: 18,
    },
    {
      id: "2",
      name: "샘플 필드 2",
      golf_course_name: "샘플 골프장",
      is_active: false,
      hole_count: 9,
    },
  ];
};

/**
 * 필드 검색 필터링 (name, golf_course_name 기준)
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
      (typeof field.golf_course_name === "string" &&
        field.golf_course_name.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 빈 행 템플릿 생성
 */
export const createEmptyRowTemplate = (): Omit<
  FieldTableRow,
  "id" | "isEmpty"
> => ({
  name: "",
  golf_course_name: "",
  is_active: false,
  hole_count: 0,
});

/**
 * 새 필드 데이터 생성 (API 구조와 동일)
 */
export const createNewField = (existingFieldsCount: number): FieldTableRow => ({
  id: String(Date.now()),
  name: `새 필드 ${existingFieldsCount + 1}`,
  golf_course_name: "샘플 골프장",
  is_active: true,
  hole_count: 18,
});

/**
 * 지연 시뮬레이션 (API 호출 시뮬레이션용)
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * API 응답(Field[]) → 테이블 row(FieldTableRow[]) 변환
 */
export function transformFieldsToTableRows(
  fields: Field[],
  page = 1,
  pageSize = 20
): FieldTableRow[] {
  return fields.map((item, idx) => ({
    id: String(item.id),
    name: item.name,
    golf_course_name: item.golf_course_name,
    is_active: item.is_active,
    hole_count: item.hole_count,
    no: (page - 1) * pageSize + idx + 1,
  }));
}
