import { useState } from "react";
import { Work } from "@/modules/work/types";

export interface UseWorksDeleteReturn {
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
  handleDelete: () => void;
  handleConfirmDelete: (
    selectedRowKeys: string[],
    selectedRows: Work[],
    worksList: Work[],
    setWorksList: React.Dispatch<React.SetStateAction<Work[]>>,
    clearSelection: () => void
  ) => Promise<void>;
  handleCloseDeleteModal: () => void;
}

const useWorksDelete = (selectedRowKeys: string[]): UseWorksDeleteReturn => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 삭제 버튼 클릭 핸들러 (모달 열기)
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 확인 핸들러
  const handleConfirmDelete = async (
    selectedRowKeys: string[],
    selectedRows: Work[],
    worksList: Work[],
    setWorksList: React.Dispatch<React.SetStateAction<Work[]>>,
    clearSelection: () => void
  ): Promise<void> => {
    setIsDeleting(true);

    try {
      // 실제 삭제 로직 (API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 선택된 항목들을 데이터에서 제거
      const selectedIds = new Set(selectedRowKeys);
      const updatedWorksList = worksList.filter(
        (work) => !selectedIds.has(work.id)
      );

      setWorksList(updatedWorksList);

      // 선택 상태 초기화
      clearSelection();

      console.log(
        `${selectedRowKeys.length}개 항목이 삭제되었습니다.`,
        selectedRows
      );
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 삭제 모달 닫기 핸들러
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  return {
    isDeleteModalOpen,
    isDeleting,
    handleDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
  };
};

export default useWorksDelete;
