/**
 * 공지사항 모듈 에러 핸들링 유틸리티
 */

import { API_ERROR_CODES, CRUD_ERROR_MESSAGES } from "../constants";

// 에러 타입 정의
export interface AnnouncementError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
  timestamp: string;
}

// 에러 코드 타입
export type ErrorCode =
  | "FETCH_FAILED"
  | "FETCH_DETAIL_FAILED"
  | "CREATE_FAILED"
  | "UPDATE_FAILED"
  | "DELETE_FAILED"
  | "PUBLISH_FAILED"
  | "UNPUBLISH_FAILED"
  | "PIN_FAILED"
  | "UNPIN_FAILED"
  | "DUPLICATE_FAILED"
  | "SEARCH_FAILED"
  | "STATS_FAILED"
  | "FILE_UPLOAD_FAILED"
  | "FILE_DELETE_FAILED"
  | "VALIDATION_FAILED"
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNKNOWN_ERROR";

// 에러 심각도 레벨
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// 확장된 에러 정보
export interface ExtendedError extends AnnouncementError {
  severity: ErrorSeverity;
  action?: string;
  category: "api" | "validation" | "network" | "user" | "system";
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
}

/**
 * 에러 코드와 메시지 매핑
 */
const ERROR_CODE_MAP: Record<ErrorCode, string> = {
  FETCH_FAILED: CRUD_ERROR_MESSAGES.FETCH_FAILED,
  FETCH_DETAIL_FAILED: CRUD_ERROR_MESSAGES.FETCH_DETAIL_FAILED,
  CREATE_FAILED: CRUD_ERROR_MESSAGES.CREATE_FAILED,
  UPDATE_FAILED: CRUD_ERROR_MESSAGES.UPDATE_FAILED,
  DELETE_FAILED: CRUD_ERROR_MESSAGES.DELETE_FAILED,
  PUBLISH_FAILED: CRUD_ERROR_MESSAGES.PUBLISH_FAILED,
  UNPUBLISH_FAILED: CRUD_ERROR_MESSAGES.UNPUBLISH_FAILED,
  PIN_FAILED: CRUD_ERROR_MESSAGES.PIN_FAILED,
  UNPIN_FAILED: CRUD_ERROR_MESSAGES.UNPIN_FAILED,
  DUPLICATE_FAILED: CRUD_ERROR_MESSAGES.DUPLICATE_FAILED,
  SEARCH_FAILED: CRUD_ERROR_MESSAGES.SEARCH_FAILED,
  STATS_FAILED: CRUD_ERROR_MESSAGES.STATS_FAILED,
  FILE_UPLOAD_FAILED: CRUD_ERROR_MESSAGES.FILE_UPLOAD_FAILED,
  FILE_DELETE_FAILED: CRUD_ERROR_MESSAGES.FILE_DELETE_FAILED,
  VALIDATION_FAILED: "입력값 검증에 실패했습니다.",
  NETWORK_ERROR: CRUD_ERROR_MESSAGES.NETWORK_ERROR,
  TIMEOUT_ERROR: CRUD_ERROR_MESSAGES.TIMEOUT_ERROR,
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 공지사항을 찾을 수 없습니다.",
  CONFLICT: "이미 처리된 요청입니다.",
  UNKNOWN_ERROR: CRUD_ERROR_MESSAGES.UNKNOWN_ERROR,
};

/**
 * 에러 심각도 매핑
 */
const ERROR_SEVERITY_MAP: Record<ErrorCode, ErrorSeverity> = {
  FETCH_FAILED: "medium",
  FETCH_DETAIL_FAILED: "medium",
  CREATE_FAILED: "high",
  UPDATE_FAILED: "high",
  DELETE_FAILED: "high",
  PUBLISH_FAILED: "high",
  UNPUBLISH_FAILED: "medium",
  PIN_FAILED: "low",
  UNPIN_FAILED: "low",
  DUPLICATE_FAILED: "medium",
  SEARCH_FAILED: "low",
  STATS_FAILED: "low",
  FILE_UPLOAD_FAILED: "medium",
  FILE_DELETE_FAILED: "medium",
  VALIDATION_FAILED: "medium",
  NETWORK_ERROR: "high",
  TIMEOUT_ERROR: "high",
  UNAUTHORIZED: "critical",
  FORBIDDEN: "critical",
  NOT_FOUND: "medium",
  CONFLICT: "medium",
  UNKNOWN_ERROR: "critical",
};

/**
 * 에러 카테고리 매핑
 */
const ERROR_CATEGORY_MAP: Record<ErrorCode, ExtendedError["category"]> = {
  FETCH_FAILED: "api",
  FETCH_DETAIL_FAILED: "api",
  CREATE_FAILED: "api",
  UPDATE_FAILED: "api",
  DELETE_FAILED: "api",
  PUBLISH_FAILED: "api",
  UNPUBLISH_FAILED: "api",
  PIN_FAILED: "api",
  UNPIN_FAILED: "api",
  DUPLICATE_FAILED: "api",
  SEARCH_FAILED: "api",
  STATS_FAILED: "api",
  FILE_UPLOAD_FAILED: "api",
  FILE_DELETE_FAILED: "api",
  VALIDATION_FAILED: "validation",
  NETWORK_ERROR: "network",
  TIMEOUT_ERROR: "network",
  UNAUTHORIZED: "user",
  FORBIDDEN: "user",
  NOT_FOUND: "api",
  CONFLICT: "api",
  UNKNOWN_ERROR: "system",
};

