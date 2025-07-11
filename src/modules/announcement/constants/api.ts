/**
 * 공지사항 API 관련 상수
 */

// API 엔드포인트
export const API_ENDPOINTS = {
  ANNOUNCEMENTS: "/api/announcements",
  ANNOUNCEMENT_DETAIL: (id: string) => `/api/announcements/${id}`,
  ANNOUNCEMENT_PUBLISH: (id: string) => `/api/announcements/${id}/publish`,
  ANNOUNCEMENT_UNPUBLISH: (id: string) => `/api/announcements/${id}/unpublish`,
  FILE_UPLOAD: "/api/files/upload",
  FILE_DELETE: (id: string) => `/api/files/${id}`,
} as const;

// HTTP 메서드
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

// API 타임아웃 설정
export const API_TIMEOUT = {
  DEFAULT: 10000, // 10초
  UPLOAD: 60000, // 60초
} as const;
