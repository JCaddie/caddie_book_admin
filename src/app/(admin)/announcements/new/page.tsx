"use client";

import { useCreateAnnouncement } from "@/modules/announcement/hooks";
import { AnnouncementForm } from "@/modules/announcement/components";
import { AnnouncementFormData } from "@/modules/announcement/types";

const NewAnnouncementPage: React.FC = () => {
  const { createAnnouncement, loading, error, clearError } =
    useCreateAnnouncement();

  const handleSave = async (data: AnnouncementFormData) => {
    const announcementData = {
      title: data.title,
      content: data.content,
      isPublished: data.isPublished,
      files: data.files,
    };

    await createAnnouncement(announcementData);
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 ml-4"
              aria-label="에러 메시지 닫기"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AnnouncementForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  );
};

export default NewAnnouncementPage;
