import { DayOffRequestType, DayOffStatus } from "../types";

// ================================
// 기본 상수
// ================================

export const DAY_OFF_CONSTANTS = {
  PAGE_SIZE: 20,
  MAX_REASON_LENGTH: 500,
  PHONE_PATTERN: /^\d{3}-\d{4}-\d{4}$/,
} as const;

// ================================
// 선택 옵션
// ================================

export const DAY_OFF_REQUEST_TYPES: DayOffRequestType[] = [
  "day_off",
  "waiting",
];

export const DAY_OFF_STATUSES: DayOffStatus[] = [
  "reviewing",
  "approved",
  "rejected",
];

export const DAY_OFF_REQUEST_TYPE_OPTIONS = [
  { value: "", label: "신청구분" },
  { value: "day_off", label: "휴무" },
  { value: "waiting", label: "대기" },
];

export const DAY_OFF_STATUS_OPTIONS = [
  { value: "", label: "상태" },
  { value: "reviewing", label: "검토 중" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "반려" },
];

// ================================
// UI 텍스트
// ================================

export const DAY_OFF_UI_TEXT = {
  SEARCH_PLACEHOLDER: "캐디 검색",
  REQUEST_COUNT_LABEL: "요청",
  EMPTY_MESSAGE: "휴무 신청 내역이 없습니다.",
  LOADING_MESSAGE: "데이터를 불러오는 중...",
  ERROR_MESSAGE: "데이터를 불러오는 중 오류가 발생했습니다.",

  // 버튼 텍스트
  APPROVE_BUTTON: "승인",
  REJECT_BUTTON: "반려",
  CANCEL_BUTTON: "취소",
  DELETE_BUTTON: "삭제",

  // 상태 메시지
  APPROVE_SUCCESS: "승인 처리되었습니다.",
  REJECT_SUCCESS: "반려 처리되었습니다.",
  DELETE_SUCCESS: "삭제되었습니다.",

  // 확인 메시지
  APPROVE_CONFIRM: "승인하시겠습니까?",
  REJECT_CONFIRM: "반려하시겠습니까?",
  DELETE_CONFIRM: "삭제하시겠습니까?",
} as const;

// ================================
// 에러 메시지
// ================================

export const DAY_OFF_ERROR_MESSAGES = {
  FETCH_FAILED: "휴무 신청 목록을 불러오는데 실패했습니다.",
  APPROVE_FAILED: "승인 처리에 실패했습니다.",
  REJECT_FAILED: "반려 처리에 실패했습니다.",
  DELETE_FAILED: "삭제에 실패했습니다.",
  VALIDATION_FAILED: "입력값을 확인해주세요.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
} as const;
