import { FieldTableRow } from "../types";
import { FIELD_CONSTANTS } from "../constants";

/**
 * 샘플 필드 데이터 생성
 */
export const generateSampleFieldData = (): FieldTableRow[] => {
  const sampleData: FieldTableRow[] = [];
  const {
    SAMPLE_DATA_COUNT,
    GOLF_COURSES,
    CAPACITY_RANGE,
    CART_RANGE,
    STATUS,
    MAINTENANCE_CYCLE,
  } = FIELD_CONSTANTS;

  for (let i = 1; i <= SAMPLE_DATA_COUNT; i++) {
    const golfCourseIndex = Math.floor((i - 1) / 5);
    const golfCourse =
      GOLF_COURSES[golfCourseIndex] || GOLF_COURSES[GOLF_COURSES.length - 1];

    sampleData.push({
      id: `field-${i}`,
      no: i,
      fieldName: `${i}번 필드`,
      golfCourse,
      capacity:
        Math.floor(
          Math.random() * (CAPACITY_RANGE.MAX - CAPACITY_RANGE.MIN + 1)
        ) + CAPACITY_RANGE.MIN,
      cart: `${
        Math.floor(Math.random() * (CART_RANGE.MAX - CART_RANGE.MIN + 1)) +
        CART_RANGE.MIN
      }대`,
      status:
        i % MAINTENANCE_CYCLE === 0 ? STATUS.MAINTENANCE : STATUS.OPERATING,
      description: `샘플 상세설명 ${i}`,
    });
  }

  return sampleData;
};

/**
 * 필드 검색 필터링
 */
export const filterFields = (
  fields: FieldTableRow[],
  searchTerm: string
): FieldTableRow[] => {
  if (!searchTerm.trim()) return fields;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return fields.filter(
    (field) =>
      field.fieldName.toLowerCase().includes(lowerSearchTerm) ||
      field.golfCourse.toLowerCase().includes(lowerSearchTerm)
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
 * 새 필드 데이터 생성
 */
export const createNewField = (existingFieldsCount: number): FieldTableRow => ({
  id: `field-${Date.now()}`,
  no: existingFieldsCount + 1,
  fieldName: `${existingFieldsCount + 1}번 필드`,
  golfCourse: "새 골프장",
  capacity: 20,
  cart: "4대",
  status: FIELD_CONSTANTS.STATUS.OPERATING,
  description: "",
});

/**
 * 지연 시뮬레이션 (API 호출 시뮬레이션용)
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
