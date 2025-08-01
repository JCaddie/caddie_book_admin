import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CreateAnnouncementData } from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import { createAnnouncement } from "../api/announcement-api";

/**
 * 공지사항 생성 액션 관리 훅
 */
export const useAnnouncementCreate = () => {
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

  // 생성 액션 함수
  const createAnnouncementAction = useCallback(
    async (data: CreateAnnouncementData) => {
      setError(null);
      return createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createAnnouncement: createAnnouncementAction,
    error,
    clearError,
    isLoading: createMutation.isPending,
  };
};
