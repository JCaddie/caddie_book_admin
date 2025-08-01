import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import {
  deleteAnnouncement,
  deleteAnnouncements,
} from "../api/announcement-api";

/**
 * 공지사항 삭제 액션 관리 훅
 */
export const useAnnouncementDelete = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // 캐시 무효화 함수
  const invalidateAnnouncementQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [ANNOUNCEMENT_CONSTANTS.API.CACHE_KEYS.ANNOUNCEMENTS],
    });
  }, [queryClient]);

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

  // 단일 삭제 액션 함수
  const deleteAnnouncementAction = useCallback(
    async (id: string) => {
      setError(null);
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  // 일괄 삭제 액션 함수
  const deleteSelectedAnnouncements = useCallback(
    async (ids: string[]) => {
      setError(null);
      return bulkDeleteMutation.mutateAsync(ids);
    },
    [bulkDeleteMutation]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteAnnouncement: deleteAnnouncementAction,
    deleteSelectedAnnouncements,
    error,
    clearError,
    isLoading: deleteMutation.isPending || bulkDeleteMutation.isPending,
  };
};
