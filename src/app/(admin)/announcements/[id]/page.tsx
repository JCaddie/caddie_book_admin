"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui";
import { EditableAnnouncementField } from "@/modules/announcement/components";
import { Announcement } from "@/modules/announcement/types";
import {
  fetchAnnouncementDetail,
  updateAnnouncement,
} from "@/modules/announcement/api/announcement-api";
import { transformAnnouncementDetailApiData } from "@/modules/announcement/utils/data-transform";

const AnnouncementDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 공지사항 상세 정보 로드
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await fetchAnnouncementDetail(id);
        const transformedData = transformAnnouncementDetailApiData(apiData);
        setAnnouncement(transformedData);
      } catch (err) {
        console.error("공지사항 로드 실패:", err);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  const handleBack = () => {
    router.push("/announcements");
  };

  const handleUpdateTitle = async (value: string | number | boolean) => {
    if (!announcement) return;

    try {
      const updatedAnnouncement = await updateAnnouncement(id, {
        title: value as string,
      });
      setAnnouncement(updatedAnnouncement);
    } catch (error) {
      console.error("제목 수정 실패:", error);
      throw error;
    }
  };

  const handleUpdateContent = async (value: string | number | boolean) => {
    if (!announcement) return;

    try {
      const updatedAnnouncement = await updateAnnouncement(id, {
        content: value as string,
      });
      setAnnouncement(updatedAnnouncement);
    } catch (error) {
      console.error("내용 수정 실패:", error);
      throw error;
    }
  };

  const handleUpdateAnnouncementType = async (
    value: string | number | boolean
  ) => {
    if (!announcement) return;

    try {
      const updatedAnnouncement = await updateAnnouncement(id, {
        announcementType: value as string,
      });
      setAnnouncement(updatedAnnouncement);
    } catch (error) {
      console.error("공지 유형 수정 실패:", error);
      throw error;
    }
  };

  const handleUpdatePublished = async (value: string | number | boolean) => {
    if (!announcement) return;

    try {
      const updatedAnnouncement = await updateAnnouncement(id, {
        isPublished: value as boolean,
      });
      setAnnouncement(updatedAnnouncement);
    } catch (error) {
      console.error("공개 여부 수정 실패:", error);
      throw error;
    }
  };

  const announcementTypeOptions = [
    { value: "GOLF_COURSE", label: "골프장 공지" },
    { value: "GROUP", label: "그룹 공지" },
    { value: "GLOBAL", label: "전체 공지" },
  ];

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-black">공지사항 상세</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-black">공지사항 상세</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-black">공지사항 상세</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <p className="text-gray-600">공지사항을 찾을 수 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-black">공지사항 상세</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 기본 정보 */}
          <div className="border-b border-gray-200">
            <EditableAnnouncementField
              label="제목"
              value={announcement.title}
              onSave={handleUpdateTitle}
              type="text"
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          <div className="border-b border-gray-200">
            <EditableAnnouncementField
              label="공지 유형"
              value={announcement.announcementType}
              onSave={handleUpdateAnnouncementType}
              type="select"
              options={announcementTypeOptions}
            />
          </div>

          <div className="border-b border-gray-200">
            <EditableAnnouncementField
              label="내용"
              value={announcement.content}
              onSave={handleUpdateContent}
              type="textarea"
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>

          <div className="border-b border-gray-200">
            <EditableAnnouncementField
              label="공개 여부"
              value={announcement.isPublished}
              onSave={handleUpdatePublished}
              type="checkbox"
            />
          </div>

          {/* 읽기 전용 정보 */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">조회수</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {announcement.views}회
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">작성자</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {announcement.authorName}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">골프장</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {announcement.golfCourseName}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">등록일자</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {new Date(announcement.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                <span className="text-sm font-bold">수정일자</span>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <span className="text-sm text-black">
                  {new Date(announcement.updatedAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          {announcement.publishedAt && (
            <div className="border-b border-gray-200">
              <div className="flex">
                <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                  <span className="text-sm font-bold">공개일자</span>
                </div>
                <div className="flex-1 flex items-center px-4 py-3">
                  <span className="text-sm text-black">
                    {new Date(announcement.publishedAt).toLocaleDateString(
                      "ko-KR"
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;
