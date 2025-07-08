"use client";

import { useState, useCallback, useMemo } from "react";
import { Work } from "@/modules/work/types";
import { SAMPLE_GOLF_COURSES } from "@/modules/work/constants";

// useWorksData와 동일한 샘플 데이터 생성 함수
const generateSampleWorks = (count: number): Work[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `work-${index + 1}`,
    no: index + 1,
    date: "2025.01.06",
    golfCourse: SAMPLE_GOLF_COURSES[index % SAMPLE_GOLF_COURSES.length],
    totalStaff: 130,
    availableStaff: 130,
    status: "planning" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export function useWorkDetail(workId: string) {
  // 샘플 데이터 생성 (useWorksData와 동일)
  const sampleWorks = useMemo(() => generateSampleWorks(26), []);

  // 실제로는 API에서 데이터를 가져올 것
  const [work, setWork] = useState<Work | null>(() => {
    return sampleWorks.find((w: Work) => w.id === workId) || null;
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
    const originalWork = sampleWorks.find((w: Work) => w.id === workId);
    if (originalWork) {
      setWork(originalWork);
    }
  }, [workId, sampleWorks]);

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
