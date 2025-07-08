import { FilterOption } from "@/shared/types/caddie";

// 페이지네이션 상수
export const ITEMS_PER_PAGE = 20;
export const SAMPLE_DATA_COUNT = 78;

// 테이블 컬럼 정의
export const CADDIE_COLUMNS = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center" as const,
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center" as const,
  },
  {
    key: "golfCourse",
    title: "골프장",
    width: 200,
    align: "center" as const,
  },
  {
    key: "gender",
    title: "성별",
    width: 100,
    align: "center" as const,
  },
  {
    key: "workStatus",
    title: "근무",
    width: 120,
    align: "center" as const,
  },
  {
    key: "group",
    title: "그룹",
    width: 120,
    align: "center" as const,
  },
  {
    key: "groupOrder",
    title: "그룹 순서",
    width: 140,
    align: "center" as const,
  },
  {
    key: "specialTeam",
    title: "특수반",
    width: 120,
    align: "center" as const,
  },
  {
    key: "phone",
    title: "연락처",
    width: 200,
    align: "center" as const,
  },
  {
    key: "workScore",
    title: "근무점수",
    width: 120,
    align: "center" as const,
  },
];

// 필터 옵션들
export const GROUP_OPTIONS: FilterOption[] = [
  { value: "그룹", label: "그룹" },
  { value: "1조", label: "1조" },
  { value: "2조", label: "2조" },
  { value: "3조", label: "3조" },
  { value: "4조", label: "4조" },
];

export const SPECIAL_TEAM_OPTIONS: FilterOption[] = [
  { value: "특수반", label: "특수반" },
  { value: "하우스", label: "하우스" },
  { value: "3부반", label: "3부반" },
];

// 기본 필터 값들
export const DEFAULT_FILTERS = {
  searchTerm: "",
  selectedGroup: "그룹",
  selectedSpecialTeam: "특수반",
} as const;
