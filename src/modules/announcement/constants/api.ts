/**
 * 공지사항 API 관련 상수
 */

// API 엔드포인트
export const API_ENDPOINTS = {
  ANNOUNCEMENTS: "/api/v1/announcements/",
  ANNOUNCEMENT_DETAIL: (id: string) => `/api/v1/announcements/${id}/`,
  ANNOUNCEMENT_PUBLISH: (id: string) => `/api/v1/announcements/${id}/publish/`,
  ANNOUNCEMENT_UNPUBLISH: (id: string) =>
    `/api/v1/announcements/${id}/unpublish/`,
  FILE_UPLOAD: "/api/v1/files/upload/",
  FILE_DELETE: (id: string) => `/api/v1/files/${id}/`,
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
