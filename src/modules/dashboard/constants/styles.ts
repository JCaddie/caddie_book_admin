// 대시보드 공통 스타일 상수
export const DASHBOARD_STYLES = {
  // 카드 스타일
  CARD: "bg-white rounded-xl border border-gray-200",
  CARD_PADDING: "p-4",
  CARD_SECTION_PADDING: "p-8",

  // 헤더 스타일
  SECTION_HEADER: "flex justify-between items-center mb-2",
  SECTION_TITLE: "text-lg font-bold text-gray-800",

  // 차트 영역
  CHART_CONTAINER: "bg-white border border-gray-200 rounded-md p-4",
  CHART_PLACEHOLDER:
    "h-72 bg-gray-50 rounded-md flex items-center justify-center",

  // 범례
  LEGEND_CONTAINER: "flex justify-center gap-4 mt-4",
  LEGEND_ITEM: "flex items-center gap-2",
  LEGEND_DOT: "w-2.5 h-2.5 rounded-full",
  LEGEND_TEXT: "text-xs font-medium text-gray-800",

  // 토글 버튼
  TOGGLE_CONTAINER: "bg-gray-100 border border-gray-300 rounded-md p-1",
  TOGGLE_BUTTON_BASE: "px-2 py-1 text-xs font-medium rounded",
  TOGGLE_BUTTON_ACTIVE: "bg-white text-gray-800 shadow-sm",
  TOGGLE_BUTTON_INACTIVE: "bg-transparent text-gray-400",

  // 통계 배지
  STAT_BADGE_CONTAINER:
    "flex items-center gap-4 bg-white border border-gray-200 rounded-full px-6 py-2",
  STAT_BADGE_ITEM: "flex items-center gap-2",
  STAT_BADGE_LABEL: "text-sm font-bold px-2 py-1 rounded text-white",
  STAT_BADGE_VALUE: "text-sm font-bold text-black",
  STAT_BADGE_DIVIDER: "w-px h-4 bg-gray-200",
} as const;

// 대시보드 컬러 팔레트
export const DASHBOARD_COLORS = {
  // 계약 현황 컬러
  CONTRACT: {
    TOTAL: "#5372F6",
    CONTRACT: "#F99807",
    WAITING: "#66C6B4",
  },

  // 사용자 현황 컬러
  USER: {
    TOTAL: "#7107F9",
    ACTIVE: "#217F81",
    INACTIVE: "#D44947",
  },

  // 관리자 차트 컬러
  ADMIN: {
    TEAM: "#FEB912",
    PRIMARY: "#FEB912",
  },

  // 상태 컬러
  STATUS: {
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    INFO: "#3B82F6",
  },

  // 그레이 스케일
  GRAY: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
} as const;
