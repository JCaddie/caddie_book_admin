import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ANNOUNCEMENT_CRUD_ERRORS } from "../constants";

/**
 * 공지사항 삭제 훅
 */
export const useDeleteAnnouncement = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        // TODO: API 호출 구현
        // const response = await fetch(`/api/announcements/${id}`, {
        //   method: "DELETE",
        // });

        // const result = await response.json();
        // if (!response.ok) throw new Error(result.message);

        // 임시 처리
        console.log("공지사항 삭제:", id);

        // 성공 시 목록 페이지로 이동
        router.push("/admin/announcements");
      } catch (err) {
        setError(ANNOUNCEMENT_CRUD_ERRORS.DELETE_FAILED);
        console.error("공지사항 삭제 오류:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deleteAnnouncement,
    loading,
    error,
    clearError,
  };
};
