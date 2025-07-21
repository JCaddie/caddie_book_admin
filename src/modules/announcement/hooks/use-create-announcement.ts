import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreateAnnouncementData } from "../types";
import { createAnnouncement } from "../api/announcement-api";

/**
 * 공지사항 생성 훅
 */
export const useCreateAnnouncement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateAnnouncementData) => createAnnouncement(data),
    onSuccess: () => {
      // 공지사항 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      // 성공 시 목록 페이지로 이동
      router.push("/announcements");
    },
    onError: (err: Error) => {
      const errorMessage =
        err.message || "공지사항 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
    },
  });

  const createAnnouncementMutation = useCallback(
    async (data: CreateAnnouncementData) => {
      setError(null);
      return mutation.mutateAsync(data);
    },
    [mutation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createAnnouncement: createAnnouncementMutation,
    loading: mutation.isPending,
    error,
    clearError,
  };
};
