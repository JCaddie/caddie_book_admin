import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "../types";

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
        content: "이것은 테스트 공지사항입니다.",
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
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: "admin1",
        authorName: "관리자",
      };

      setAnnouncement(mockAnnouncement);
    } catch (err) {
      setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      console.error("공지사항 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    announcement,
    loading,
    error,
    fetchAnnouncement,
  };
};

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
        router.push("/admin/announcements");
      } catch (err) {
        setError("공지사항 생성 중 오류가 발생했습니다.");
        console.error("공지사항 생성 오류:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    createAnnouncement,
    loading,
    error,
  };
};

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
        router.push(`/admin/announcements/${id}`);
      } catch (err) {
        setError("공지사항 수정 중 오류가 발생했습니다.");
        console.error("공지사항 수정 오류:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id, router]
  );

  return {
    updateAnnouncement,
    loading,
    error,
  };
};

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
        setError("공지사항 삭제 중 오류가 발생했습니다.");
        console.error("공지사항 삭제 오류:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    deleteAnnouncement,
    loading,
    error,
  };
};
