"use client";

import { ChevronRightIcon } from "lucide-react";
import { Announcement, AnnouncementType } from "../../types";

interface AnnouncementSectionProps {
  type: AnnouncementType;
  announcements: Announcement[];
  onNavigate?: () => void;
  onAnnouncementClick?: (announcementId: string) => void;
}

const AnnouncementSection = ({
  type,
  announcements,
  onNavigate,
  onAnnouncementClick,
}: AnnouncementSectionProps) => {
  const title = type === "JCADDIE" ? "제이캐디 공지사항" : "골프장 공지사항";

  return (
    <div className="bg-white rounded-xl space-y-2">
      {/* 헤더 */}
      <div
        className="flex justify-between items-center px-2 pt-2 cursor-pointer rounded-md hover:bg-gray-50 transition-colors duration-200"
        onClick={onNavigate}
      >
        <h3 className="text-base font-bold text-black hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
          <ChevronRightIcon className="w-4 h-4" />
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white border border-gray-300 rounded-md py-2">
        <div className="space-y-0">
          {Array.from({ length: 4 }, (_, index) => {
            const announcement = announcements[index];
            return (
              <div
                key={announcement?.id || `empty-${index}`}
                className={`flex items-center gap-2 px-4 py-3 min-h-[48px] ${
                  announcement ? "cursor-pointer hover:bg-gray-50" : ""
                } ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                onClick={() => {
                  if (announcement && onAnnouncementClick) {
                    onAnnouncementClick(announcement.id);
                  }
                }}
              >
                {announcement ? (
                  <>
                    {announcement.isNew && (
                      <div className="bg-red-500 text-xs font-medium px-2 py-1 rounded-md min-w-[56px] text-center text-white">
                        new
                      </div>
                    )}
                    <span className="text-sm text-black line-clamp-1 flex-1">
                      {announcement.title}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 flex-1">
                    {/* 빈 슬롯 */}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;
