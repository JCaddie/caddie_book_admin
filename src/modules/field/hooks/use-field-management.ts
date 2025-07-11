import { useState, useMemo } from "react";
import { FieldTableRow, FieldFilters, FieldSelection } from "../types";
import { usePagination } from "@/shared/hooks";
import { FIELD_CONSTANTS } from "../constants";
import {
  generateSampleFieldData,
  filterFields,
  createNewField,
  simulateApiDelay,
} from "../utils";

export const useFieldManagement = () => {
  // 필터 상태
  const [filters, setFilters] = useState<FieldFilters>({
    searchTerm: "",
  });

  // 선택 상태
  const [selection, setSelection] = useState<FieldSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 삭제 확인 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 삭제 로딩 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 샘플 데이터 (memoized)
  const allFields = useMemo(() => generateSampleFieldData(), []);

  // 필터링된 데이터
  const filteredFields = useMemo(
    () => filterFields(allFields, filters.searchTerm),
    [allFields, filters.searchTerm]
  );

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredFields,
      itemsPerPage: FIELD_CONSTANTS.ITEMS_PER_PAGE,
    });

  // 필터 업데이트 함수
  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  // 선택 상태 업데이트
  const updateSelection = (
    selectedRowKeys: string[],
    selectedRows: FieldTableRow[]
  ) => {
    setSelection({ selectedRowKeys, selectedRows });
  };

  // 새 필드 추가
  const addField = () => {
    const newField = createNewField(allFields.length);

    // TODO: 실제 구현에서는 API 호출
    if (process.env.NODE_ENV === "development") {
      console.log("새 필드 추가:", newField);
    }
  };

  // 삭제 확인 모달 관리
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // 선택된 필드 삭제
  const deleteSelectedFields = async () => {
    setIsDeleting(true);

    try {
      await simulateApiDelay();

      // TODO: 실제 구현에서는 API 호출
      if (process.env.NODE_ENV === "development") {
        console.log("삭제할 필드들:", selection.selectedRows);
      }

      // 선택 상태 초기화
      setSelection({ selectedRowKeys: [], selectedRows: [] });

      // 모달 닫기
      closeDeleteModal();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 계산된 값들
  const canDelete = selection.selectedRows.length > 0;
  const totalCount = filteredFields.length;
  const realDataCount = currentData.length;

  return {
    // 데이터
    filteredFields,
    currentData,
    realDataCount,
    totalCount,

    // 필터 상태
    filters,
    updateSearchTerm,

    // 선택 상태
    selection,
    updateSelection,
    canDelete,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 액션
    addField,
    openDeleteModal,
    closeDeleteModal,
    deleteSelectedFields,

    // 모달 상태
    isDeleteModalOpen,
    isDeleting,
  };
};
