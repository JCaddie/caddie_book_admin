import { NewCaddieApplication } from "../types/new-caddie";

// 등록 승인 상태 상수
export const REGISTRATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const REGISTRATION_STATUS_CHOICES = [
  { id: REGISTRATION_STATUS.PENDING, value: "승인 대기" },
  { id: REGISTRATION_STATUS.APPROVED, value: "승인됨" },
  { id: REGISTRATION_STATUS.REJECTED, value: "거부됨" },
] as const;

// 신규 캐디 페이지 상수
export const NEW_CADDIE_CONSTANTS = {
  SEARCH_PLACEHOLDER: "캐디 검색",
  EMPTY_STATE_MESSAGE: "신규 캐디 신청이 없습니다",
  APPROVAL_BUTTON_TEXT: "승인",
  REJECT_BUTTON_TEXT: "거절",
  CANCEL_BUTTON_TEXT: "취소",
  BULK_APPROVE_BUTTON_TEXT: "승인", // "모두 승인"에서 "승인"으로 변경
  APPROVAL_MODAL_TITLE: "승인하시겠습니까?",
  REJECT_MODAL_TITLE: "거절하시겠습니까?",
} as const;

// 신규 캐디 신청 모의 데이터 (타입 불일치로 인해 임시 주석 처리)
export const MOCK_NEW_CADDIE_APPLICATIONS: NewCaddieApplication[] = [];
