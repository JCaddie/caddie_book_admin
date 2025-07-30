import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FieldTableRow,
  useDeleteFieldsBulk,
  useFieldList,
  useCreateField,
} from "@/modules/field";
import { transformFieldsToTableRows } from "@/modules/field/utils";
import { FieldFormData } from "@/modules/field/types";

export function useFieldListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 선택 상태
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 삭제 모달/로딩 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteFieldsBulkMutation = useDeleteFieldsBulk();

  // 생성 모달 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createFieldMutation = useCreateField();

  // search 파라미터를 URL에서 읽어옴
  const searchParamValue = searchParams.get("search") || "";
  // 검색 input의 상태는 별도로 관리
  const [searchInput, setSearchInput] = useState(searchParamValue);
  // 데이터 fetch는 URL 파라미터 기준
  const queryResult = useFieldList(currentPage, searchParamValue);
  const apiResponse = queryResult.data;
  const data = apiResponse?.data; // API 응답의 data 필드에서 실제 데이터 추출

  // 테이블 데이터 변환
  const tableData: FieldTableRow[] = data
    ? transformFieldsToTableRows(data.results, data.page, data.page_size)
    : [];

  // row 클릭 시 상세화면 이동
  const handleRowClick = useCallback(
    (row: FieldTableRow) => {
      if (row && row.id && row.id !== "new") {
        router.push(`/fields/${row.id}`);
      }
    },
    [router]
  );

  // 생성 버튼 클릭
  const handleCreateClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // 생성 모달 닫기
  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  // 필드 생성 제출
  const handleCreateSubmit = useCallback(
    async (formData: FieldFormData) => {
      try {
        await createFieldMutation.mutateAsync(formData);
        setIsCreateModalOpen(false);
        queryResult.refetch(); // 목록 새로고침
      } catch (error) {
        console.error("필드 생성 실패:", error);
        throw error; // 모달에서 에러 처리
      }
    },
    [createFieldMutation, queryResult]
  );

  // 검색어 변경
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  // 검색 버튼 클릭 또는 엔터 시 URL 파라미터 변경
  const handleSearchSubmit = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/fields?${params.toString()}`);
    setCurrentPage(1);
  }, [router, searchInput, searchParams]);

  // 선택 변경
  const handleSelectChange = useCallback((keys: string[]) => {
    setSelectedRowKeys(keys);
  }, []);

  // 삭제 버튼 클릭
  const handleDeleteClick = useCallback(() => {
    if (selectedRowKeys.length > 0) setIsDeleteModalOpen(true);
  }, [selectedRowKeys]);

  // 삭제 확인
  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      // 일괄 삭제 API 사용
      await deleteFieldsBulkMutation.mutateAsync(selectedRowKeys);
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      queryResult.refetch();
    } catch {
      // 에러 처리 필요시 추가
    }
  }, [selectedRowKeys, deleteFieldsBulkMutation, queryResult]);

  return {
    currentPage,
    setCurrentPage,
    selectedRowKeys,
    setSelectedRowKeys,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteFieldsBulkMutation,
    isCreateModalOpen,
    createFieldMutation,
    searchInput,
    setSearchInput,
    queryResult,
    data,
    tableData,
    handleRowClick,
    handleCreateClick,
    handleCreateModalClose,
    handleCreateSubmit,
    handleSearchChange,
    handleSearchSubmit,
    handleSelectChange,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