/**
 * 재시도 가능한 에러 목록
 */
const RETRYABLE_ERRORS: ErrorCode[] = [
  "FETCH_FAILED",
  "FETCH_DETAIL_FAILED",
  "NETWORK_ERROR",
  "TIMEOUT_ERROR",
  "UNKNOWN_ERROR",
];

/**
 * 공지사항 에러 생성
 */
export function createAnnouncementError(
  code: ErrorCode,
  details?: string,
  statusCode?: number
): ExtendedError {
  const baseMessage = ERROR_CODE_MAP[code] || ERROR_CODE_MAP.UNKNOWN_ERROR;
  const severity = ERROR_SEVERITY_MAP[code] || "medium";
  const category = ERROR_CATEGORY_MAP[code] || "system";
  const retryable = RETRYABLE_ERRORS.includes(code);

  return {
    code,
    message: baseMessage,
    details,
    statusCode,
    timestamp: new Date().toISOString(),
    severity,
    category,
    retryable,
    userMessage: baseMessage,
    technicalMessage: details || baseMessage,
  };
}

/**
 * HTTP 상태 코드로부터 에러 코드 추출
 */
export function getErrorCodeFromStatus(statusCode: number): ErrorCode {
  switch (statusCode) {
    case API_ERROR_CODES.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case API_ERROR_CODES.FORBIDDEN:
      return "FORBIDDEN";
    case API_ERROR_CODES.NOT_FOUND:
      return "NOT_FOUND";
    case API_ERROR_CODES.CONFLICT:
      return "CONFLICT";
    case API_ERROR_CODES.VALIDATION_ERROR:
      return "VALIDATION_FAILED";
    case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
      return "UNKNOWN_ERROR";
    case API_ERROR_CODES.SERVICE_UNAVAILABLE:
      return "NETWORK_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
}

/**
 * 일반적인 에러 객체를 공지사항 에러로 변환
 */
export function parseError(
  error: unknown,
  defaultCode: ErrorCode = "UNKNOWN_ERROR"
): ExtendedError {
  if (error instanceof Error) {
    // Fetch API 에러
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return createAnnouncementError("NETWORK_ERROR", error.message);
    }

    // 타임아웃 에러
    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return createAnnouncementError("TIMEOUT_ERROR", error.message);
    }

    // 일반 에러
    return createAnnouncementError(defaultCode, error.message);
  }

  // HTTP 응답 에러
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    if (typeof errorObj.status === "number") {
      const code = getErrorCodeFromStatus(errorObj.status);
      const message =
        typeof errorObj.message === "string" ? errorObj.message : undefined;
      return createAnnouncementError(code, message, errorObj.status);
    }

    if (
      typeof errorObj.code === "string" &&
      Object.keys(ERROR_CODE_MAP).includes(errorObj.code)
    ) {
      const message =
        typeof errorObj.message === "string" ? errorObj.message : undefined;
      return createAnnouncementError(errorObj.code as ErrorCode, message);
    }
  }

  // 문자열 에러
  if (typeof error === "string") {
    return createAnnouncementError(defaultCode, error);
  }

  // 알 수 없는 에러
  return createAnnouncementError(
    defaultCode,
    "알 수 없는 오류가 발생했습니다."
  );
}

/**
 * 에러 로깅 (개발 환경에서만)
 */
export function logError(error: ExtendedError, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.group(`🚨 Announcement Error ${context ? `[${context}]` : ""}`);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Severity:", error.severity);
    console.error("Category:", error.category);
    console.error("Retryable:", error.retryable);
    if (error.details) {
      console.error("Details:", error.details);
    }
    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }
    console.error("Timestamp:", error.timestamp);
    console.groupEnd();
  }
}

/**
 * 에러 재시도 가능 여부 확인
 */
export function isRetryableError(error: ExtendedError): boolean {
  return error.retryable;
}

/**
 * 에러 심각도 확인
 */
export function isHighSeverityError(error: ExtendedError): boolean {
  return error.severity === "high" || error.severity === "critical";
}

/**
 * 사용자에게 표시할 에러 메시지 가져오기
 */
export function getUserErrorMessage(error: ExtendedError): string {
  return error.userMessage;
}

/**
 * 에러 통계를 위한 에러 정보 추출
 */
export function getErrorStats(error: ExtendedError): {
  code: string;
  severity: ErrorSeverity;
  category: string;
  retryable: boolean;
  timestamp: string;
} {
  return {
    code: error.code,
    severity: error.severity,
    category: error.category,
    retryable: error.retryable,
    timestamp: error.timestamp,
  };
}
