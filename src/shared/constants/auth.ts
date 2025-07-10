/**
 * 인증 관련 상수들
 */
export const AUTH_CONSTANTS = {
  // 토큰 설정
  TOKEN: {
    EXPIRES_DAYS: 7, // 7일
    HEADER_NAME: "Authorization",
    PREFIX: "Bearer ",
  },

  // 쿠키 설정
  COOKIES: {
    AUTH_TOKEN: "caddie_auth_token",
    USER_DATA: "caddie_user_data",
    REMEMBER_ME: "caddie_remember_me",
  },

  // 세션 설정
  SESSION: {
    MAX_IDLE_TIME: 30 * 60 * 1000, // 30분 (밀리초)
    CHECK_INTERVAL: 60 * 1000, // 1분마다 체크
  },

  // 로그인 설정
  LOGIN: {
    MAX_ATTEMPTS: 5, // 최대 시도 횟수
    LOCKOUT_TIME: 15 * 60 * 1000, // 15분 잠금
  },

  // 권한 레벨 (높을수록 상위 권한)
  ROLE_LEVELS: {
    MASTER: 2,
    ADMIN: 1,
  },

  // 라우트 권한 설정
  PROTECTED_ROUTES: {
    // 마스터만 접근 가능한 라우트
    MASTER_ONLY: ["/golf-courses/new", "/golf-courses/*/edit"],

    // 로그인 필요한 라우트 (모든 권한)
    AUTH_REQUIRED: ["/dashboard", "/caddies", "/fields", "/works", "/users"],
  },
} as const;

/**
 * 토큰 형식 상수
 */
export const TOKEN_FORMAT = {
  MOCK_PREFIX: "mock-token",
  SEPARATOR: "-",
  MIN_PARTS: 3,
} as const;
