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
  fieldColumns,
  useDeleteField,
  useFieldList,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";
import { FieldTableRow } from "@/modules/field/types";
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
  const { data } = useFieldList(currentPage, searchTerm);
  const columns = fieldColumns();

  React.useEffect(() => {
    if (data) {
      // 필드 리스트 데이터 콘솔 출력
      console.log("[필드 리스트 데이터]", data);
    }
  }, [data]);

  // row 클릭 시 상세화면 이동
  const handleRowClick = (row: FieldTableRow) => {
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
  const tableData: FieldTableRow[] = (data?.data ?? []).map((item, idx) => ({
    ...item,
    no:
      data && data.page && data.limit
        ? (data.page - 1) * data.limit + idx + 1
        : idx + 1,
  }));

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="필드 관리" />

      <FieldActionBar
        totalCount={data?.total ?? 0}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDeleteClick={handleDeleteClick}
        onCreateClick={() => router.push("/fields/new")}
      />

      <div className="space-y-6">
        <SelectableDataTable<FieldTableRow>
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

        <Pagination
          totalPages={
            data?.total ? Math.ceil(data.total / (data.limit || 20)) : 1
          }
        />
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
