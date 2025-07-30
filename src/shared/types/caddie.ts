// ================================
// Legacy 캐디 타입 (호환성 유지용)
// ================================

// 새로운 타입들은 modules에서 사용
export type {
  Caddie as ModernCaddie,
  CaddieDetail as ModernCaddieDetail,
  CaddieFilters as ModernCaddieFilters,
  CaddieSelection as ModernCaddieSelection,
  Gender,
  EmploymentType,
} from "@/modules/caddie/types";

// Legacy 타입들 (기존 코드 호환성 유지)
export interface GolfCourse {
  id: string;
  name: string;
  region: string;
}

export interface Group {
  id: number;
  name: string;
  group_type: string;
}

export interface SpecialGroup {
  id: number;
  name: string;
  group_type: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  group_type_name: string;
  description: string;
}

export interface GroupMembership {
  group: GroupDetail;
  is_primary: boolean;
  joined_date: string;
  is_active: boolean;
}

export interface RoleDisplay {
  role: string;
  is_team_leader: boolean;
}

export interface AssignedWork {
  message: string;
  upcoming_schedules: unknown[];
  current_assignment: unknown | null;
}

export interface Career {
  id?: string;
  company?: string;
  position?: string;
  period?: string;
  description?: string;
}

// Legacy 캐디 인터페이스 (기존 호환성 유지)
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

// Legacy 필터 타입들
export interface FilterOption {
  value: string;
  label: string;
}

export interface CaddieFilters {
  searchTerm: string;
  selectedGroup: string;
  selectedSpecialTeam: string;
  selectedGolfCourseId: string;
}

export interface CaddieSelection {
  selectedRowKeys: string[];
  selectedRows: Caddie[];
}

// Legacy 상세 타입
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
