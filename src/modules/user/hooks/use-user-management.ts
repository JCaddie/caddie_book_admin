import React from "react";
import { User, UseUserManagementReturn } from "../types";
import { ITEMS_PER_PAGE } from "../constants";
import { useAdminList } from "./use-admin-list";
import { useCreateUser, useDeleteUsers } from "./use-user-mutations";
import { addNumberToUsers } from "../utils";
import { useUserUrlParams } from "./use-user-url-params";

// 사용자 관리 훅
export const useUserManagement = (): UseUserManagementReturn => {
  // URL 파라미터 관리
  const { params, setSearch, setRole, setPage } = useUserUrlParams();
  const { search: searchTerm, role: roleFilter, page: urlPage } = params;

  // API 훅 사용 (URL 파라미터 기반)
  const { data: adminData, isLoading, error, refetch } = useAdminList({
    search: searchTerm || undefined,
    role: roleFilter || undefined,
    page: urlPage,
    page_size: ITEMS_PER_PAGE,
  });

  const createUserMutation = useCreateUser();
  const deleteUsersMutation = useDeleteUsers();

  // 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<User[]>([]);
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

  // 서버에서 이미 필터링된 데이터이므로 추가 필터링 불필요
  const filteredData = allUsers;

  // 페이지네이션 정보 (서버에서 제공)
  const totalPages = adminData?.data?.total_pages || 1;
  const currentPage = adminData?.data?.page || 1;
  const totalCount = adminData?.data?.count || 0;

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = React.useMemo(() => {
    return addNumberToUsers(filteredData, currentPage, ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = React.useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

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
      
      // 데이터 새로고침
      refetch();
    } catch (error) {
      console.error("사용자 삭제 중 오류:", error);
      // 에러 처리 (토스트 메시지 등)
    }
  }, [selectedRowKeys, deleteUsersMutation, refetch]);

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
      
      // 데이터 새로고침
      refetch();
    } catch (error) {
      console.error("사용자 생성 중 오류:", error);
      // 에러 처리 (토스트 메시지 등)
    }
  }, [createUserMutation, refetch]);

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
    currentPage,
    totalCount,

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
    setSearchTerm: setSearch,
    setRoleFilter: setRole,

    // 추가 상태들 (디버깅용)
    isLoading,
    error,
    refetch,
  };
};
