"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { SelectableDataTable, ConfirmationModal } from "@/shared/components/ui";
import {
  FieldActionBar,
  fieldColumns,
  useFieldManagement,
  FIELD_CONSTANTS,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";

export default function FieldsPage() {
  useDocumentTitle({ title: "필드 관리" });

  const {
    // 데이터
    paddedData,
    realDataCount,
    totalCount,

    // 필터 상태
    filters,
    updateSearchTerm,

    // 선택 상태
    selection,
    updateSelection,
    canDelete,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 액션
    addField,
    openDeleteModal,
    closeDeleteModal,
    deleteSelectedFields,

    // 모달 상태
    isDeleteModalOpen,
    isDeleting,
  } = useFieldManagement();

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="필드 관리" />

      <FieldActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRows.length}
        canDelete={canDelete}
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        onDeleteClick={openDeleteModal}
        onCreateClick={addField}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={fieldColumns}
          data={paddedData}
          selectable
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={updateSelection}
          realDataCount={realDataCount}
          containerWidth="auto"
          layout="flexible"
          className="border-gray-200"
        />

        {/* 페이지네이션 */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              이전
            </button>

            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteSelectedFields}
        title={FIELD_CONSTANTS.UI_TEXT.DELETE_TITLE}
        message={`선택한 ${selection.selectedRows.length}${FIELD_CONSTANTS.UI_TEXT.DELETE_MESSAGE}`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
}
