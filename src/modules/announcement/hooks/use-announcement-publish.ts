import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import {
  publishAnnouncement,
  unpublishAnnouncement,
} from "../api/announcement-api";

/**
 * 공지사항 게시/게시중단 액션 관리 훅
 */
export const useAnnouncementPublish = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // 캐시 무효화 함수
  const invalidateAnnouncementQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [ANNOUNCEMENT_CONSTANTS.API.CACHE_KEYS.ANNOUNCEMENTS],
    });
  }, [queryClient]);

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

  // 게시 액션 함수
  const publishAnnouncementAction = useCallback(
    async (id: string) => {
      setError(null);
      return publishMutation.mutateAsync(id);
    },
    [publishMutation]
  );

  // 게시 중단 액션 함수
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

  return {
    publishAnnouncement: publishAnnouncementAction,
    unpublishAnnouncement: unpublishAnnouncementAction,
    error,
    clearError,
    isLoading: publishMutation.isPending || unpublishMutation.isPending,
  };
};
