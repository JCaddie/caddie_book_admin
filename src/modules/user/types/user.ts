import { UserRole } from "@/shared/types/user";

// User 타입 정의 (API 응답에 맞게 개선)
export interface User extends Record<string, unknown> {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  role_display: string;
  golf_course_id: string | null;
  golf_course_name: string | null;
  is_active: boolean;
  created_at: string;
  no?: number; // 페이지네이션을 위한 번호 필드
  isEmpty?: boolean; // 빈 행 여부
}

// 기존 API 응답 타입들 (하위 호환성)
export interface AdminsApiResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: User[];
  };
}

export interface UserDetailApiResponse {
  success: boolean;
  message: string;
  data: User;
}

// 어드민 생성 요청 타입
export interface CreateAdminRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  role: UserRole;
  golf_course_id: string;
}

// 어드민 생성 성공 응답 타입
export interface CreateAdminSuccessResponse {
  success: true;
  message: string;
  data: User;
}

// 어드민 생성 실패 응답 타입
export interface CreateAdminErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  non_field_errors?: string[];
}

// 어드민 생성 응답 타입 (성공/실패 모두 포함)
export type CreateAdminResponse =
  | CreateAdminSuccessResponse
  | CreateAdminErrorResponse;

// 어드민 벌크 삭제 요청 타입
export interface BulkDeleteAdminsRequest {
  ids: string[];
}

// 어드민 벌크 삭제 성공 응답 타입
export interface BulkDeleteAdminsSuccessResponse {
  success: true;
  message: string;
  data: {
    deleted_count: number;
  };
}

// 어드민 벌크 삭제 실패 응답 타입
export interface BulkDeleteAdminsErrorResponse {
  success: false;
  message: string;
  error_code: string;
}

// 어드민 벌크 삭제 응답 타입 (성공/실패 모두 포함)
export type BulkDeleteAdminsResponse =
  | BulkDeleteAdminsSuccessResponse
  | BulkDeleteAdminsErrorResponse;

// 어드민 수정 요청 타입
export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  is_active?: boolean;
  golf_course_id?: string;
  password?: string;
  password_confirm?: string;
}

// 어드민 수정 성공 응답 타입
export interface UpdateAdminSuccessResponse {
  success: true;
  message: string;
  data: User;
}

// 어드민 수정 실패 응답 타입
export interface UpdateAdminErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  non_field_errors?: string[];
}

// 어드민 수정 응답 타입 (성공/실패 모두 포함)
export type UpdateAdminResponse =
  | UpdateAdminSuccessResponse
  | UpdateAdminErrorResponse;

// 액션바 Props 타입
export interface UserActionBarProps {
  totalCount: number;
  selectedCount: number;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  onSearch: (searchTerm: string) => void;
  onDeleteSelected: () => void;
  onCreateClick: () => void;
  isDeleting?: boolean;
}

// 사용자 관리 훅 반환 타입
export interface UseUserManagementReturn {
  // 데이터
  currentData: User[];
  filteredData: User[];

  // 상태
  selectedRowKeys: string[];
  selectedRows: User[];
  isDeleting: boolean;
  searchTerm: string;
  roleFilter: string;
  currentPage: number;
  totalCount: number;

  // 모달 상태
  isCreateModalOpen: boolean;
  isCreating: boolean;

  // 페이지네이션
  totalPages: number;
  handlePageChange: (page: number) => void;

  // 액션
  handleUpdateSelection: (keys: string[], rows: User[]) => void;
  handleDeleteUsers: () => void;
  handleCreateUser: () => void;
  handleCloseModal: () => void;
  handleSubmitUser: (userData: CreateAdminRequest) => Promise<void>;
  handleRowClick: (user: User) => void;
  setSearchTerm: (search: string) => void;
  setRoleFilter: (role: string) => void;

  // 추가 상태들 (디버깅용)
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

// 새로운 캐디 그룹 배정 개요 API 응답 타입
export interface GolfCourseInfo {
  id: string;
  name: string;
}

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
  employment_type: "FULL_TIME" | "PART_TIME";
  is_temporary: boolean;
  order?: number;
  is_team_leader?: boolean;
  group_order: number;
  membership_id: number;
  joined_date: string;
  membership_type: "PRIMARY" | "SPECIAL";
  is_primary: boolean;
}

