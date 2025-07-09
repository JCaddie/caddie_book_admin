import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreateAnnouncementData } from "../types";
import { ANNOUNCEMENT_CRUD_ERRORS } from "../constants";

/**
 * 공지사항 생성 훅
 */
export const useCreateAnnouncement = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAnnouncement = useCallback(
    async (data: CreateAnnouncementData) => {
      setLoading(true);
      setError(null);

      try {
        // TODO: API 호출 구현
        // const formData = new FormData();
        // formData.append("title", data.title);
        // formData.append("content", data.content);
        // formData.append("isPublished", String(data.isPublished));
        // data.files.forEach((file) => formData.append("files", file));

        // const response = await fetch("/api/announcements", {
        //   method: "POST",
        //   body: formData,
        // });

        // const result = await response.json();
        // if (!response.ok) throw new Error(result.message);

        // 임시 처리
        console.log("공지사항 생성:", data);

        // 성공 시 목록 페이지로 이동
        router.push("/announcements");
      } catch (err) {
        setError(ANNOUNCEMENT_CRUD_ERRORS.CREATE_FAILED);
        console.error("공지사항 생성 오류:", err);
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
    createAnnouncement,
    loading,
    error,
    clearError,
  };
};
