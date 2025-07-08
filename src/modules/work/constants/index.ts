// 근무 스케줄 상태
export const WORK_STATUS = {
  PLANNING: "planning",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const WORK_STATUS_LABELS = {
  [WORK_STATUS.PLANNING]: "계획중",
  [WORK_STATUS.CONFIRMED]: "확정",
  [WORK_STATUS.COMPLETED]: "완료",
  [WORK_STATUS.CANCELLED]: "취소",
} as const;

// 필터 옵션
export const WORK_STATUS_OPTIONS = [
  { value: "전체", label: "전체" },
  {
    value: WORK_STATUS.PLANNING,
    label: WORK_STATUS_LABELS[WORK_STATUS.PLANNING],
  },
  {
    value: WORK_STATUS.CONFIRMED,
    label: WORK_STATUS_LABELS[WORK_STATUS.CONFIRMED],
  },
  {
    value: WORK_STATUS.COMPLETED,
    label: WORK_STATUS_LABELS[WORK_STATUS.COMPLETED],
  },
  {
    value: WORK_STATUS.CANCELLED,
    label: WORK_STATUS_LABELS[WORK_STATUS.CANCELLED],
  },
];

// 샘플 골프장 데이터
export const SAMPLE_GOLF_COURSES = [
  "제이캐디 아카데미",
  "골프파크 CC",
  "그린힐스 CC",
  "선샤인 골프장",
  "블루스카이 CC",
] as const;
