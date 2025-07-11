"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { SelectableDataTable, Pagination } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { useUserManagement } from "@/modules/user/hooks";
import {
  userColumns,
  UserActionBar,
  UserCreateModal,
} from "@/modules/user/components";
import { USER_TABLE_CONFIG } from "@/modules/user/constants";

export default function UsersPage() {
  useDocumentTitle({ title: "사용자 관리" });

  // 사용자 관리 훅 사용
  const {
    // 데이터
    currentData,
    filteredData,

    // 상태
    selectedRowKeys,
    isDeleting,
    searchTerm,
    roleFilter,
    currentPage,

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
  } = useUserManagement();

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="사용자 관리" />

      <UserActionBar
        totalCount={filteredData.length}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onDeleteSelected={handleDeleteUsers}
        onCreateClick={handleCreateUser}
        isDeleting={isDeleting}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={userColumns}
          data={currentData}
          selectable
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleUpdateSelection}
          onRowClick={handleRowClick}
          realDataCount={filteredData.length}
          {...USER_TABLE_CONFIG}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 사용자 생성 모달 */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        isLoading={isCreating}
      />
    </div>
  );
}
