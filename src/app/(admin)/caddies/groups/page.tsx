"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import {
  GroupStatusActionBar,
  useGroupStatusColumns,
} from "@/modules/caddie/components";
import { useGroupStatusManagement } from "@/modules/caddie/hooks";
import { CaddieGroup } from "@/modules/caddie/types";

const GroupStatusPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.GROUP_STATUS });

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 그룹현황 관리 훅
  const {
    filteredGroups,
    currentData,
    realDataCount,
    filters,
    updateSearchTerm,
    updateSelectedGroup,
    selection,
    updateSelection,
    deleteSelectedItems,
    canDelete,
    selectedCount,
    currentPage,
    totalPages,
    handlePageChange,
  } = useGroupStatusManagement();

  // 그룹 테이블 컬럼
  const columns = useGroupStatusColumns();

  // 행 클릭 핸들러 (그룹 상세 페이지로 이동)
  const handleRowClick = (group: CaddieGroup) => {
    router.push(`/caddies/groups/${group.id}`);
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
      <AdminPageHeader title="그룹현황" />

      <GroupStatusActionBar
        totalCount={filteredGroups.length}
        selectedCount={selectedCount}
        filters={filters}
        onSearchChange={updateSearchTerm}
        onGroupChange={updateSelectedGroup}
        onDeleteSelected={handleDeleteClick}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={columns}
          data={currentData}
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="삭제할까요?"
        message={`선택한 ${selectedCount}개의 그룹을 삭제합니다. 삭제 시 복원이 불가합니다.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GroupStatusPage;
