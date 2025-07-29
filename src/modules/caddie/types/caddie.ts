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

// 통합된 도메인 타입 사용
import type { GolfCourse } from "@/shared/types/domain";

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

// 캐디 기본 정보 인터페이스 (새로운 API 응답에 맞게 업데이트)
export interface Caddie extends Record<string, unknown> {
  id: string; // UI에서 string ID를 사용하므로 string으로 유지
  user: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  golf_course_name: string;
  gender: Gender;
  employment_type: EmploymentType;
  address: string;
  is_on_duty: boolean;
  primary_group: number | null;
  primary_group_order: number;
  special_group: number | null;
  special_group_order: number;
  work_score: number;
  is_team_leader: boolean;
  registration_status: string;
  remaining_days_off: number;
  created_at: string;
  updated_at: string;
  isEmpty?: boolean;
  // 호환성을 위한 computed 필드들
  name?: string;
  golf_course?: GolfCourse;
  phone?: string;
}

// 캐디 상세 정보 인터페이스 (새로운 API 응답에 맞게 업데이트)
export interface CaddieDetail {
  id: number;
  user: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  golf_course_name: string;
  gender: Gender;
  employment_type: EmploymentType;
  address: string;
  is_on_duty: boolean;
  primary_group: number | null;
  primary_group_order: number;
  special_group: number | null;
  special_group_order: number;
  work_score: number;
  is_team_leader: boolean;
  registration_status: string;
  remaining_days_off: number;
  created_at: string;
  updated_at: string;
  // 호환성을 위한 computed 필드들
  name?: string;
  phone?: string;
  email?: string;
}

// ================================
// API 관련 타입
// ================================

// 캐디 목록 API 응답 데이터
export interface CaddieListData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Caddie[];
}

// 캐디 목록 API 응답
export interface CaddieListResponse {
  success: boolean;
  message: string;
  data: CaddieListData;
}

// 캐디 상세 정보 API 응답
export interface CaddieDetailResponse {
  success: boolean;
  message: string;
  data: CaddieDetail;
}

// 캐디 그룹 타입
export interface CaddieGroup {
  id: string;
  name: string;
  group_type: "PRIMARY" | "SPECIAL";
  order: number;
  is_active: boolean;
  description: string;
  golf_course: string;
  created_at: string;
  updated_at: string;
}

// 캐디 그룹 목록 API 응답
export interface CaddieGroupListResponse {
  success: boolean;
  message: string;
  data: CaddieGroup[];
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
