"use client";

import { useCallback, useEffect, useState } from "react";
import { Work } from "@/modules/work/types";
import { fetchWorkSchedules } from "@/modules/work/api";

export function useWorkDetail(golfCourseId: string) {
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API에서 모든 work 데이터 가져오기
        const allWorks = await fetchWorkSchedules();

        // golfCourseId로 해당 work 찾기
        const foundWork = allWorks.find(
          (w: Work) => w.golfCourseId === golfCourseId
        );

        if (foundWork) {
          setWork(foundWork);
        } else {
          // 임시 해결책: 첫 번째 데이터를 사용하고 golfCourseId 업데이트
          if (allWorks.length > 0) {
            const firstWork = { ...allWorks[0], golfCourseId };
            setWork(firstWork);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkData();
  }, [golfCourseId]);

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
    // 편집 모드만 종료하고 현재 work 데이터 유지
  }, []);

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
    isLoading,
    error,
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
