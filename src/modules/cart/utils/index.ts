import { Cart, CartStatus, CartFilters } from "../types";
import {
  getCyclicItem,
  getRandomPastDate,
  isMatchingAnyField,
} from "@/shared/lib/data-utils";

// 카트 상태 배열
const CART_STATUSES: CartStatus[] = [
  "사용중",
  "대기",
  "점검중",
  "고장",
  "사용불가",
];

// 필드명 배열
const FIELD_NAMES = [
  "한울(서남)",
  "누리(남서)",
  "청솔(동남)",
  "배롱(북동)",
  "소나무(서북)",
];

// 골프장명 배열
const GOLF_COURSES = ["제이캐디아카데미", "라이딩클럽", "골프존"];

// 담당자명 배열
const MANAGER_NAMES = ["홍길동", "김철수", "박영희", "이영수", "최민수"];

/**
 * 샘플 카트 데이터 생성
 */
export const generateSampleCarts = (count: number = 26): Cart[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `cart-${index + 1}`,
    no: index + 1,
    name: `카트${index + 1}`,
    status: getCyclicItem(CART_STATUSES, index),
    fieldName: getCyclicItem(FIELD_NAMES, index),
    golfCourseName: getCyclicItem(GOLF_COURSES, index),
    managerName: getCyclicItem(MANAGER_NAMES, index),
    createdAt: getRandomPastDate(365),
    updatedAt: getRandomPastDate(30),
  }));
};

/**
 * 카트 필터링
 */
export const filterCarts = (carts: Cart[], filters: CartFilters): Cart[] => {
  return carts.filter((cart) => {
    // 검색어 필터
    const searchFields: (keyof Cart)[] = [
      "name",
      "fieldName",
      "golfCourseName",
      "managerName",
    ];
    const matchesSearch = isMatchingAnyField(
      cart,
      filters.searchTerm,
      searchFields
    );

    // 상태 필터
    const matchesStatus = !filters.status || cart.status === filters.status;

    // 골프장 필터
    const matchesGolfCourse =
      !filters.golfCourseId || cart.golfCourseName === filters.golfCourseId;

    // 필드 필터
    const matchesField = !filters.fieldId || cart.fieldName === filters.fieldId;

    return matchesSearch && matchesStatus && matchesGolfCourse && matchesField;
  });
};

/**
 * 빈 카트 행 템플릿 생성
 */
export const createEmptyCartTemplate = (): Omit<Cart, "id"> => ({
  no: 0,
  name: "",
  status: "대기",
  fieldName: "",
  golfCourseName: "",
  managerName: "",
  createdAt: "",
  updatedAt: "",
});
