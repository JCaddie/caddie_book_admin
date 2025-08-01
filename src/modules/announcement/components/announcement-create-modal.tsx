"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { Announcement } from "../types";

interface AnnouncementCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, "id" | "createdAt" | "updatedAt" | "views" | "files">) => Promise<void>;
  isLoading?: boolean;
}

const AnnouncementCreateModal: React.FC<AnnouncementCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: true,
    announcementType: "GOLF_COURSE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 모달이 열릴 때마다 폼 초기화
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        content: "",
        isPublished: true,
        announcementType: "GOLF_COURSE",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublished: formData.isPublished,
        announcementType: formData.announcementType,
        announcementTypeDisplay: formData.announcementType === "GOLF_COURSE" ? "골프장 공지" : "JCADDIE 공지",
        golfCourseId: "", // TODO: 실제 골프장 ID 설정
        golfCourseName: "", // TODO: 실제 골프장명 설정
        targetGroup: null,
        authorId: "", // TODO: 실제 작성자 ID 설정
        authorName: "", // TODO: 실제 작성자명 설정
        publishedAt: formData.isPublished ? new Date().toISOString() : undefined,
      });
      onClose();
    } catch (error) {
      console.error("공지사항 생성 실패:", error);
    }
  };

  if (!isOpen) return null;

  const announcementTypeOptions = [
    { value: "GOLF_COURSE", label: "골프장 공지" },
    { value: "JCADDIE", label: "JCADDIE 공지" },
  ];

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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="공지사항 제목을 입력하세요"
              error={errors.title}
              disabled={isLoading}
            />
          </div>

          {/* 공지 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공지 유형 <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={announcementTypeOptions}
              value={formData.announcementType}
              onChange={(value) => setFormData(prev => ({ ...prev, announcementType: value }))}
              placeholder="공지 유형을 선택하세요"
              disabled={isLoading}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="공지사항 내용을 입력하세요"
              className={`w-full h-32 px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* 공개 여부 */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">즉시 공개</span>
            </label>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            {isLoading ? "생성 중..." : "생성"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCreateModal; 