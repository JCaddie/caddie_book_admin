import { useState, useCallback } from "react";
import { Announcement } from "../types";

/**
 * 공지사항 상세 조회 훅
 */
export const useAnnouncementDetail = (id: string) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncement = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: API 호출 구현
      // const response = await fetch(`/api/announcements/${id}`);
      // const data = await response.json();

      // 임시 데이터 (실제로는 API에서 가져옴)
      const mockAnnouncement: Announcement = {
        id,
        title: "테스트 공지사항",
        content:
          "이것은 테스트 공지사항입니다.\n\n상세 내용이 여기에 들어갑니다.",
        views: 123,
        isPublished: true,
        publishedAt: new Date().toISOString(),
        files: [
          {
            id: "file1",
            filename: "document.pdf",
            originalName: "공지사항_첨부파일.pdf",
            size: 1024 * 1024,
            mimeType: "application/pdf",
            url: "/files/document.pdf",
            uploadedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: "admin1",
        authorName: "관리자",
      };

      setAnnouncement(mockAnnouncement);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "공지사항 상세 정보를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    announcement,
    loading,
    error,
    fetchAnnouncement,
    clearError,
  };
};
