// 골프장 정보 타입
export interface GolfCourse {
  id: string;
  name: string;
  region: string;
}

// 그룹 정보 타입
export interface Group {
  id: number;
  name: string;
  group_type: string;
}

// 특수그룹 타입 (배열로 관리)
export interface SpecialGroup {
  id: number;
  name: string;
  group_type: string;
}

// 고용 타입
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY";

// 성별 타입
export type Gender = "M" | "F";

// 캐디 기본 정보 인터페이스
export interface Caddie extends Record<string, unknown> {
  id: string;
  name: string;
  golf_course: GolfCourse;
  gender: Gender;
  employment_type: EmploymentType;
  primary_group: Group;
  special_groups: SpecialGroup[];
  phone: string;
  work_score: number;
  isEmpty?: boolean;
}

// 필터 옵션 타입
export interface FilterOption {
  value: string;
  label: string;
}

// 캐디 필터 상태 타입
export interface CaddieFilters {
  searchTerm: string;
  selectedGroup: string;
  selectedSpecialTeam: string;
}

// 캐디 선택 상태 타입
export interface CaddieSelection {
  selectedRowKeys: string[];
  selectedRows: Caddie[];
}
