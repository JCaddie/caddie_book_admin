"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { SelectableDataTable, Pagination } from "@/shared/components/ui";
import { useAnnouncementList } from "@/modules/announcement/hooks";
import {
  useAnnouncementColumns,
  AnnouncementActionBar,
} from "@/modules/announcement/components";
import { Announcement } from "@/modules/announcement/types";

type AnnouncementWithNo = Announcement & { no: number } & Record<
    string,
    unknown
  >;

const AnnouncementsPage: React.FC = () => {
  const router = useRouter();

  // 컬럼 정의 (메모이제이션)
  const columns = useAnnouncementColumns();

  // 공지사항 리스트 데이터 및 로직
  const {
    data,
    totalCount,
    realDataCount,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    updateSearchTerm,
    selection,
    updateSelection,
    deleteSelectedAnnouncements,
    isDeleting,
    error,
  } = useAnnouncementList();

  // 새 공지사항 생성 페이지로 이동
  const handleCreateNew = () => {
    router.push("/announcements/new");
  };

  // 공지사항 상세 페이지로 이동
  const handleRowClick = (announcement: AnnouncementWithNo) => {
    // 빈 행이 아닌 경우에만 상세 페이지로 이동
    if (announcement.id && !announcement.id.startsWith("empty")) {
      router.push(`/announcements/${announcement.id}`);
    }
  };

  // 선택 상태 변경 핸들러
  const handleSelectionChange = (
    selectedRowKeys: string[],
    selectedRows: AnnouncementWithNo[]
  ) => {
    // 빈 행은 선택에서 제외
    const validSelectedRows = selectedRows.filter(
      (row) => row.id && !row.id.startsWith("empty")
    );
    const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

    updateSelection(validSelectedRowKeys, validSelectedRows);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="공지사항" />

      <AnnouncementActionBar
        totalCount={totalCount}
        selectedCount={selection.selectedRowKeys.length}
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        onDeleteSelected={deleteSelectedAnnouncements}
        onCreateNew={handleCreateNew}
        isDeleting={isDeleting}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <SelectableDataTable<AnnouncementWithNo>
          columns={columns}
          data={data as AnnouncementWithNo[]}
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
