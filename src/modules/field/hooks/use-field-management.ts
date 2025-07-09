import { useState, useMemo } from "react";
import { FieldTableRow, FieldFilters, FieldSelection } from "../types";
import { usePagination, useTableData } from "@/shared/hooks";

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

  // 샘플 데이터 생성
  const generateSampleData = (): FieldTableRow[] => {
    const sampleData: FieldTableRow[] = [];

    for (let i = 1; i <= 26; i++) {
      sampleData.push({
        id: `field-${i}`,
        no: i,
        fieldName: `${i}번 필드`,
        golfCourse:
          i <= 5
            ? "청담 컨트리클럽"
            : i <= 10
            ? "파인힐 골프장"
            : i <= 15
            ? "그린밸리 CC"
            : i <= 20
            ? "오크우드 골프장"
            : "레이크사이드 CC",
        capacity: Math.floor(Math.random() * 10) + 15,
        cart: Math.floor(Math.random() * 5) + 3 + "대",
        status: i % 7 === 0 ? "정비중" : "운영중",
      });
    }

    return sampleData;
  };

  // 샘플 데이터
  const allFields = useMemo(() => generateSampleData(), []);

  // 필터링된 데이터
  const filteredFields = useMemo(() => {
    return allFields.filter((field) => {
      const matchesSearch =
        field.fieldName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        field.golfCourse
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [allFields, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredFields,
      itemsPerPage: 20,
    });

  // 빈 행 템플릿
  const emptyRowTemplate: Omit<FieldTableRow, "id" | "isEmpty"> = {
    no: 0,
    fieldName: "",
    golfCourse: "",
    capacity: 0,
    cart: "",
    status: "",
  };

  // 빈 행이 추가된 데이터 (20개 고정)
  const { paddedData } = useTableData({
    data: currentData,
    itemsPerPage: 20,
    emptyRowTemplate,
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
    const newField: FieldTableRow = {
      id: `field-${Date.now()}`,
      no: allFields.length + 1,
      fieldName: `${allFields.length + 1}번 필드`,
      golfCourse: "새 골프장",
      capacity: 20,
      cart: "4대",
      status: "운영중",
    };

    // 실제 구현에서는 API 호출
    // 목적상 샘플 데이터를 업데이트하는 로직은 생략
    console.log("새 필드 추가:", newField);
  };

  // 삭제 확인 모달 열기
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인 모달 닫기
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // 선택된 필드 삭제
  const deleteSelectedFields = async () => {
    setIsDeleting(true);

    try {
      // 1초 지연 (API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 실제 구현에서는 API 호출
      console.log("삭제할 필드들:", selection.selectedRows);

      // 선택 상태 초기화
      setSelection({ selectedRowKeys: [], selectedRows: [] });

      // 모달 닫기
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 삭제 가능 여부
  const canDelete = selection.selectedRows.length > 0;

  return {
    // 데이터
    filteredFields,
    paddedData,
    realDataCount: currentData.length,
    totalCount: filteredFields.length,

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
