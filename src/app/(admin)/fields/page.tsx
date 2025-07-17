"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  ConfirmationModal,
  Pagination,
  SelectableDataTable,
} from "@/shared/components/ui";
import {
  FIELD_CONSTANTS,
  FieldActionBar,
  FieldListItem,
  useDeleteField,
  useFieldList,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";
import { useRouter } from "next/navigation";

export default function FieldsPage() {
  useDocumentTitle({ title: "필드 관리" });
  const router = useRouter();

  // 검색어, 페이지네이션 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 삭제 모달/로딩 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteFieldMutation = useDeleteField();

  // 데이터 fetch
  // 타입 임시 우회 (API 구조와 타입 불일치로 인한 에러 방지)
  const queryResult = useFieldList(currentPage, searchTerm);
  const data = queryResult.data;
  // FieldListItem에 맞는 컬럼 정의 (필요시 직접 정의)
  const columns: import("@/shared/types/table").Column<FieldListItem>[] = [
    { key: "name", title: "필드명", width: 200 },
    { key: "golf_course_name", title: "골프장", width: 200 },
    {
      key: "is_active",
      title: "활성여부",
      width: 120,
      render: (value) => (value ? "활성" : "비활성"),
    },
  ];

  React.useEffect(() => {
    if (data) {
      // 필드 리스트 데이터 콘솔 출력
      console.log("[필드 리스트 데이터]", data);
    }
  }, [data]);

  // row 클릭 시 상세화면 이동
  const handleRowClick = (row: FieldListItem) => {
    if (row && row.id) {
      router.push(`/fields/${row.id}`);
    }
  };

  // 검색어 변경
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 선택 변경
  const handleSelectChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = () => {
    if (selectedRowKeys.length > 0) setIsDeleteModalOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await Promise.all(
        selectedRowKeys.map((id) => deleteFieldMutation.mutateAsync(id))
      );
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
    } catch {
      // 에러 처리 필요시 추가
    }
  };

  // 데이터 변환 (API 응답 -> 테이블 row)
  // FieldListItem에 인덱스 시그니처 추가 (for DataTable)
  const tableData: (FieldListItem & Record<string, unknown>)[] = (
    data?.results ?? []
  ).map((item, idx) => ({
    ...item,
    no:
      data && data.page && data.page_size
        ? (data.page - 1) * data.page_size + idx + 1
        : idx + 1,
  }));

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="필드 관리" />

      <FieldActionBar
        totalCount={data?.count ?? 0}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDeleteClick={handleDeleteClick}
        onCreateClick={() => router.push("/fields/new")}
      />

      <div className="space-y-6">
        <SelectableDataTable<FieldListItem>
          columns={columns}
          data={tableData}
          selectable
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          realDataCount={tableData.length}
          containerWidth="auto"
          layout="flexible"
          className="border-gray-200"
          onRowClick={handleRowClick}
          rowKey={(record) => String(record.id)}
        />

        <Pagination totalPages={data?.total_pages ? data.total_pages : 1} />
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={FIELD_CONSTANTS.UI_TEXT.DELETE_TITLE}
        message={`선택한 ${selectedRowKeys.length}${FIELD_CONSTANTS.UI_TEXT.DELETE_MESSAGE}`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={deleteFieldMutation.isPending}
      />
    </div>
  );
}
