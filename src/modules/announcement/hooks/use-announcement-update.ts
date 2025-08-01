import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAnnouncementData } from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import { updateAnnouncement } from "../api/announcement-api";

/**
 * 공지사항 수정 액션 관리 훅
 */
export const useAnnouncementUpdate = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // 캐시 무효화 함수
  const invalidateAnnouncementQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [ANNOUNCEMENT_CONSTANTS.API.CACHE_KEYS.ANNOUNCEMENTS],
    });
  }, [queryClient]);

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

  // 수정 액션 함수
  const updateAnnouncementAction = useCallback(
    async (id: string, data: UpdateAnnouncementData) => {
      setError(null);
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateAnnouncement: updateAnnouncementAction,
    error,
    clearError,
    isLoading: updateMutation.isPending,
  };
};
