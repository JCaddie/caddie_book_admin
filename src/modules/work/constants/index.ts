import { Column } from "@/shared/types/table";
import { defaultCellRenderer } from "@/shared/hooks";
import { Work } from "@/modules/work/types";

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

// 테이블 컬럼 정의 (Figma 디자인에 맞춤)
export const WORKS_TABLE_COLUMNS: Column<Work>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: defaultCellRenderer<Work>,
  },
  {
    key: "date",
    title: "일자",
    width: 160,
    align: "center",
    render: defaultCellRenderer<Work>,
  },
  {
    key: "golfCourse",
    title: "골프장",
    flex: true,
    align: "center",
    render: defaultCellRenderer<Work>,
  },
  {
    key: "totalStaff",
    title: "전체 인원수",
    width: 120,
    align: "center",
    render: defaultCellRenderer<Work>,
  },
  {
    key: "availableStaff",
    title: "가용인원수",
    width: 120,
    align: "center",
    render: defaultCellRenderer<Work>,
  },
];

// 페이지네이션 설정
export const WORKS_PAGE_SIZE = 20;

// 샘플 근무 데이터
export const SAMPLE_WORKS: Work[] = [
  {
    id: "1",
    no: 1,
    date: "2024.01.15",
    golfCourse: "제이캐디 아카데미",
    totalStaff: 10,
    availableStaff: 8,
    status: "confirmed",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    no: 2,
    date: "2024.01.16",
    golfCourse: "골프파크 CC",
    totalStaff: 12,
    availableStaff: 12,
    status: "planning",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T10:15:00Z",
  },
  {
    id: "3",
    no: 3,
    date: "2024.01.17",
    golfCourse: "그린힐스 CC",
    totalStaff: 8,
    availableStaff: 6,
    status: "completed",
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T18:00:00Z",
  },
];
