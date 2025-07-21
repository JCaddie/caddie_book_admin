import {
  ApiCartData,
  ApiCartDetailResponse,
  ApiCartHistoryItem,
  ApiCartStatus,
  Cart,
  CartDetail,
  CartFilters,
  CartHistoryItem,
  CartStatus,
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

// ===================== API 매핑 함수들 =====================

/**
 * API 카트 상태를 UI 카트 상태로 변환
 */
export const mapApiStatusToCartStatus = (
  apiStatus: ApiCartStatus
): CartStatus => {
  switch (apiStatus) {
    case "available":
      return "대기";
    case "in_use":
      return "사용중";
    case "maintenance":
      return "점검중";
    default:
      return "대기";
  }
};

/**
 * UI 카트 상태를 API 카트 상태로 변환
 */
export const mapCartStatusToApiStatus = (
  cartStatus: CartStatus
): ApiCartStatus => {
  switch (cartStatus) {
    case "대기":
      return "available";
    case "사용중":
      return "in_use";
    case "점검중":
    case "고장":
    case "사용불가":
      return "maintenance";
    default:
      return "available";
  }
};

/**
 * API 카트 데이터를 UI Cart 타입으로 변환
 */
export const mapApiCartToCart = (
  apiCart: ApiCartData,
  index: number = 0
): Cart => {
  return {
    id: apiCart.id,
    no: index + 1, // 순서 번호는 별도로 처리
    name: apiCart.name,
    status: mapApiStatusToCartStatus(apiCart.status),
    fieldName: "일반", // API에 필드 정보가 없으므로 기본값
    golfCourseName: apiCart.golf_course.name,
    managerName: apiCart.assigned_caddie?.name || "미배정",
    createdAt: apiCart.created_at || new Date().toISOString(),
    updatedAt: apiCart.updated_at || new Date().toISOString(),
  };
};

/**
 * API 카트 배열을 UI Cart 배열로 변환
 */
export const mapApiCartsToCartList = (apiCarts: ApiCartData[]): Cart[] => {
  return apiCarts.map((apiCart, index) => mapApiCartToCart(apiCart, index));
};

/**
 * API 카트 상세 응답을 UI CartDetail 타입으로 변환
 */
export const mapApiCartDetailToCartDetail = (
  apiCartDetail: ApiCartDetailResponse
): CartDetail => {
  return {
    id: apiCartDetail.id,
    name: apiCartDetail.name,
    status: mapApiStatusToCartStatus(apiCartDetail.status),
    fieldName: apiCartDetail.location || "일반", // location을 필드명으로 사용
    managerName: apiCartDetail.manager?.name || "미배정",
    managerId: apiCartDetail.manager?.id,
    golfCourseName: apiCartDetail.golf_course.name,
    golfCourseId: apiCartDetail.golf_course.id,
    createdAt: apiCartDetail.created_at,
    updatedAt: apiCartDetail.updated_at,
    batteryLevel: apiCartDetail.battery_level,
    batteryStatus: apiCartDetail.battery_status,
  };
};

/**
 * API 카트 이력 아이템을 UI CartHistoryItem으로 변환
 */
export const mapApiCartHistoryToCartHistory = (
  apiHistory: ApiCartHistoryItem,
  index: number = 0
): CartHistoryItem => {
  // 날짜 포맷 변환 (2025-01-21 -> 2025.01.21.(화))
  const date = new Date(apiHistory.usage_date);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedDate = `${apiHistory.usage_date.replace(/-/g, ".")}.(${
    weekdays[date.getDay()]
  })`;

  return {
    id: apiHistory.id,
    no: index + 1,
    date: formattedDate,
    time: apiHistory.start_time.slice(0, 5), // HH:MM 형태로 변환
    cartName: "카트", // API에 카트명이 별도로 없으므로 기본값
    group: apiHistory.is_ongoing ? "진행중" : "완료",
    personInCharge: apiHistory.caddie?.name || "셀프",
    fieldName: "일반", // API에 필드명이 없으므로 기본값
    managerName: apiHistory.caddie?.name || "없음",
    // 추가 정보는 Record<string, unknown>에 저장
    duration: apiHistory.duration,
    endTime: apiHistory.end_time,
    isOngoing: apiHistory.is_ongoing,
    notes: apiHistory.notes,
  } as CartHistoryItem;
};

/**
 * API 카트 이력 배열을 UI CartHistoryItem 배열로 변환
 */
export const mapApiCartHistoriesToCartHistories = (
  apiHistories: ApiCartHistoryItem[]
): CartHistoryItem[] => {
  return apiHistories.map((apiHistory, index) =>
    mapApiCartHistoryToCartHistory(apiHistory, index)
  );
};

/**
 * UI Cart를 API 생성 요청 데이터로 변환
 */
export const mapCartToApiCreateRequest = (
  cart: Omit<Cart, "id" | "no" | "createdAt" | "updatedAt">
): {
  name: string;
  golf_course_id: string;
  assigned_caddie_id?: string;
} => {
  return {
    name: cart.name as string,
    golf_course_id: "1", // 실제로는 golfCourseName에서 ID를 매핑해야 함
    assigned_caddie_id: undefined, // 실제로는 managerName에서 ID를 매핑해야 함
  };
};

// ===================== 기존 샘플 데이터 함수들 =====================

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
