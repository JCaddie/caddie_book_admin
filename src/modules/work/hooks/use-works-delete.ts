import { useState } from "react";
import { Work } from "@/modules/work/types";
import { deleteDailySchedule } from "@/modules/work/api";

export interface UseWorksDeleteReturn {
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
  handleDelete: () => void;
  handleConfirmDelete: (
    selectedRowKeys: string[],
    selectedRows: Work[],
    worksList: Work[],
    setWorksList: React.Dispatch<React.SetStateAction<Work[]>>,
    clearSelection: () => void,
    onSuccess?: () => void
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
    clearSelection: () => void,
    onSuccess?: () => void
  ): Promise<void> => {
    setIsDeleting(true);

    try {
      // 선택된 항목들을 순차적으로 삭제
      for (const work of selectedRows) {
        if (
          work.scheduleType === "daily" &&
          work.golfCourseId &&
          work.date &&
          work.date !== "미정"
        ) {
          // 날짜 형식을 "YYYY-MM-DD"로 변환
          const formattedDate = work.date
            .replace(/\s+/g, "") // 모든 공백 제거
            .replace(/\./g, "-") // 점을 하이픈으로 변환
            .replace(/-+$/, ""); // 끝에 있는 하이픈 제거

          // 일반 근무표 삭제 API 호출
          await deleteDailySchedule(work.golfCourseId, formattedDate);
        }
        // 특수 스케줄은 별도 처리 필요 (현재는 일반 근무표만 처리)
      }

      // 선택된 항목들을 데이터에서 제거
      const selectedIds = new Set(selectedRowKeys);
      const updatedWorksList = worksList.filter(
        (work) => !selectedIds.has(work.id)
      );

      setWorksList(updatedWorksList);

      // 선택 상태 초기화
      clearSelection();

      // 성공 메시지 표시
      alert("선택한 근무 스케줄이 성공적으로 삭제되었습니다.");

      // 삭제 성공 시 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
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
export { useWorksDelete };
