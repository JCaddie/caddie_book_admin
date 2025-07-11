import React from "react";
import { User, UseUserManagementReturn } from "../types";
import { mockUsers } from "../utils";
import { ITEMS_PER_PAGE } from "../constants";
import { usePagination } from "@/shared/hooks";

// 사용자 관리 훅
export const useUserManagement = (): UseUserManagementReturn => {
  // 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<User[]>([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // 필터링된 데이터
  const filteredData = React.useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

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

  // 사용자 삭제 처리
  const handleDeleteUsers = React.useCallback(async () => {
    if (selectedRowKeys.length === 0) return;

    setIsDeleting(true);

    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: 실제 삭제 API 호출
      if (process.env.NODE_ENV === "development") {
        console.log("사용자 삭제:", selectedRowKeys);
      }

      // 선택 상태 초기화
      setSelectedRowKeys([]);
      setSelectedRows([]);
    } catch (error) {
      console.error("사용자 삭제 중 오류:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys]);

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
      name: string;
      phone: string;
      email: string;
    }) => {
      setIsCreating(true);

      try {
        // 실제로는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: 실제 생성 API 호출
        if (process.env.NODE_ENV === "development") {
          console.log("사용자 생성:", userData);
        }

        // 모달 닫기
        setIsCreateModalOpen(false);
      } catch (error) {
        console.error("사용자 생성 중 오류:", error);
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const handleRowClick = React.useCallback((user: User) => {
    if (user.isEmpty) return;

    // 사용자 상세 페이지로 이동
    window.location.href = `/users/${user.id}`;
  }, []);

  return {
    // 데이터
    currentData: paginatedData,
    filteredData,

    // 상태
    selectedRowKeys,
    selectedRows,
    isDeleting,
    searchTerm,
    roleFilter,
    currentPage: paginationPage,

    // 모달 상태
    isCreateModalOpen,
    isCreating,

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
  };
};
