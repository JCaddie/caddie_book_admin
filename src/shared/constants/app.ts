/**
 * 통합된 애플리케이션 상수 정의
 * 모든 모듈에서 공통으로 사용할 상수들을 중앙화
 */

// ================================
// 페이지네이션 상수
// ================================

export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// ================================
// 상태 상수
// ================================

export const STATUS_CONSTANTS = {
  // 근무 상태
  WORK: {
    PLANNING: "planning",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },

  // 카트 상태
  CART: {
    AVAILABLE: "available",
    IN_USE: "in_use",
    MAINTENANCE: "maintenance",
  },

  // 필드 상태
  FIELD: {
    OPERATING: "operating",
    MAINTENANCE: "maintenance",
  },

  // 공지사항 상태
  ANNOUNCEMENT: {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived",
  },
} as const;

// ================================
// UI 상수
// ================================

export const UI_CONSTANTS = {
  // 테이블 관련
  TABLE: {
    MIN_WIDTH: 1200,
    ROW_HEIGHT: 60,
    HEADER_HEIGHT: 48,
    DEFAULT_EMPTY_TEXT: "데이터가 없습니다",
  },

  // 모달 관련
  MODAL: {
    DEFAULT_WIDTH: 600,
    MAX_WIDTH: "90vw",
  },

  // 폼 관련
  FORM: {
    VALIDATION: {
      TITLE_MIN_LENGTH: 1,
      TITLE_MAX_LENGTH: 200,
      CONTENT_MIN_LENGTH: 1,
      CONTENT_MAX_LENGTH: 10000,
      MAX_FILES: 5,
      MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    },
  },

  // 파일 업로드 관련
  FILE: {
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
  },
} as const;

// ================================
// 비즈니스 로직 상수
// ================================

export const BUSINESS_CONSTANTS = {
  // 공지사항 카테고리
  ANNOUNCEMENT_CATEGORIES: [
    "general",
    "system",
    "maintenance",
    "event",
    "notice",
    "urgent",
  ] as const,

  // 공지사항 우선순위
  ANNOUNCEMENT_PRIORITIES: ["low", "normal", "high", "urgent"] as const,

  // 공지사항 타입
  ANNOUNCEMENT_TYPES: ["JCADDIE", "GOLF_COURSE"] as const,

  // 캐디 성별
  CADDIE_GENDERS: ["MALE", "FEMALE"] as const,

  // 캐디 고용 형태
  CADDIE_EMPLOYMENT_TYPES: ["FULL_TIME", "PART_TIME", "CONTRACT"] as const,

  // 기본값들
  DEFAULT_VALUES: {
    IS_PUBLISHED: false,
    PRIORITY: "normal",
    CATEGORY: "general",
    IS_PINNED: false,
  },
} as const;

// ================================
// API 관련 상수
// ================================

export const API_CONSTANTS = {
  // API Base URL (HTTPS 직접 연결)
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://3.35.21.201/api",

  // EC2 서버 정보
  EC2_SERVER: {
    IP: "3.35.21.201",
    DNS: "ec2-3-35-21-201.ap-northeast-2.compute.amazonaws.com",
    PORT: "443",
    PROTOCOL: "https",
  },

  // 캐시 시간
  CACHE_TIME: {
    STALE_TIME: 5 * 60 * 1000, // 5분
    CACHE_TIME: 10 * 60 * 1000, // 10분
  },

  // 재시도 설정
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1초
  },
} as const;

// ================================
// 통합 export
// ================================

export const APP_CONSTANTS = {
  PAGINATION: PAGINATION_CONSTANTS,
  STATUS: STATUS_CONSTANTS,
  UI: UI_CONSTANTS,
  BUSINESS: BUSINESS_CONSTANTS,
  API: API_CONSTANTS,
} as const;
