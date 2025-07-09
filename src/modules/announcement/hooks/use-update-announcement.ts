import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UpdateAnnouncementData } from "../types";
import { ANNOUNCEMENT_CRUD_ERRORS } from "../constants";

/**
 * 공지사항 수정 훅
 */
export const useUpdateAnnouncement = (id: string) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAnnouncement = useCallback(
    async (data: UpdateAnnouncementData) => {
      setLoading(true);
      setError(null);

      try {
        // TODO: API 호출 구현
        // const formData = new FormData();
        // if (data.title) formData.append("title", data.title);
        // if (data.content) formData.append("content", data.content);
        // if (data.isPublished !== undefined) formData.append("isPublished", String(data.isPublished));
        // if (data.files) data.files.forEach((file) => formData.append("files", file));
        // if (data.removeFileIds) formData.append("removeFileIds", JSON.stringify(data.removeFileIds));

        // const response = await fetch(`/api/announcements/${id}`, {
        //   method: "PUT",
        //   body: formData,
        // });

        // const result = await response.json();
        // if (!response.ok) throw new Error(result.message);

        // 임시 처리
        console.log("공지사항 수정:", data);

        // 성공 시 상세 페이지로 이동
        router.push(`/announcements/${id}`);
      } catch (err) {
        setError(ANNOUNCEMENT_CRUD_ERRORS.UPDATE_FAILED);
        console.error("공지사항 수정 오류:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id, router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateAnnouncement,
    loading,
    error,
    clearError,
  };
};
