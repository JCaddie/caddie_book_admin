/**
 * 공지사항 모듈 피처 플래그
 */

export const FEATURE_FLAGS = {
  // 첨부파일 기능 활성화 여부
  ENABLE_FILE_UPLOAD: false,

  // 카테고리 기능 활성화 여부
  ENABLE_CATEGORIES: false,

  // 우선순위 기능 활성화 여부
  ENABLE_PRIORITIES: false,

  // 고정 기능 활성화 여부
  ENABLE_PINNED: false,

  // 유효기간 기능 활성화 여부
  ENABLE_VALIDITY_PERIOD: false,
} as const;

/**
 * 기능 활성화 체크 헬퍼
 */
export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS
): boolean => {
  return FEATURE_FLAGS[feature];
};

/**
 * 개발 환경에서만 활성화되는 기능들
 */
export const DEV_FEATURES = {
  ENABLE_MOCK_DATA: process.env.NODE_ENV === "development",
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === "development",
} as const;
