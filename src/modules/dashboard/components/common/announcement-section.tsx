"use client";

import { ChevronRightIcon } from "lucide-react";
import { Announcement, AnnouncementType } from "../../types";

interface AnnouncementSectionProps {
  type: AnnouncementType;
  announcements: Announcement[];
  onNavigate?: () => void;
}

const AnnouncementSection = ({
  type,
  announcements,
  onNavigate,
}: AnnouncementSectionProps) => {
  const title = type === "JCADDIE" ? "제이캐디 공지사항" : "골프장 공지사항";

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-base font-bold text-black">{title}</h3>
        <button
          onClick={onNavigate}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 공지사항 목록 */}
      <div className="border border-gray-200 rounded-md p-2">
        <div className="space-y-1">
          {announcements.slice(0, 4).map((announcement, index) => (
            <div
              key={announcement.id}
              className={`flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {announcement.isNew && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                  new
                </span>
              )}
              <span className="text-sm text-black line-clamp-1">
                {announcement.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;