export interface PrimaryGroup extends Record<string, unknown> {
  id: string;
  name: string;
  group_type: "PRIMARY";
  order: number;
  is_active: boolean;
  description: string;
  member_count: number;
  members: GroupMember[];
}

export interface UnassignedCaddie {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
  employment_type: "FULL_TIME" | "PART_TIME";
  is_temporary: boolean;
}

export interface GolfCourseGroupStatus {
  id: string;
  name: string;
  contract_status: string;
  group_type?: "PRIMARY" | "SPECIAL"; // API 응답에서 그룹 타입
  primary_group_count: number;
  special_group_count?: number; // SPECIAL 타입일 때 제공
  total_caddies: number;
  grouped_caddies_count: number;
  ungrouped_caddies_count: number;
  primary_groups: PrimaryGroup[];
  special_groups?: PrimaryGroup[]; // SPECIAL 타입일 때 제공 (구조는 동일)
  ungrouped_caddies: UnassignedCaddie[];
}

export interface CaddieAssignmentOverviewResponse {
  success: boolean;
  message: string;
  data: GolfCourseGroupStatus;
}

// 하위 호환성을 위한 기존 타입들
/** @deprecated 새로운 PrimaryGroup 타입 사용 권장 */
export interface Group extends Record<string, unknown> {
  id: string;
  name: string;
  order: number;
  member_count: number;
  members: GroupMember[];
}

/** @deprecated 새로운 GolfCourseGroupStatus 타입 사용 권장 */
export interface AssignmentSummary {
  total_groups: number;
  total_assigned_caddies: number;
  total_unassigned_caddies: number;
}

// 기존 타입들은 호환성을 위해 유지하되 deprecated로 표시
/** @deprecated 새로운 API 구조로 변경됨 */
export interface LegacyPrimaryGroup {
  id: string;
  name: string;
  group_type_name: string;
  description: string;
}

/** @deprecated 새로운 API 구조로 변경됨 */
export interface LegacySpecialGroup {
  id: string;
  name: string;
  order: number;
}

/** @deprecated 새로운 API 구조로 변경됨 */
export interface LegacyUserAssignment {
  id: string;
  name: string;
  primary_group: LegacyPrimaryGroup | null;
  primary_group_order: number | null;
  special_group: LegacySpecialGroup | null;
  special_group_order: number | null;
}

/** @deprecated 새로운 API 구조로 변경됨 */
export interface UserAssignmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LegacyUserAssignment[];
}

// 임시 캐디 생성 요청 타입
export interface CreateTemporaryCaddieRequest {
  name: string;
  golf_course: string;
  primary_group?: string;
  special_group?: string;
  gender: "M" | "F";
  employment_type: "FULL_TIME" | "PART_TIME";
  address: string;
  temporary_notes: string;
}

// 임시 캐디 생성 성공 응답 타입
export interface CreateTemporaryCaddieSuccessResponse {
  success: true;
  message: string;
  data: {
    id: string;
    name: string;
    golf_course: {
      id: string;
      name: string;
    };
    is_temporary: true;
    temporary_created_by: string;
    temporary_notes: string;
    primary_group?: {
      id: string;
      name: string;
    };
    special_group?: {
      id: string;
      name: string;
    };
  };
}

// 임시 캐디 생성 실패 응답 타입
export interface CreateTemporaryCaddieErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  non_field_errors?: string[];
}

// 임시 캐디 생성 응답 타입 (성공/실패 모두 포함)
export type CreateTemporaryCaddieResponse =
  | CreateTemporaryCaddieSuccessResponse
  | CreateTemporaryCaddieErrorResponse;

// 임시 캐디 삭제 성공 응답 타입
export interface DeleteTemporaryCaddieSuccessResponse {
  success: true;
  message: string;
}

// 임시 캐디 삭제 실패 응답 타입
export interface DeleteTemporaryCaddieErrorResponse {
  success: false;
  message: string;
  error_code?: string;
}

// 임시 캐디 삭제 응답 타입 (성공/실패 모두 포함)
export type DeleteTemporaryCaddieResponse =
  | DeleteTemporaryCaddieSuccessResponse
  | DeleteTemporaryCaddieErrorResponse;
