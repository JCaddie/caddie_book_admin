// 골프장 정보 타입
export interface GolfCourse {
  id: string;
  name: string;
  region: string;
}

// 그룹 정보 타입 (목록용)
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

// 그룹 정보 타입 (상세용)
export interface GroupDetail {
  id: string;
  name: string;
  group_type_name: string;
  description: string;
}

// 그룹 멤버십 타입
export interface GroupMembership {
  group: GroupDetail;
  is_primary: boolean;
  joined_date: string;
  is_active: boolean;
}

// 역할 표시 타입
export interface RoleDisplay {
  role: string;
  is_team_leader: boolean;
}

// 근무 배정 타입
export interface AssignedWork {
  message: string;
  upcoming_schedules: unknown[];
  current_assignment: unknown | null;
}

// 경력 타입
export interface Career {
  id?: string;
  company?: string;
  position?: string;
  period?: string;
  description?: string;
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
  selectedGolfCourseId: string;
}

// 캐디 선택 상태 타입
export interface CaddieSelection {
  selectedRowKeys: string[];
  selectedRows: Caddie[];
}

// 캐디 상세 정보 인터페이스
export interface CaddieDetail extends Record<string, unknown> {
  id: string;
  name: string;
  employment_type: EmploymentType;
  golf_course: GolfCourse;
  role_display: RoleDisplay;
  group_memberships: GroupMembership[];
  phone: string;
  email: string;
  address: string;
  assigned_work: AssignedWork;
  careers: Career[];
  gender: Gender;
  work_score: number;
  is_team_leader: boolean;
}
