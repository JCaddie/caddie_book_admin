/**
 * 공지사항 API 관련 상수
 */

// API 엔드포인트
export const API_ENDPOINTS = {
  ANNOUNCEMENTS: "/api/announcements",
  ANNOUNCEMENT_DETAIL: (id: string) => `/api/announcements/${id}`,
  ANNOUNCEMENT_PUBLISH: (id: string) => `/api/announcements/${id}/publish`,
  ANNOUNCEMENT_UNPUBLISH: (id: string) => `/api/announcements/${id}/unpublish`,
  ANNOUNCEMENT_PIN: (id: string) => `/api/announcements/${id}/pin`,
  ANNOUNCEMENT_UNPIN: (id: string) => `/api/announcements/${id}/unpin`,
  ANNOUNCEMENT_DUPLICATE: (id: string) => `/api/announcements/${id}/duplicate`,
  ANNOUNCEMENT_STATS: "/api/announcements/stats",
  ANNOUNCEMENT_SEARCH: "/api/announcements/search",
  ANNOUNCEMENT_EXPORT: "/api/announcements/export",
  ANNOUNCEMENT_IMPORT: "/api/announcements/import",
  FILE_UPLOAD: "/api/files/upload",
  FILE_DELETE: (id: string) => `/api/files/${id}`,
} as const;

// HTTP 메서드
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// API 타임아웃 설정
export const API_TIMEOUT = {
  DEFAULT: 10000, // 10초
  UPLOAD: 60000, // 60초
  DOWNLOAD: 30000, // 30초
} as const;

// API 에러 코드
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// CRUD 에러 메시지
export const CRUD_ERROR_MESSAGES = {
  FETCH_FAILED: "공지사항을 불러오는 중 오류가 발생했습니다.",
  FETCH_DETAIL_FAILED: "공지사항 상세 정보를 불러오는 중 오류가 발생했습니다.",
  CREATE_FAILED: "공지사항 생성 중 오류가 발생했습니다.",
  UPDATE_FAILED: "공지사항 수정 중 오류가 발생했습니다.",
  DELETE_FAILED: "공지사항 삭제 중 오류가 발생했습니다.",
  PUBLISH_FAILED: "공지사항 게시 중 오류가 발생했습니다.",
  UNPUBLISH_FAILED: "공지사항 게시 중단 중 오류가 발생했습니다.",
  PIN_FAILED: "공지사항 고정 중 오류가 발생했습니다.",
  UNPIN_FAILED: "공지사항 고정 해제 중 오류가 발생했습니다.",
  DUPLICATE_FAILED: "공지사항 복제 중 오류가 발생했습니다.",
  SEARCH_FAILED: "공지사항 검색 중 오류가 발생했습니다.",
  STATS_FAILED: "공지사항 통계 조회 중 오류가 발생했습니다.",
  FILE_UPLOAD_FAILED: "파일 업로드 중 오류가 발생했습니다.",
  FILE_DELETE_FAILED: "파일 삭제 중 오류가 발생했습니다.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// 재시도 설정
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1초
  RETRY_MULTIPLIER: 2,
} as const;

// 캐시 설정
export const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5분
  MAX_SIZE: 100,
  ENABLED: true,
} as const;

// 검색 설정
export const SEARCH_DEFAULTS = {
  LIMIT: 10,
  OFFSET: 0,
  SORT_FIELD: "createdAt",
  SORT_ORDER: "desc",
} as const;

// 배치 처리 설정
export const BATCH_CONFIG = {
  MAX_BATCH_SIZE: 50,
  BATCH_TIMEOUT: 30000, // 30초
} as const;
