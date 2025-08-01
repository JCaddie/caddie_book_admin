"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Work } from "@/modules/work/types";
import { fetchWorkSchedules } from "@/modules/work/api";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";

export function useWorkDetail(golfCourseId: string) {
  // React Query를 사용한 데이터 페칭
  const {
    data: allWorks = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: [CACHE_KEYS.WORK_SCHEDULES],
    queryFn: fetchWorkSchedules,
    ...QUERY_CONFIG.REALTIME_OPTIONS,
  });

  // golfCourseId로 해당 work 찾기
  const work = useMemo(() => {
    if (!allWorks.length) return null;

    const foundWork = allWorks.find(
      (w: Work) => w.golfCourseId === golfCourseId
    );

    if (foundWork) {
      return foundWork;
    } else {
      // 임시 해결책: 첫 번째 데이터를 사용하고 golfCourseId 업데이트
      if (allWorks.length > 0) {
        return { ...allWorks[0], golfCourseId };
      }
    }

    return null;
  }, [allWorks, golfCourseId]);

  // 표준화된 에러 처리
  const error = useQueryError(queryError, "데이터를 불러오는데 실패했습니다.");

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
