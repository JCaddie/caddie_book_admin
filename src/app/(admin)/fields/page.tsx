"use client";

import {
  FieldActionBar,
  fieldColumns,
  useFieldManagement,
} from "@/modules/field";
import {
  SelectableDataTable,
  Pagination,
  ConfirmationModal,
} from "@/shared/components/ui";
import { usePagination, useDocumentTitle } from "@/shared/hooks";
import { FieldTableRow } from "@/modules/field/types/field";
import { Column } from "@/shared/types/table";

const FieldsPage: React.FC = () => {
  // 페이지 타이틀 설정
  useDocumentTitle({ title: "필드 리스트" });

  const {
    fields,
    selectedRowKeys,
    totalCount,
    searchTerm,
    handleSearchChange,
    handleSelectionChange,
    isDeleteModalOpen,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCreateField,
    handleRowClick,
  } = useFieldManagement();

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: fields,
      itemsPerPage: 10,
    });

  const handleRowClickWrapper = (record: Record<string, unknown>) => {
    handleRowClick(record as FieldTableRow);
  };

  const handleSelectionChangeWrapper = (selectedRowKeys: string[]) => {
    handleSelectionChange(selectedRowKeys);
  };

  return (
    <div className="bg-white rounded-xl space-y-10 p-8">
      {/* 페이지 헤더 */}
      <div className="px-4">
        <h1 className="text-2xl font-bold text-black">필드 리스트</h1>
      </div>

      {/* 액션 바 */}
      <FieldActionBar
        totalCount={totalCount}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onDeleteClick={handleDeleteClick}
        onCreateClick={handleCreateField}
        selectedCount={selectedRowKeys.length}
      />

      {/* 테이블 */}
      <div className="space-y-6">
        <SelectableDataTable
          columns={fieldColumns as Column<Record<string, unknown>>[]}
          data={currentData as Record<string, unknown>[]}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectionChangeWrapper}
          onRowClick={handleRowClickWrapper}
          emptyText="검색된 결과가 없습니다."
          layout="flexible"
          realDataCount={fields.length}
        />

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="선택한 필드를 삭제할까요?"
        message={`${selectedRowKeys.length}개의 필드가 삭제됩니다. 삭제 시 복원이 불가합니다.`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FieldsPage;
