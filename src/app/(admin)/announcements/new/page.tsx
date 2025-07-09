import { useCreateAnnouncement } from "@/modules/announcement/hooks";
import { AnnouncementForm } from "@/modules/announcement/components";
import { AdminPageHeader } from "@/shared/components/layout";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageHeader title="공지사항 등록" />

      <div className="max-w-4xl mx-auto p-6">
        <AnnouncementForm mode="create" onSave={handleSave} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
        )}
      </div>
    </div>
  );
};

export default NewAnnouncementPage;
