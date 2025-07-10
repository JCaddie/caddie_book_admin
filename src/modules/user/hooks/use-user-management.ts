import { useState, useCallback, useMemo } from "react";
import { User, UserFilters } from "../types";
import { USER_CONSTANTS } from "../constants";
import { useTableSelection } from "@/shared/hooks";
import { usePagination } from "@/shared/hooks";
import { getUserRowKey, isEmptyUser } from "../utils";

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    username: "jcaddie",
    name: "홍길동",
    phone: "010-1234-5678",
    email: "adminkim@admin.com",
    role: "master",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "admin01",
    name: "김관리",
    phone: "010-2345-6789",
    email: "admin01@admin.com",
    role: "admin",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    username: "user01",
    name: "이사용",
    phone: "010-3456-7890",
    email: "user01@user.com",
    role: "user",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

export interface UseUserManagementReturn {
  // 데이터
  paddedData: User[];
  realDataCount: number;
  totalCount: number;

  // 필터 상태
  filters: UserFilters;
  updateSearchTerm: (term: string) => void;
  updateRoleFilter: (role: string) => void;

  // 선택 상태
  selection: {
    selectedRowKeys: string[];
    selectedRows: User[];
  };
  updateSelection: (selectedRowKeys: string[], selectedRows: User[]) => void;

  // 페이지네이션
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;

  // 액션
  addUser: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  deleteSelectedUsers: () => void;

  // 모달 상태
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
}

export const useUserManagement = (): UseUserManagementReturn => {
  // 필터 상태
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: "",
    role: "",
  });

  // 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        !filters.searchTerm ||
        user.username
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesRole = !filters.role || user.role === filters.role;

      return matchesSearch && matchesRole;
    });
  }, [filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredData,
      itemsPerPage: USER_CONSTANTS.ITEMS_PER_PAGE,
    });

  // 패딩된 데이터 (빈 행 추가)
  const paddedData = useMemo(() => {
    const emptyRowsCount = Math.max(
      0,
      USER_CONSTANTS.ITEMS_PER_PAGE - currentData.length
    );
    const emptyRows = Array(emptyRowsCount)
      .fill(null)
      .map((_, index) => ({
        id: `empty-${index}`,
        username: "",
        name: "",
        phone: "",
        email: "",
        role: "user" as const,
        createdAt: "",
        updatedAt: "",
      }));
    return [...currentData, ...emptyRows];
  }, [currentData]);

  // 테이블 선택 기능
  const tableSelection = useTableSelection<User>({
    data: paddedData,
    extractRowKey: getUserRowKey,
    selectedRowKeys,
    onSelectChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  });

  // 필터 업데이트 함수
  const updateSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const updateRoleFilter = useCallback((role: string) => {
    setFilters((prev) => ({ ...prev, role }));
  }, []);

  // 선택 업데이트 함수
  const updateSelection = useCallback((keys: string[], rows: User[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  }, []);

  // 액션 함수
  const addUser = useCallback(() => {
    console.log("사용자 추가");
  }, []);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const deleteSelectedUsers = useCallback(async () => {
    setIsDeleting(true);
    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("사용자 삭제:", selectedRowKeys);
      setIsDeleteModalOpen(false);
      tableSelection.clearSelection();
    } catch (error) {
      console.error("사용자 삭제 오류:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys, tableSelection]);

  return {
    // 데이터
    paddedData,
    realDataCount: currentData.length,
    totalCount: filteredData.length,

    // 필터 상태
    filters,
    updateSearchTerm,
    updateRoleFilter,

    // 선택 상태
    selection: {
      selectedRowKeys,
      selectedRows,
    },
    updateSelection,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 액션
    addUser,
    openDeleteModal,
    closeDeleteModal,
    deleteSelectedUsers,

    // 모달 상태
    isDeleteModalOpen,
    isDeleting,
  };
};
