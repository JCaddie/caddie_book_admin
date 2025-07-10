import { UserRole } from "@/shared/types/user";

// User 타입 정의 (Record<string, unknown>을 확장)
export interface User extends Record<string, unknown> {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  no?: number; // 페이지네이션을 위한 번호 필드
  isEmpty?: boolean; // 빈 행 여부
}

// 액션바 Props 타입
export interface UserActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  roleFilter: string;
  onSearchChange: (term: string) => void;
  onRoleFilterChange: (role: string) => void;
  onDeleteSelected: () => void;
  onCreateClick: () => void;
  isDeleting?: boolean;
}

// 사용자 관리 훅 반환 타입
export interface UseUserManagementReturn {
  // 데이터
  paddedData: User[];
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
  handleDeleteUsers: () => Promise<void>;
  handleCreateUser: () => void;
  handleCloseModal: () => void;
  handleSubmitUser: (userData: {
    username: string;
    password: string;
    name: string;
    phone: string;
    email: string;
  }) => Promise<void>;
  handleRowClick: (user: User) => void;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;
}
