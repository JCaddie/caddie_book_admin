import { UserRole } from "@/shared/types/user";

// User 타입 정의 (Record<string, unknown>을 확장)
export interface User extends Record<string, unknown> {
  id: string;
  username?: string; // API 응답에는 없지만 기존 코드 호환성을 위해 선택적으로 유지
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  role_display: string;
  golf_course_id: string | null;
  golf_course_name: string | null;
  created_at: string;
  no?: number; // 페이지네이션을 위한 번호 필드
  isEmpty?: boolean; // 빈 행 여부
}

// API 응답 타입들
export interface AdminsApiResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: User[];
}

export interface UserDetailApiResponse {
  success: boolean;
  message: string;
  data: User;
}

// 액션바 Props 타입
export interface UserActionBarProps {
  totalCount: number;
  selectedCount: number;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
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
  handleSubmitUser: (userData: {
    username: string;
    password: string;
    password_confirm: string;
    name: string;
    phone: string;
    email: string;
    golf_course_id: string;
  }) => void;
  handleRowClick: (user: User) => void;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;

  // API 상태 (선택적)
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
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
  order?: number;
  is_team_leader?: boolean;
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
}

export interface GolfCourseGroupStatus {
  id: string;
  name: string;
  contract_status: string;
  primary_group_count: number;
  total_caddies: number;
  grouped_caddies_count: number;
  ungrouped_caddies_count: number;
  primary_groups: PrimaryGroup[];
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
