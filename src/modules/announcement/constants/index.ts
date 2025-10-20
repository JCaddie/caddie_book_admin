/**
 * 공지사항 모듈 통합 상수 정의
 */

// API 관련 상수
export const API_CONSTANTS = {
  ENDPOINTS: {
    ANNOUNCEMENTS: "/api/v1/announcements/",
    ANNOUNCEMENT_DETAIL: (id: string) => `/api/v1/announcements/${id}/`,
    ANNOUNCEMENT_PUBLISH: (id: string) =>
      `/api/v1/announcements/${id}/publish/`,
    ANNOUNCEMENT_UNPUBLISH: (id: string) =>
      `/api/v1/announcements/${id}/unpublish/`,
    FILE_UPLOAD: "/api/v1/files/upload/",
    FILE_DELETE: (id: string) => `/api/v1/files/${id}/`,
  },
  CACHE_KEYS: {
    ANNOUNCEMENTS: "announcements",
    ANNOUNCEMENT_DETAIL: (id: string) => `announcement-${id}`,
  },
  CACHE_TIME: {
    STALE_TIME: 5 * 60 * 1000, // 5분
    CACHE_TIME: 10 * 60 * 1000, // 10분
  },
} as const;

// UI 관련 상수
export const UI_CONSTANTS = {
  PAGE_SIZE: 20,
  TABLE: {
    MIN_WIDTH: 1200,
    ROW_HEIGHT: 60,
    HEADER_HEIGHT: 48,
    COLUMN_WIDTHS: {
      no: 80,
      title: 300,
      category: 120,
      priority: 100,
      views: 100,
      isPublished: 120,
      isPinned: 80,
      createdAt: 170,
      updatedAt: 170,
      author: 100,
    },
  },
  MODAL: {
    WIDTH: 600,
    MAX_WIDTH: "90vw",
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },
  STATUS_TEXT: {
    PUBLISHED: "게시됨",
    UNPUBLISHED: "게시 안함",
    DRAFT: "임시저장",
    ARCHIVED: "보관됨",
    PINNED: "고정됨",
    UNPINNED: "고정 해제",
  },
  CATEGORY_TEXT: {
    general: "일반",
    system: "시스템",
    maintenance: "점검",
    event: "이벤트",
    notice: "공지",
    urgent: "긴급",
  },
  PRIORITY_TEXT: {
    low: "낮음",
    normal: "보통",
    high: "높음",
    urgent: "긴급",
  },
  EMPTY_STATE: {
    NO_ANNOUNCEMENTS: "공지사항이 없습니다",
    NO_SEARCH_RESULTS: "검색 결과가 없습니다",
    NO_FILTERED_RESULTS: "필터 조건에 맞는 공지사항이 없습니다",
    LOADING: "공지사항을 불러오는 중...",
  },
} as const;

// 폼 관련 상수
export const FORM_CONSTANTS = {
  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000,
    MAX_FILES: 5,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },
  RULES: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000,
    MAX_FILES: 5,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },
  ERRORS: {
    TITLE_REQUIRED: "제목을 입력해주세요.",
    TITLE_TOO_LONG: "제목은 200자 이내로 입력해주세요.",
    CONTENT_REQUIRED: "내용을 입력해주세요.",
    CONTENT_TOO_LONG: "내용은 10,000자 이내로 입력해주세요.",
    FILES_TOO_MANY: "첨부파일은 최대 5개까지 가능합니다.",
    FILE_TOO_LARGE: "첨부파일 크기는 10MB 이하로 제한됩니다.",
  },
  PLACEHOLDERS: {
    TITLE: "공지사항 제목을 입력하세요",
    CONTENT: "공지사항 내용을 입력하세요",
    SEARCH: "제목, 내용, 작성자로 검색",
  },
} as const;

// 비즈니스 로직 상수
export const BUSINESS_CONSTANTS = {
  STATUS: {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived",
  },
  CATEGORIES: [
    "general",
    "system",
    "maintenance",
    "event",
    "notice",
    "urgent",
  ] as const,
  PRIORITIES: ["low", "normal", "high", "urgent"] as const,
  TYPES: ["JCADDIE", "GOLF_COURSE"] as const,
  DEFAULT_VALUES: {
    IS_PUBLISHED: false,
    PRIORITY: "normal",
    CATEGORY: "general",
    IS_PINNED: false,
  },
} as const;

// 파일 업로드 관련 상수
export const FILE_CONSTANTS = {
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_COUNT: 5,
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ALLOWED_EXTENSIONS: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ],
  },
  UPLOAD_STATUS: {
    PENDING: "pending",
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
  },
} as const;

// 통합 export
export const ANNOUNCEMENT_CONSTANTS = {
  API: API_CONSTANTS,
  UI: UI_CONSTANTS,
  FORM: FORM_CONSTANTS,
  BUSINESS: BUSINESS_CONSTANTS,
  FILE: FILE_CONSTANTS,
} as const;

// 레거시 호환성을 위한 개별 export (점진적 마이그레이션)
export const API_ENDPOINTS = API_CONSTANTS.ENDPOINTS;
export const ANNOUNCEMENT_FORM_RULES = FORM_CONSTANTS.RULES;
export const ANNOUNCEMENT_FORM_ERRORS = FORM_CONSTANTS.ERRORS;
export const FILE_UPLOAD_CONFIG = FILE_CONSTANTS.UPLOAD;

// UI 관련 레거시 호환성
export const ANNOUNCEMENT_COLUMN_WIDTHS = UI_CONSTANTS.TABLE.COLUMN_WIDTHS;
export const PAGINATION_CONFIG = {
  PAGE_SIZE: UI_CONSTANTS.PAGE_SIZE,
  DEFAULT_PAGE: 1,
  MAX_PAGE_SIZE: 100,
} as const;
