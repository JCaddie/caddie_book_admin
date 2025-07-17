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
  fieldColumns,
  useFieldManagement,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";
import { FieldTableRow } from "@/modules/field/types";
import { useRouter } from "next/navigation";

export default function FieldsPage() {
  useDocumentTitle({ title: "필드 관리" });

  const router = useRouter();

  const {
    // 데이터
    currentData,
    realDataCount,
    totalCount,

    // 필터 상태
    filters,
    updateSearchTerm,

    // 선택 상태
    selection,
    updateSelection,

    // 페이지네이션
    totalPages,

    // 액션
    openDeleteModal,
    closeDeleteModal,
    deleteSelectedFields,

    // 모달 상태
    isDeleteModalOpen,
    isDeleting,
  } = useFieldManagement();

  // 테이블 컬럼 생성
  const columns = fieldColumns();

  // row 클릭 시 상세화면 이동
  const handleRowClick = (row: FieldTableRow) => {
    if (row && row.id) {
      router.push(`/fields/${row.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="필드 관리" />

      <FieldActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRows.length}
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        onDeleteClick={openDeleteModal}
        onCreateClick={() => router.push("/fields/new")}
      />

      <div className="space-y-6">
        <SelectableDataTable<FieldTableRow>
          columns={columns}
          data={currentData}
          selectable
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={updateSelection}
          realDataCount={realDataCount}
          containerWidth="auto"
          layout="flexible"
          className="border-gray-200"
          onRowClick={handleRowClick}
        />

        <Pagination totalPages={totalPages} />
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
