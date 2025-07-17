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
  useDeleteField,
  useFieldList,
} from "@/modules/field";
import { useDocumentTitle } from "@/shared/hooks";
import { useRouter, useSearchParams } from "next/navigation";

// 테이블용 필드 아이템 타입 정의 (SelectableDataTable에서 사용)
interface FieldTableItem extends Record<string, unknown> {
  id: string; // 테이블에서는 string id 사용
  name: string;
  golf_course_name: string;
  is_active: boolean;
  no: number;
}

export default function FieldsPage() {
  useDocumentTitle({ title: "필드 관리" });
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지네이션 상태만 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 삭제 모달/로딩 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteFieldMutation = useDeleteField();

  // search 파라미터를 URL에서 읽어옴
  const searchParamValue = searchParams.get("search") || "";
  // 검색 input의 상태는 별도로 관리
  const [searchInput, setSearchInput] = useState(searchParamValue);
  // 데이터 fetch는 URL 파라미터 기준
  const queryResult = useFieldList(currentPage, searchParamValue);
  const data = queryResult.data;

  // FieldTableItem에 맞는 컬럼 정의
  const columns: import("@/shared/types/table").Column<FieldTableItem>[] = [
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
  const handleRowClick = (row: FieldTableItem) => {
    if (row && row.id) {
      router.push(`/fields/${row.id}`);
    }
  };

  // 검색어 변경
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  // 검색 버튼 클릭 또는 엔터 시 URL 파라미터 변경
  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/fields?${params.toString()}`);
    setCurrentPage(1);
  };

  // 선택 변경 - 올바른 타입으로 수정
  const handleSelectChange = (
    keys: string[],
    selectedRows: FieldTableItem[]
  ) => {
    console.log("[선택 변경]", { keys, selectedRows }); // 디버깅용
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
      // Promise.all을 사용하여 모든 삭제 요청을 병렬로 실행
      await Promise.all(
        selectedRowKeys.map((id) => deleteFieldMutation.mutateAsync(id))
      );
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      // 성공 시 데이터 재조회
      queryResult.refetch();
    } catch (error) {
      console.error("[삭제 오류]", error);
      // 에러 처리 필요시 추가
    }
  };

  // API 응답 데이터를 테이블 형식으로 변환
  const tableData: FieldTableItem[] = (data?.results ?? []).map(
    (item, idx) => ({
      id: String(item.id), // number를 string으로 변환
      name: item.name,
      golf_course_name: item.golf_course_name,
      is_active: item.is_active,
      no:
        data && data.page && data.page_size
          ? (data.page - 1) * data.page_size + idx + 1
          : idx + 1,
    })
  );

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="필드 관리" />

      <FieldActionBar
        totalCount={data?.count ?? 0}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchInput}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onDeleteClick={handleDeleteClick}
        onCreateClick={() => router.push("/fields/new")}
      />

      <div className="space-y-6">
        <SelectableDataTable<FieldTableItem>
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
          rowKey="id" // 간단하게 키 이름만 전달
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
