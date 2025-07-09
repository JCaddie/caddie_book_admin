/**
 * 인증 관련 상수들
 */
export const AUTH_CONSTANTS = {
  // 쿠키 이름들
  COOKIES: {
    AUTH_TOKEN: "auth_token",
    USER_DATA: "user_data",
  },

  // 토큰 설정
  TOKEN: {
    EXPIRES_DAYS: 7, // 7일간 유효
    PREFIX: "mock-token",
  },

  // 경로 설정
  ROUTES: {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    HOME: "/",
  },
} as const;

/**
 * 사용자 역할 레벨 정의
 */
export const ROLE_LEVELS = {
  DEVELOPER: 2,
  BRANCH: 1,
} as const;

/**
 * 토큰 형식 상수
 */
export const TOKEN_FORMAT = {
  MOCK_PREFIX: "mock-token",
  SEPARATOR: "-",
  MIN_PARTS: 3,
} as const;
