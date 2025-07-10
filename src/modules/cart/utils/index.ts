import {
  Cart,
  CartStatus,
  CartFilters,
  CartDetail,
  CartHistoryItem,
} from "../types";
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

// 그룹명 배열
const GROUP_NAMES = ["1조", "2조", "3조", "4조", "5조"];

// 담당자명 배열 (이력용)
const PERSON_IN_CHARGE_NAMES = [
  "강감찬",
  "이순신",
  "김유신",
  "을지문덕",
  "연개소문",
];

// 시간 배열
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

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
  isEmpty: true,
});

/**
 * 카트 상세 정보 생성
 */
export const generateCartDetail = (cartId: string): CartDetail => {
  return {
    id: cartId,
    name: "카트1",
    status: "사용중",
    fieldName: "한울(서남)",
    managerName: "홍길동",
    golfCourseName: "제이캐디아카데미",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
  };
};

/**
 * 카트 사용 이력 데이터 생성
 */
export const generateCartHistory = (count: number = 50): CartHistoryItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `history-${index + 1}`,
    no: index + 1,
    date: "2025.05.26.(월)",
    time: getCyclicItem(TIME_SLOTS, index),
    cartName: `카트${(index % 3) + 1}`,
    group: getCyclicItem(GROUP_NAMES, index),
    personInCharge: getCyclicItem(PERSON_IN_CHARGE_NAMES, index),
    fieldName: getCyclicItem(FIELD_NAMES, index),
    managerName: getCyclicItem(MANAGER_NAMES, index),
  }));
};

/**
 * 빈 카트 이력 행 템플릿 생성
 */
export const createEmptyCartHistoryTemplate = (): Omit<
  CartHistoryItem,
  "id"
> => ({
  no: 0,
  date: "",
  time: "",
  cartName: "",
  group: "",
  personInCharge: "",
  fieldName: "",
  managerName: "",
  isEmpty: true,
});
