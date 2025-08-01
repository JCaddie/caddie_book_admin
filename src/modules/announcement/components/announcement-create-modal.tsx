"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Announcement } from "../types";
import AnnouncementCreateForm from "./announcement-create-form";

interface AnnouncementCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<
      Announcement,
      "id" | "createdAt" | "updatedAt" | "views" | "files"
    >
  ) => Promise<void>;
  isLoading?: boolean;
}

const AnnouncementCreateModal: React.FC<AnnouncementCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (
    data: Omit<
      Announcement,
      "id" | "createdAt" | "updatedAt" | "views" | "files"
    >
  ) => {
    await onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl flex flex-col w-full max-w-2xl max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-black">공지사항 생성</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnnouncementCreateForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCreateModal;
