"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useAnnouncementDetail,
  useDeleteAnnouncement,
} from "@/modules/announcement/hooks";
import { AnnouncementForm } from "@/modules/announcement/components";

const AnnouncementDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const { announcement, loading, error, fetchAnnouncement } =
    useAnnouncementDetail(id);
  const { deleteAnnouncement, loading: deleteLoading } =
    useDeleteAnnouncement();

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  const handleDelete = async (announcementId: string) => {
    await deleteAnnouncement(announcementId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => fetchAnnouncement()}
              className="text-red-500 hover:text-red-700 ml-4"
              aria-label="다시 시도"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600 text-sm">
            공지사항을 찾을 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AnnouncementForm
        mode="view"
        announcement={announcement}
        onDelete={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AnnouncementDetailPage;
