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
