"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { ConfirmationModal, Pagination } from "@/shared/components/ui";
import { PAGE_TITLES, useDocumentTitle } from "@/shared/hooks";
import { Work } from "@/modules/work/types";
import {
  useWorksData,
  useWorksDelete,
  useWorksSelection,
} from "@/modules/work/hooks";
import { WorksActionBar, WorksTable } from "@/modules/work/components";

const WorksPage: React.FC = () => {
  const router = useRouter();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: PAGE_TITLES.WORKS });

  // 커스텀 훅들 사용
  const {
    worksList,
    setWorksList,
    filteredWorks,
    currentData,
    totalPages,
    isLoading,
    error,
    refetch,
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

  // 행 클릭 핸들러 - 디테일 페이지로 이동
  const handleRowClick = (work: Work) => {
    if (work.isEmpty) {
      return;
    }

    // 날짜가 있는 경우에만 날짜 파라미터 추가
    let dateParam = "";
    if (work.date && work.date !== "미정") {
      // "YYYY.MM.DD" 형식을 "YYYY-MM-DD" 형식으로 변환
      const formattedDate = work.date
        .replace(/\s+/g, "") // 모든 공백 제거
        .replace(/\./g, "-") // 점을 하이픈으로 변환
        .replace(/-+$/, ""); // 끝에 있는 하이픈 제거
      dateParam = `?date=${formattedDate}`;
    }

    router.push(`/works/${work.golfCourseId}${dateParam}`);
  };

  // 생성 핸들러 - 생성 페이지로 이동
  const handleCreate = () => {
    router.push("/works/create");
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
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            <p>데이터 로딩에 실패했습니다.</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      {!isLoading && !error && (
        <WorksTable
          data={currentData}
          onRowClick={handleRowClick}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          totalCount={filteredWorks.length}
        />
      )}

      {/* 페이지네이션 */}
      {!isLoading && !error && <Pagination totalPages={totalPages} />}

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
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
