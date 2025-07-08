"use client";

import { useState, useCallback } from "react";
import { Work } from "@/modules/work/types";
import { SAMPLE_WORKS } from "@/modules/work/constants";

export function useWorkDetail(workId: string) {
  // 실제로는 API에서 데이터를 가져올 것
  const [work, setWork] = useState<Work | null>(() => {
    return SAMPLE_WORKS.find((w: Work) => w.id === workId) || null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 편집 모드 토글
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 편집 취소
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // 원본 데이터로 복원 (실제로는 API에서 다시 가져올 것)
    const originalWork = SAMPLE_WORKS.find((w: Work) => w.id === workId);
    if (originalWork) {
      setWork(originalWork);
    }
  }, [workId]);

  // 업데이트
  const handleUpdate = useCallback(
    (updatedData: Partial<Work>) => {
      if (!work) return;
      setWork((prev) => (prev ? { ...prev, ...updatedData } : null));
    },
    [work]
  );

  // 저장
  const handleSave = useCallback(async () => {
    if (!work) return;

    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 후 편집 모드 종료
      setIsEditing(false);

      // 성공 알림 (실제로는 toast 등 사용)
      console.log("근무 정보가 저장되었습니다.");
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
    }
  }, [work]);

  // 삭제 모달 표시
  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // 삭제 확인
  const handleDeleteConfirm = useCallback(async () => {
    if (!work) return;

    setIsDeleting(true);
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 삭제 후 목록 페이지로 이동 (실제로는 router.push 사용)
      console.log("근무가 삭제되었습니다.");
      window.history.back();
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [work]);

  // 삭제 모달 닫기
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return {
    work,
    isEditing,
    isDeleting,
    showDeleteModal,
    handleEdit,
    handleCancel,
    handleUpdate,
    handleSave,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
}
