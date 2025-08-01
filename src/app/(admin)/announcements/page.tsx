"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { Pagination, SelectableDataTable } from "@/shared/components/ui";
import { useAnnouncementList } from "@/modules/announcement/hooks";
import {
  AnnouncementActionBar,
  AnnouncementCreateModal,
  useAnnouncementColumns,
} from "@/modules/announcement/components";
import { Announcement, AnnouncementWithNo } from "@/modules/announcement/types";
import { isValidAnnouncement } from "@/modules/announcement/utils";
import { createAnnouncement } from "@/modules/announcement/api/announcement-api";

const AnnouncementsPage: React.FC = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 컬럼 정의 (메모이제이션)
  const columns = useAnnouncementColumns();

  // 공지사항 리스트 데이터 및 로직
  const {
    data,
    totalCount,
    realDataCount,
    totalPages,
    selection,
    updateSelection,
    deleteSelectedAnnouncements,
    isDeleting,
    error,
    clearError,
    refetch,
  } = useAnnouncementList();

  // 새 공지사항 생성 모달 열기
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  // 공지사항 생성 처리
  const handleCreateAnnouncement = async (
    data: Omit<
      Announcement,
      "id" | "createdAt" | "updatedAt" | "views" | "files"
    >
  ) => {
    try {
      await createAnnouncement({
        title: data.title,
        content: data.content,
        announcementType: data.announcementType,
        isPublished: data.isPublished,
      });
      // 생성 후 목록 새로고침
      await refetch();
    } catch (error) {
      console.error("공지사항 생성 실패:", error);
      throw error;
    }
  };

  // 공지사항 상세 페이지로 이동
  const handleRowClick = (announcement: AnnouncementWithNo) => {
    // 유효한 공지사항인 경우에만 상세 페이지로 이동
    if (isValidAnnouncement(announcement)) {
      router.push(`/announcements/${announcement.id}`);
    }
  };

  // 선택 상태 변경 핸들러
  const handleSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: AnnouncementWithNo[]
  ) => {
    // 유효한 행만 선택에 포함
    const validSelectedRows = selectedRows.filter(isValidAnnouncement);
    const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

    updateSelection(validSelectedRowKeys, validSelectedRows);
  };

  // 에러 메시지 닫기
  const handleErrorClose = () => {
    clearError();
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="공지사항" />

      <AnnouncementActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRowKeys.length}
        onDeleteSelected={deleteSelectedAnnouncements}
        onCreateNew={handleCreateNew}
        isDeleting={isDeleting}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={handleErrorClose}
              className="text-red-500 hover:text-red-700 ml-4"
              aria-label="에러 메시지 닫기"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <SelectableDataTable<AnnouncementWithNo>
          columns={columns}
          data={data}
          selectable={true}
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={handleSelectionChange}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
          containerWidth="auto"
          realDataCount={realDataCount}
          emptyText="공지사항이 없습니다"
          className="border-gray-200"
        />

        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>

      {/* 공지사항 생성 모달 */}
      <AnnouncementCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAnnouncement}
        isLoading={false}
      />
    </div>
  );
};

export default AnnouncementsPage;
