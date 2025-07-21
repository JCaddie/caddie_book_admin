import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteAnnouncement } from "../api/announcement-api";

/**
 * 공지사항 삭제 훅
 */
export const useDeleteAnnouncement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      // 공지사항 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      // 성공 시 목록 페이지로 이동
      router.push("/announcements");
    },
    onError: (err: Error) => {
      const errorMessage =
        err.message || "공지사항 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
    },
  });

  const deleteAnnouncementMutation = useCallback(
    async (id: string) => {
      setError(null);
      return mutation.mutateAsync(id);
    },
    [mutation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteAnnouncement: deleteAnnouncementMutation,
    loading: mutation.isPending,
    error,
    clearError,
  };
};
