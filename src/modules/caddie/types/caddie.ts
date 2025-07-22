// ================================
// 캐디 도메인 타입
// ================================

// 성별 타입
export type Gender = "M" | "F";

// 고용형태 타입
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY";

// 골프장 정보 타입
export interface GolfCourse {
  id: string;
  name: string;
  region: string;
}

// 그룹 정보 타입
export interface Group {
  id: string;
  name: string;
  golf_course_name: string;
  group_type: string;
  order: number;
}

// 특수 그룹 타입
export interface SpecialGroup {
  id: string;
  name: string;
  golf_course_name: string;
  group_type: string;
  order: number;
}

// 역할 표시 타입
export interface RoleDisplay {
  role: string;
  is_team_leader: boolean;
}

// 경력 타입
export interface CaddieCareer {
  golf_course_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

// 근무 배정 타입
export interface AssignedWork {
  message: string;
  upcoming_schedules: unknown[];
  current_assignment: unknown | null;
}

// 캐디 기본 정보 인터페이스
export interface Caddie {
  id: string;
  name: string;
  golf_course: GolfCourse;
  gender: Gender;
  employment_type: EmploymentType;
  phone: string;
  work_score: number;
  isEmpty?: boolean;
}

// 캐디 상세 정보 인터페이스 (새로운 API 구조)
export interface CaddieDetail {
  id: string;
  name: string;
  employment_type: EmploymentType;
  golf_course: GolfCourse;
  role_display: RoleDisplay;
  primary_group?: Group;
  special_groups?: SpecialGroup[];
  phone: string;
  email: string;
  address: string;
  gender: Gender;
  work_score: number;
  is_team_leader: boolean;
  careers: CaddieCareer[];
  assigned_work: AssignedWork;
}

// ================================
// API 관련 타입
// ================================

// 캐디 목록 API 응답
export interface CaddieListResponse {
  results: Caddie[];
  count: number;
  next?: string;
  previous?: string;
}

// 캐디 목록 조회 파라미터
export interface CaddieListParams {
  page?: number;
  page_size?: number;
  search?: string;
  group?: string;
  special_team?: string;
  golf_course_id?: string;
}

// 캐디 정보 업데이트 요청 타입
export interface UpdateCaddieRequest {
  name?: string;
  gender?: string;
  employment_type?: string;
  phone?: string;
  email?: string;
  address?: string;
  golf_course_id?: string;
  work_score?: number;
  is_team_leader?: boolean;
  primary_group_id?: string;
  special_group_ids?: string[];
}

// ================================
// UI 관련 타입
// ================================

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

// 선택지 옵션 타입
export interface SelectOption {
  value: string | number;
  label: string;
}
