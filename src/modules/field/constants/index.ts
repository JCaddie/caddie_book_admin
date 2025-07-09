// 필드 관리 상수
export const FIELD_CONSTANTS = {
  // 페이지네이션
  ITEMS_PER_PAGE: 20,

  // 샘플 데이터
  SAMPLE_DATA_COUNT: 26,

  // 골프장 이름
  GOLF_COURSES: [
    "청담 컨트리클럽",
    "파인힐 골프장",
    "그린밸리 CC",
    "오크우드 골프장",
    "레이크사이드 CC",
  ] as const,

  // 필드 상태
  STATUS: {
    OPERATING: "운영중",
    MAINTENANCE: "정비중",
  } as const,

  // 용량 범위 (15-24명)
  CAPACITY_RANGE: {
    MIN: 15,
    MAX: 24,
  } as const,

  // 카트 대수 범위 (3-7대)
  CART_RANGE: {
    MIN: 3,
    MAX: 7,
  } as const,

  // 정비중 상태 주기 (7번째마다)
  MAINTENANCE_CYCLE: 7,

  // UI 텍스트
  UI_TEXT: {
    SEARCH_PLACEHOLDER: "필드명, 골프장명 검색",
    CREATE_BUTTON: "생성",
    DELETE_TITLE: "필드 삭제",
    DELETE_MESSAGE: "개의 필드를 삭제하시겠습니까?",
    TOTAL_COUNT: "총 {count}건",
  } as const,

  // 컬럼 너비
  COLUMN_WIDTHS: {
    NO: 80,
    STATUS: 120,
    CAPACITY: 120,
    CART: 120,
  } as const,
} as const;

// 상태 컬러 매핑
export const STATUS_COLORS = {
  [FIELD_CONSTANTS.STATUS.OPERATING]: "text-green-600",
  [FIELD_CONSTANTS.STATUS.MAINTENANCE]: "text-red-600",
} as const;
