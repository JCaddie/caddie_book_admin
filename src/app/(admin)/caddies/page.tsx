"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { PAGE_TITLES, useCaddieList, useDocumentTitle } from "@/shared/hooks";
import { CADDIE_COLUMNS } from "@/shared/constants/caddie";
import { Caddie } from "@/shared/types/caddie";
import { CaddieFilterBar } from "@/modules/caddie/components";

const CaddieListPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.CADDIES });

  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 캐디 리스트 상태 관리
  const {
    currentData,
    realDataCount,
    totalCount,
    isLoading,
    error,
    filters,
    updateSelectedGroup,
    updateSelectedSpecialTeam,
    updateSelectedGolfCourse,

    selection,
    updateSelection,
    deleteSelectedItems,
    canDelete,
    selectedCount,
    totalPages,
    refreshData,
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

      {/* 에러 상태 표시 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">오류가 발생했습니다</p>
              <p>{error}</p>
            </div>
            <button
              onClick={refreshData}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      <CaddieFilterBar
        totalCount={totalCount}
        selectedCount={selectedCount}
        filters={filters}
        onGroupChange={updateSelectedGroup}
        onSpecialTeamChange={updateSelectedSpecialTeam}
        onGolfCourseChange={updateSelectedGolfCourse}
        onDeleteSelected={handleDeleteClick}
      />

      <div className="space-y-6">
        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">캐디 목록을 불러오는 중...</span>
          </div>
        ) : (
          <SelectableDataTable
            columns={CADDIE_COLUMNS}
            data={currentData}
            realDataCount={realDataCount}
            selectable={true}
            selectedRowKeys={selection.selectedRowKeys}
            onSelectChange={updateSelection}
            onRowClick={handleRowClick}
            rowKey="id"
            layout="flexible"
          />
        )}

        <Pagination totalPages={totalPages} />
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
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
