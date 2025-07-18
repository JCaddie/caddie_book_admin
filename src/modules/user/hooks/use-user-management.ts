import React from "react";
import { User, UseUserManagementReturn } from "../types";
import { ITEMS_PER_PAGE } from "../constants";
import { usePagination } from "@/shared/hooks";
import { useAdminList } from "./use-admin-list";
import { useCreateUser, useDeleteUsers } from "./use-user-mutations";

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

  // API 응답에서 사용자 데이터 추출 (fallback으로 빈 배열 사용)
  const allUsers = React.useMemo(() => {
    if (!adminData) return [];

    // API 응답 형태: { success, message, count, page, page_size, total_pages, results }
    if (adminData.results && Array.isArray(adminData.results)) {
      return adminData.results;
    }

    return [];
  }, [adminData]);

  // 필터링된 데이터
  const filteredData = React.useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.golf_course_name &&
          user.golf_course_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
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
    const startIndex = (paginationPage - 1) * ITEMS_PER_PAGE;
    return currentData.map((user, index) => ({
      ...user,
      no: startIndex + index + 1, // 페이지네이션을 고려한 번호 계산
    }));
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
      await deleteUsersMutation.mutateAsync(selectedRowKeys);

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

  const handleSubmitUser = React.useCallback(
    async (userData: {
      username: string;
      password: string;
      password_confirm: string;
      name: string;
      phone: string;
      email: string;
      golf_course_id: string;
    }) => {
      try {
        await createUserMutation.mutateAsync(userData);

        // 모달 닫기
        setIsCreateModalOpen(false);
      } catch (error) {
        console.error("사용자 생성 중 오류:", error);
        // 에러 처리 (토스트 메시지 등)
      }
    },
    [createUserMutation]
  );

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
