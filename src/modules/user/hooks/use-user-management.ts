import React from "react";
import { User, UseUserManagementReturn } from "../types";
import { ITEMS_PER_PAGE } from "../constants";
import { usePagination } from "@/shared/hooks";
import { useAdminList } from "./use-admin-list";
import { useCreateUser, useDeleteUsers } from "./use-user-mutations";
import { addNumberToUsers, filterUsersByRole, searchUsers } from "../utils";

// 사용자 관리 훅
export const useUserManagement = (): UseUserManagementReturn => {
  // API 훅 사용
  const { data: adminData, isLoading, error, refetch } = useAdminList();
  const createUserMutation = useCreateUser();
  const deleteUsersMutation = useDeleteUsers();

  // 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<User[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // API 응답에서 사용자 데이터 추출
  const allUsers = React.useMemo(() => {
    if (!adminData) return [];

    // 새로운 API 응답 형태: { success, message, data: { count, page, page_size, total_pages, results } }
    if (adminData.data && adminData.data.results && Array.isArray(adminData.data.results)) {
      return adminData.data.results as User[];
    }

    return [];
  }, [adminData]);

  // 검색 및 필터링된 데이터
  const filteredData = React.useMemo(() => {
    let filtered = allUsers;

    // 검색 필터링
    if (searchTerm) {
      filtered = searchUsers(filtered, searchTerm);
    }

    // 역할 필터링
    if (roleFilter) {
      filtered = filterUsersByRole(filtered, roleFilter);
    }

    return filtered;
  }, [allUsers, searchTerm, roleFilter]);

  // 페이지네이션
  const {
    currentPage: paginationPage,
    totalPages,
    currentData,
    handlePageChange,
  } = usePagination({
    data: filteredData,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = React.useMemo(() => {
    return addNumberToUsers(currentData, paginationPage, ITEMS_PER_PAGE);
  }, [currentData, paginationPage]);

  // 액션 핸들러들
  const handleUpdateSelection = React.useCallback(
    (keys: string[], rows: User[]) => {
      // 빈 행은 선택에서 제외
      const validSelectedRows = rows.filter((row) => row.id && !row.isEmpty);
      const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

      setSelectedRowKeys(validSelectedRowKeys);
      setSelectedRows(validSelectedRows);
    },
    []
  );

  // 여러 사용자 삭제 처리
  const handleDeleteUsers = React.useCallback(async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await deleteUsersMutation.mutateAsync();

      // 선택 상태 초기화
      setSelectedRowKeys([]);
      setSelectedRows([]);
    } catch (error) {
      console.error("사용자 삭제 중 오류:", error);
      // 에러 처리 (토스트 메시지 등)
    }
  }, [selectedRowKeys, deleteUsersMutation]);

  const handleCreateUser = React.useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleSubmitUser = React.useCallback(async () => {
    try {
      await createUserMutation.mutateAsync();

      // 모달 닫기
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("사용자 생성 중 오류:", error);
      // 에러 처리 (토스트 메시지 등)
    }
  }, [createUserMutation]);

  const handleRowClick = React.useCallback((user: User) => {
    if (user.isEmpty) return;

    // 사용자 상세 페이지로 이동
    window.location.href = `/users/${user.id}`;
  }, []);

  // 로딩 상태나 에러 상태 처리
  React.useEffect(() => {
    if (error) {
      console.error("관리자 목록 조회 중 오류:", error);
    }
  }, [error]);

  return {
    // 데이터
    currentData: paginatedData,
    filteredData,

    // 상태
    selectedRowKeys,
    selectedRows,
    isDeleting: deleteUsersMutation.isPending,
    searchTerm,
    roleFilter,
    currentPage: paginationPage,

    // 모달 상태
    isCreateModalOpen,
    isCreating: createUserMutation.isPending,

    // 페이지네이션
    totalPages,
    handlePageChange,

    // 액션
    handleUpdateSelection,
    handleDeleteUsers,
    handleCreateUser,
    handleCloseModal,
    handleSubmitUser,
    handleRowClick,
    setSearchTerm,
    setRoleFilter,

    // 추가 상태들 (디버깅용)
    isLoading,
    error,
    refetch,
  };
};
