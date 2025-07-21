import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CreateAnnouncementData, UpdateAnnouncementData } from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import {
  createAnnouncement,
  deleteAnnouncement,
  deleteAnnouncements,
  publishAnnouncement,
  unpublishAnnouncement,
  updateAnnouncement,
} from "../api/announcement-api";

/**
 * 공지사항 CRUD 액션 관리 훅
 * 생성, 수정, 삭제, 게시/게시중단 등의 액션을 관리합니다.
 */
export const useAnnouncementActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // 캐시 무효화 함수
  const invalidateAnnouncementQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [ANNOUNCEMENT_CONSTANTS.API.CACHE_KEYS.ANNOUNCEMENTS],
    });
  }, [queryClient]);

  // 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementData) => createAnnouncement(data),
    onSuccess: () => {
      invalidateAnnouncementQueries();
      router.push("/announcements");
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 생성 중 오류가 발생했습니다.");
    },
  });

  // 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementData }) =>
      updateAnnouncement(id, data),
    onSuccess: () => {
      invalidateAnnouncementQueries();
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 수정 중 오류가 발생했습니다.");
    },
  });

  // 단일 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      invalidateAnnouncementQueries();
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 삭제 중 오류가 발생했습니다.");
    },
  });

  // 일괄 삭제 뮤테이션
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteAnnouncements(ids),
    onSuccess: () => {
      invalidateAnnouncementQueries();
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 삭제 중 오류가 발생했습니다.");
    },
  });

  // 게시 뮤테이션
  const publishMutation = useMutation({
    mutationFn: (id: string) => publishAnnouncement(id),
    onSuccess: () => {
      invalidateAnnouncementQueries();
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 게시 중 오류가 발생했습니다.");
    },
  });

  // 게시 중단 뮤테이션
  const unpublishMutation = useMutation({
    mutationFn: (id: string) => unpublishAnnouncement(id),
    onSuccess: () => {
      invalidateAnnouncementQueries();
    },
    onError: (err: Error) => {
      setError(err.message || "공지사항 게시 중단 중 오류가 발생했습니다.");
    },
  });

  // 액션 함수들
  const createAnnouncementAction = useCallback(
    async (data: CreateAnnouncementData) => {
      setError(null);
      return createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateAnnouncementAction = useCallback(
    async (id: string, data: UpdateAnnouncementData) => {
      setError(null);
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteAnnouncementAction = useCallback(
    async (id: string) => {
      setError(null);
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const deleteSelectedAnnouncements = useCallback(
    async (ids: string[]) => {
      setError(null);
      return bulkDeleteMutation.mutateAsync(ids);
    },
    [bulkDeleteMutation]
  );

  const publishAnnouncementAction = useCallback(
    async (id: string) => {
      setError(null);
      return publishMutation.mutateAsync(id);
    },
    [publishMutation]
  );

  const unpublishAnnouncementAction = useCallback(
    async (id: string) => {
      setError(null);
      return unpublishMutation.mutateAsync(id);
    },
    [unpublishMutation]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 로딩 상태 계산
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    bulkDeleteMutation.isPending ||
    publishMutation.isPending ||
    unpublishMutation.isPending;

  return {
    // 액션 함수들
    createAnnouncement: createAnnouncementAction,
    updateAnnouncement: updateAnnouncementAction,
    deleteAnnouncement: deleteAnnouncementAction,
    deleteSelectedAnnouncements,
    publishAnnouncement: publishAnnouncementAction,
    unpublishAnnouncement: unpublishAnnouncementAction,

    // 상태
    error,
    clearError,
    isLoading,

    // 개별 로딩 상태
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending || bulkDeleteMutation.isPending,
    isPublishing: publishMutation.isPending || unpublishMutation.isPending,
  };
};
