import { VacationRequest, VacationRequestType, VacationStatus } from "../types";
import { Column } from "@/shared/types/table";

// ================================
// 기본 상수
// ================================

export const VACATION_CONSTANTS = {
  PAGE_SIZE: 20,
  MAX_REASON_LENGTH: 500,
  PHONE_PATTERN: /^\d{3}-\d{4}-\d{4}$/,
} as const;

// ================================
// 선택 옵션
// ================================

export const VACATION_REQUEST_TYPES: VacationRequestType[] = ["휴무", "대기"];

export const VACATION_STATUSES: VacationStatus[] = ["검토 중", "승인", "반려"];

export const VACATION_REQUEST_TYPE_OPTIONS = [
  { value: "", label: "신청구분" },
  { value: "휴무", label: "휴무" },
  { value: "대기", label: "대기" },
];

export const VACATION_STATUS_OPTIONS = [
  { value: "", label: "상태" },
  { value: "검토 중", label: "검토 중" },
  { value: "승인", label: "승인" },
  { value: "반려", label: "반려" },
];

// ================================
// UI 텍스트
// ================================

export const VACATION_UI_TEXT = {
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
// 테이블 컬럼 정의
// ================================

// 번호 셀 렌더러
const renderNumberCell = (value: unknown, record: VacationRequest) => {
  if (record.isEmpty) return null;
  return String(value || "-");
};

// 기본 셀 렌더러
const renderCell = (value: unknown, record: VacationRequest) => {
  if (record.isEmpty) return null;
  return String(value || "-");
};

// 상태 셀 렌더러
const renderStatusCell = (value: unknown, record: VacationRequest) => {
  if (record.isEmpty) return null;
  return String(value || "-");
};

export const VACATION_TABLE_COLUMNS: Column<VacationRequest>[] = [
  {
    key: "no",
    title: "No.",
    width: 60,
    align: "center",
    render: renderNumberCell,
  },
  {
    key: "requestType",
    title: "신청구분",
    width: 120,
    align: "center",
    render: renderCell,
  },
  {
    key: "caddieName",
    title: "이름",
    width: 160,
    align: "center",
    render: renderCell,
  },
  {
    key: "reason",
    title: "사유",
    width: 360,
    align: "left",
    render: renderCell,
  },
  {
    key: "phone",
    title: "연락처",
    width: 140,
    align: "center",
    render: renderCell,
  },
  {
    key: "status",
    title: "상태",
    width: 100,
    align: "center",
    render: renderStatusCell,
  },
  {
    key: "approver",
    title: "승인자",
    width: 120,
    align: "center",
    render: renderCell,
  },
  {
    key: "requestDate",
    title: "요청일자",
    width: 140,
    align: "center",
    render: renderCell,
  },
];

// ================================
// 에러 메시지
// ================================

export const VACATION_ERROR_MESSAGES = {
  FETCH_FAILED: "휴무 신청 목록을 불러오는데 실패했습니다.",
  APPROVE_FAILED: "승인 처리에 실패했습니다.",
  REJECT_FAILED: "반려 처리에 실패했습니다.",
  DELETE_FAILED: "삭제에 실패했습니다.",
  VALIDATION_FAILED: "입력값을 확인해주세요.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
} as const;
