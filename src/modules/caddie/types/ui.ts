// ================================
// 캐디 UI 관련 타입
// ================================

import type { GolfCourse } from "@/shared/types/domain";
import type { EmploymentType, Gender } from "./domain";

// UI에서 사용하는 캐디 정보 (호환성 필드 포함)
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

// 편집 가능한 캐디 필드들
export interface EditableCaddie {
  id: string;
  name: string;
  gender: Gender;
  employmentType: EmploymentType;
  golfCourse: string;
  workScore: number;
  isTeamLeader: boolean;
  primaryGroup: string;
  specialGroups: string;
  phone: string;
  email: string;
  address: string;
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

// 선택지 옵션 타입
export interface SelectOption {
  value: string | number;
  label: string;
}

// 캐디 폼 에러 타입
export interface CaddieFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  employmentType?: string;
  golfCourse?: string;
  address?: string;
  workScore?: string;
  primaryGroup?: string;
  specialGroup?: string;
}

// 캐디 테이블 컬럼 설정
export interface CaddieTableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: "left" | "right";
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: Caddie) => React.ReactNode;
}

// 캐디 목록 화면 상태
export interface CaddieListViewState {
  loading: boolean;
  error: string | null;
  data: Caddie[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: CaddieFilters;
  selection: CaddieSelection;
}

// 캐디 상세 화면 상태
export interface CaddieDetailViewState {
  loading: boolean;
  error: string | null;
  caddie: Caddie | null;
  isEditing: boolean;
  formErrors: CaddieFormErrors;
}

// 캐디 생성/편집 폼 상태
export interface CaddieFormState {
  values: Partial<EditableCaddie>;
  errors: CaddieFormErrors;
  loading: boolean;
  touched: Record<string, boolean>;
}

// 캐디 액션 타입
export type CaddieAction =
  | "view"
  | "edit"
  | "delete"
  | "approve"
  | "reject"
  | "assign_group"
  | "change_status";

// 캐디 권한 체크 함수 타입
export type CaddiePermissionChecker = (
  action: CaddieAction,
  caddie: Caddie,
  userRole: string
) => boolean;
