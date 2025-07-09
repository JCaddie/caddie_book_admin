import { useState, useMemo } from "react";
import { FieldTableRow } from "../types/field";

// 샘플 데이터
const generateSampleFields = (): FieldTableRow[] => {
  return Array.from({ length: 26 }, (_, index) => ({
    id: `field-${index + 1}`,
    no: index + 1,
    fieldName: index % 2 === 0 ? "한울(서남)" : "누리(남서)",
    golfCourse: "제이캐디 아카데미",
    availablePersonnel: 130,
    carts: 32,
    operationStatus: index % 2 === 0 ? "운영" : "정비",
  }));
};

export const useFieldManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [allFields, setAllFields] = useState<FieldTableRow[]>(() =>
    generateSampleFields()
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredFields = useMemo(() => {
    if (!searchTerm) return allFields;

    return allFields.filter(
      (field) =>
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.golfCourse.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allFields, searchTerm]);

  const selectedRows = useMemo(() => {
    return filteredFields.filter((field) => selectedRowKeys.includes(field.id));
  }, [filteredFields, selectedRowKeys]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // 검색시 선택 초기화
    setSelectedRowKeys([]);
  };

  const handleSelectionChange = (newSelectedRowKeys: string[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDeleteClick = () => {
    if (selectedRowKeys.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 선택된 항목들을 데이터에서 제거
      setAllFields((prev) =>
        prev.filter((field) => !selectedRowKeys.includes(field.id))
      );
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);

      console.log(`${selectedRowKeys.length}개 필드가 삭제되었습니다.`);
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleCreateField = () => {
    // TODO: 필드 생성 페이지로 이동 또는 모달 열기
    console.log("새 필드 생성");

    // 임시로 새 필드 추가 시뮬레이션
    const newField: FieldTableRow = {
      id: `field-${Date.now()}`,
      no: allFields.length + 1,
      fieldName: "새 필드",
      golfCourse: "제이캐디 아카데미",
      availablePersonnel: 100,
      carts: 20,
      operationStatus: "운영",
    };

    setAllFields((prev) => [newField, ...prev]);
  };

  const handleRowClick = (field: FieldTableRow) => {
    // TODO: 필드 상세 페이지로 이동
    console.log("Row clicked:", field);
  };

  return {
    // 데이터
    fields: filteredFields,
    selectedRowKeys,
    selectedRows,
    totalCount: filteredFields.length,
    hasSelectedItems: selectedRowKeys.length > 0,

    // 검색
    searchTerm,
    handleSearchChange,

    // 선택
    handleSelectionChange,

    // 삭제
    isDeleteModalOpen,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,

    // 생성
    handleCreateField,

    // 행 클릭
    handleRowClick,
  };
};
