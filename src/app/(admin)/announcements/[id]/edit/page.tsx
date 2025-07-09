"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useAnnouncementDetail,
  useUpdateAnnouncement,
} from "@/modules/announcement/hooks";
import { AnnouncementForm } from "@/modules/announcement/components";
import { AdminPageHeader } from "@/shared/components/layout";

interface FormData {
  title: string;
  content: string;
  isPublished: boolean;
  files: File[];
  removeFileIds: string[];
}

const AnnouncementEditPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const { announcement, loading, error, fetchAnnouncement } =
    useAnnouncementDetail(id);
  const {
    updateAnnouncement,
    loading: updateLoading,
    error: updateError,
  } = useUpdateAnnouncement(id);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  const handleSave = async (data: FormData) => {
    const updateData = {
      title: data.title,
      content: data.content,
      isPublished: data.isPublished,
      files: data.files,
      removeFileIds: data.removeFileIds,
    };

    await updateAnnouncement(updateData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminPageHeader title="공지사항 수정" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminPageHeader title="공지사항 수정" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminPageHeader title="공지사항 수정" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600 text-sm">
              공지사항을 찾을 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageHeader title="공지사항 수정" />

      <div className="max-w-4xl mx-auto p-6">
        <AnnouncementForm
          mode="edit"
          announcement={announcement}
          onSave={handleSave}
          loading={updateLoading}
        />

        {updateError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{updateError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementEditPage;
