import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UpdateAnnouncementData } from "../types";
import { updateAnnouncement } from "../api/announcement-api";

/**
 * 공지사항 수정 훅
 */
export const useUpdateAnnouncement = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: UpdateAnnouncementData) => updateAnnouncement(id, data),
    onSuccess: () => {
      // 공지사항 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", id] });
      // 성공 시 상세 페이지로 이동
      router.push(`/announcements/${id}`);
    },
    onError: (err: Error) => {
      const errorMessage =
        err.message || "공지사항 수정 중 오류가 발생했습니다.";
      setError(errorMessage);
    },
  });

  const updateAnnouncementMutation = useCallback(
    async (data: UpdateAnnouncementData) => {
      setError(null);
      return mutation.mutateAsync(data);
    },
    [mutation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateAnnouncement: updateAnnouncementMutation,
    loading: mutation.isPending,
    error,
    clearError,
  };
};
