// 페이지네이션 상수
export const ITEMS_PER_PAGE = 20;

// 테이블 컬럼 정의
export const CADDIE_COLUMNS = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center" as const,
    render: (value: unknown, record: unknown, index: number) => index + 1,
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center" as const,
  },
  {
    key: "golf_course_name",
    title: "골프장",
    width: 200,
    align: "center" as const,
  },
  {
    key: "gender",
    title: "성별",
    width: 100,
    align: "center" as const,
    render: (value: unknown) => {
      const gender = value as string;
      return gender === "M" ? "남" : "여";
    },
  },
  {
    key: "employment_type",
    title: "근무형태",
    width: 120,
    align: "center" as const,
    render: (value: unknown) => {
      const employment_type = value as string;
      const typeMap: Record<string, string> = {
        FULL_TIME: "정규직",
        PART_TIME: "시간제",
        CONTRACT: "계약직",
        TEMPORARY: "임시직",
      };
      return typeMap[employment_type] || employment_type;
    },
  },
  {
    key: "primary_group",
    title: "그룹",
    width: 120,
    align: "center" as const,
    render: (value: unknown) => {
      const groupId = value as number | null;
      return groupId ? `그룹 ${groupId}` : "-";
    },
  },
  {
    key: "special_group",
    title: "특수반",
    width: 120,
    align: "center" as const,
    render: (value: unknown) => {
      const groupId = value as number | null;
      return groupId ? `특수반 ${groupId}` : "-";
    },
  },
  {
    key: "user_phone",
    title: "연락처",
    width: 200,
    align: "center" as const,
  },
  {
    key: "work_score",
    title: "근무점수",
    width: 120,
    align: "center" as const,
    render: (value: unknown) => {
      const score = value as number;
      return score.toString();
    },
  },
];

// 기본 필터 값들
export const DEFAULT_FILTERS = {
  searchTerm: "",
  selectedGroup: "그룹",
  selectedSpecialTeam: "특수반",
  selectedGolfCourseId: "",
} as const;
