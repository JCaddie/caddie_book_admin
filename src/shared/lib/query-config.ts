/**
 * React Query 공통 설정
 */

export const QUERY_CONFIG = {
  // 기본 staleTime (데이터가 신선하다고 간주되는 시간)
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5분

  // 빠른 업데이트가 필요한 데이터 (실시간성 중요)
  REALTIME_STALE_TIME: 30 * 1000, // 30초

  // 자주 변경되지 않는 데이터 (마스터 데이터)
  STATIC_STALE_TIME: 30 * 60 * 1000, // 30분

  // 기본 옵션
  DEFAULT_OPTIONS: {
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // 실시간 데이터용 옵션 (카트, 근무 현황 등)
  REALTIME_OPTIONS: {
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  },

  // 마스터 데이터용 옵션 (골프장, 사용자 등)
  STATIC_OPTIONS: {
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  },
} as const;

/**
 * 모듈별 캐시 키 관리
 */
export const CACHE_KEYS = {
  // 카트 관련
  CARTS: "carts",
  CART_DETAIL: "cart-detail",

  // 근무 관련
  WORK_SCHEDULES: "work-schedules",
  WORK_SCHEDULE: "work-schedule",
  SPECIAL_SCHEDULE: "special-schedule",

  // 휴무 관련
  DAY_OFF_REQUESTS: "day-off-requests",
  DAY_OFF_DETAIL: "day-off-detail",

  // 공지사항 관련
  ANNOUNCEMENTS: "announcements",
  ANNOUNCEMENT_DETAIL: "announcement-detail",

  // 사용자 관련
  USERS: "users",
  USER_DETAIL: "user-detail",
  ADMINS: "admins",

  // 골프장 관련
  GOLF_COURSES: "golf-courses",
  GOLF_COURSE_DETAIL: "golf-course-detail",
  GOLF_COURSES_SIMPLE: "golf-courses-simple",

  // 캐디 관련
  CADDIES: "caddies",
  CADDIE_DETAIL: "caddie-detail",
  CADDIES_SIMPLE: "caddies-simple",

  // 필드 관련
  FIELDS: "fields",
  FIELD_DETAIL: "field-detail",

  // 대시보드 관련
  DASHBOARD_MASTER: "dashboard-master",
  DASHBOARD_ADMIN: "dashboard-admin",
} as const;

/**
 * 에러 메시지 표준화
 */
export const QUERY_ERROR_MESSAGES = {
  FETCH_FAILED: "데이터를 불러오는데 실패했습니다.",
  CREATE_FAILED: "생성 중 오류가 발생했습니다.",
  UPDATE_FAILED: "수정 중 오류가 발생했습니다.",
  DELETE_FAILED: "삭제 중 오류가 발생했습니다.",
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  PERMISSION_ERROR: "권한이 없습니다.",
} as const;
