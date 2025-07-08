"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SelectableDataTable,
  Pagination,
  DeleteConfirmationModal,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useCaddieList } from "@/shared/hooks";
import { CaddieFilterBar } from "@/modules/caddie/components";
import { CADDIE_COLUMNS } from "@/shared/constants/caddie";
import { Caddie } from "@/shared/types/caddie";

const CaddieListPage: React.FC = () => {
  const router = useRouter();

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 캐디 리스트 상태 관리
  const {
    filteredCaddies,
    paddedData,
    realDataCount,
    filters,
    updateSearchTerm,
    updateSelectedGroup,
    updateSelectedSpecialTeam,
    selection,
    updateSelection,
    deleteSelectedItems,
    canDelete,
    selectedCount,
    currentPage,
    totalPages,
    handlePageChange,
  } = useCaddieList();

  // 행 클릭 핸들러 (상세 페이지로 이동)
  const handleRowClick = (caddie: Caddie) => {
    router.push(`/caddies/${caddie.id}`);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (canDelete) {
      setIsDeleteModalOpen(true);
    }
  };

  // 삭제 확인 핸들러
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteSelectedItems();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 취소 핸들러
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="캐디" />

      <CaddieFilterBar
        totalCount={filteredCaddies.length}
        selectedCount={selectedCount}
        filters={filters}
        onSearchChange={updateSearchTerm}
        onGroupChange={updateSelectedGroup}
        onSpecialTeamChange={updateSelectedSpecialTeam}
        onDeleteSelected={handleDeleteClick}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={CADDIE_COLUMNS}
          data={paddedData}
          realDataCount={realDataCount}
          selectable={true}
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={updateSelection}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="삭제할까요?"
        message={`선택한 ${selectedCount}개의 캐디를 삭제합니다. 삭제 시 복원이 불가합니다.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CaddieListPage;
