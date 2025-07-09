import { CartFilters, CartStatus } from "../types";

// 기본 필터 설정
export const DEFAULT_CART_FILTERS: CartFilters = {
  searchTerm: "",
  status: undefined,
  golfCourseId: undefined,
  fieldId: undefined,
};

// 페이지당 아이템 수
export const CART_ITEMS_PER_PAGE = 20;

// 카트 상태 옵션
export const CART_STATUS_OPTIONS: { value: CartStatus; label: string }[] = [
  { value: "사용중", label: "사용중" },
  { value: "대기", label: "대기" },
  { value: "점검중", label: "점검중" },
  { value: "고장", label: "고장" },
  { value: "사용불가", label: "사용불가" },
];

// 카트 상태별 스타일 클래스
export const CART_STATUS_STYLES: Record<CartStatus, string> = {
  사용중: "bg-green-50 text-green-700 border-green-200",
  대기: "bg-blue-50 text-blue-700 border-blue-200",
  점검중: "bg-yellow-50 text-yellow-700 border-yellow-200",
  고장: "bg-red-50 text-red-700 border-red-200",
  사용불가: "bg-gray-50 text-gray-700 border-gray-200",
};

// 테이블 컬럼 너비 설정 (px 단위)
export const CART_COLUMN_WIDTHS = {
  checkbox: 48,
  no: 80,
  name: 160,
  status: 120,
  fieldName: 160,
  golfCourseName: 200,
  managerName: 120,
} as const;
