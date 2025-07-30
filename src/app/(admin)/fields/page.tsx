"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import {
  FIELD_CONSTANTS,
  FieldActionBar,
  FieldCreateModal,
  FieldTableRow,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";
import { useFieldColumns } from "@/modules/field/components/field-columns";
import { useFieldListPage } from "@/modules/field/hooks/use-field-list-page";
import RoleGuard from "@/shared/components/auth/role-guard";

export default function FieldsPage() {
  useDocumentTitle({ title: "필드 관리" });
  const columns = useFieldColumns();
  const {
    data,
    tableData,
    selectedRowKeys,
    isDeleteModalOpen,
    isCreateModalOpen,
    deleteFieldsBulkMutation,
    createFieldMutation,
    handleSelectChange,
    handleRowClick,
    handleCreateClick,
    handleCreateModalClose,
    handleCreateSubmit,
    handleDeleteClick,
    handleConfirmDelete,
  } = useFieldListPage();

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="필드 관리" />

        <FieldActionBar
          totalCount={data?.count ?? 0}
          selectedCount={selectedRowKeys.length}
          onDeleteClick={handleDeleteClick}
          onCreateClick={handleCreateClick}
        />

        <div className="space-y-6">
          <SelectableDataTable<FieldTableRow>
            columns={columns}
            data={tableData}
            selectable
            selectedRowKeys={selectedRowKeys}
            onSelectChange={handleSelectChange}
            realDataCount={tableData.length}
            containerWidth="auto"
            layout="flexible"
            className="border-gray-200"
            onRowClick={handleRowClick}
            rowKey="id"
          />

          <Pagination totalPages={data?.total_pages ? data.total_pages : 1} />
        </div>

        {/* 삭제 확인 모달 */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => handleDeleteClick()}
          onConfirm={handleConfirmDelete}
          title={FIELD_CONSTANTS.UI_TEXT.DELETE_TITLE}
          message={`선택한 ${selectedRowKeys.length}${FIELD_CONSTANTS.UI_TEXT.DELETE_MESSAGE}`}
          confirmText="삭제"
          cancelText="취소"
          isLoading={deleteFieldsBulkMutation.isPending}
        />

        {/* 필드 생성 모달 */}
        <FieldCreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onSubmit={handleCreateSubmit}
          isLoading={createFieldMutation.isPending}
        />
      </div>
    </RoleGuard>
  );
}
