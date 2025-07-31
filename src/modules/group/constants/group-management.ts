import { CaddieGroupManagement, GroupFilterOption } from "../types";

// 드롭다운 옵션들
export const GROUP_OPTIONS: GroupFilterOption[] = [
  { value: "전체", label: "그룹" },
  { value: "1조", label: "1조" },
  { value: "2조", label: "2조" },
  { value: "3조", label: "3조" },
  { value: "4조", label: "4조" },
  { value: "5조", label: "5조" },
  { value: "6조", label: "6조" },
  { value: "7조", label: "7조" },
  { value: "8조", label: "8조" },
  { value: "9조", label: "9조" },
];

export const SPECIAL_TEAM_OPTIONS: GroupFilterOption[] = [
  { value: "전체", label: "특수반" },
  { value: "새싹", label: "새싹캐디" },
  { value: "1-2부반", label: "1-2부반" },
  { value: "2-3부반", label: "2-3부반" },
  { value: "2부반", label: "2부반" },
];

export const STATUS_OPTIONS: GroupFilterOption[] = [
  { value: "전체", label: "상태" },
  { value: "근무", label: "근무" },
  { value: "당번", label: "당번" },
  { value: "휴무", label: "휴무" },
];

// 모크 데이터 (필요시 사용)
export const MOCK_GROUPS_DATA: CaddieGroupManagement[] = [];
