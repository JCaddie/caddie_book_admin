import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

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

        // 개발 중에는 데이터 확인용
        if (process.env.NODE_ENV === "development") {
          console.log("공지사항 삭제:", id);
        }

        // 성공 시 목록 페이지로 이동
        router.push("/announcements");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "공지사항 삭제 중 오류가 발생했습니다.";
        setError(errorMessage);
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
