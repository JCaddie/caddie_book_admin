import type { SelectOption } from "../types";

// ================================
// 캐디 기본 상수
// ================================

// 성별 선택지
export const GENDER_CHOICES: SelectOption[] = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
];

// 고용형태 선택지
export const EMPLOYMENT_TYPE_CHOICES: SelectOption[] = [
  { value: "FULL_TIME", label: "정규직" },
  { value: "PART_TIME", label: "시간제" },
  { value: "CONTRACT", label: "계약직" },
  { value: "TEMPORARY", label: "임시직" },
];

// 팀장 여부 선택지
export const TEAM_LEADER_CHOICES: SelectOption[] = [
  { value: "true", label: "팀장" },
  { value: "false", label: "일반" },
];

// ================================
// 캐디 페이지 상수
// ================================

export const CADDIE_CONSTANTS = {
  SEARCH_PLACEHOLDER: "캐디 검색",
  EMPTY_STATE_MESSAGE: "등록된 캐디가 없습니다",
  DELETE_BUTTON_TEXT: "삭제",
  CANCEL_BUTTON_TEXT: "취소",
  DELETE_MODAL_TITLE: "캐디를 삭제하시겠습니까?",
  DELETE_MODAL_MESSAGE: "이 작업은 되돌릴 수 없습니다",
} as const;

// ================================
// 캐디 편집 상수
// ================================

export const CADDIE_EDIT_CONSTANTS = {
  SAVE_BUTTON_TEXT: "저장",
  CANCEL_BUTTON_TEXT: "취소",
  SAVE_SUCCESS_MESSAGE: "캐디 정보가 성공적으로 저장되었습니다",
  SAVE_ERROR_MESSAGE: "캐디 정보 저장에 실패했습니다",
} as const;
