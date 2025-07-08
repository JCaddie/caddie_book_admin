"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { DeleteConfirmationModal } from "@/shared/components/ui";
import { usePagination } from "@/shared/hooks";
import { Work } from "@/modules/work/types";
import { WORKS_PAGE_SIZE } from "@/modules/work/constants";
import {
  useWorksData,
  useWorksSelection,
  useWorksDelete,
} from "@/modules/work/hooks";
import {
  WorksActionBar,
  WorksTable,
  WorksPagination,
} from "@/modules/work/components";

const WorksPage: React.FC = () => {
  // 커스텀 훅들 사용
  const {
    worksList,
    setWorksList,
    searchTerm,
    filteredWorks,
    handleSearchChange,
  } = useWorksData();

  const { selectedRowKeys, selectedRows, handleSelectChange, clearSelection } =
    useWorksSelection();

  const {
    isDeleteModalOpen,
    isDeleting,
    handleDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
  } = useWorksDelete(selectedRowKeys);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredWorks,
      itemsPerPage: WORKS_PAGE_SIZE,
    });

  // 행 클릭 핸들러
  const handleRowClick = (work: Work) => {
    if ((work as Work & { isEmpty?: boolean }).isEmpty) {
      return;
    }
    console.log("근무 스케줄 상세:", work);
  };

  // 생성 핸들러
  const handleCreate = () => {
    console.log("근무 스케줄 생성");
    // 생성 페이지로 이동하거나 모달 열기
  };

  // 삭제 확인 핸들러
  const handleConfirmDeleteWrapper = () => {
    handleConfirmDelete(
      selectedRowKeys,
      selectedRows,
      worksList,
      setWorksList,
      clearSelection
    );
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="근무" />

      {/* 상단 액션 바 */}
      <WorksActionBar
        totalCount={filteredWorks.length}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* 테이블 */}
      <WorksTable
        data={currentData}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={handleSelectChange}
        onRowClick={handleRowClick}
        totalCount={filteredWorks.length}
      />

      {/* 페이지네이션 */}
      <WorksPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteWrapper}
        title="삭제할까요?"
        message={`선택한 ${selectedRowKeys.length}개의 근무 스케줄을 삭제하시겠습니까?\n삭제 시 복원이 불가합니다.`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default WorksPage;
