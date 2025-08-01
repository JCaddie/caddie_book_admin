"use client";

import React, { useEffect, useState } from "react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { Announcement } from "../types";

interface AnnouncementCreateFormProps {
  onSubmit: (
    data: Omit<
      Announcement,
      "id" | "createdAt" | "updatedAt" | "views" | "files"
    >
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AnnouncementCreateForm: React.FC<AnnouncementCreateFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: true,
    announcementType: "GOLF_COURSE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 초기화
  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      isPublished: true,
      announcementType: "GOLF_COURSE",
    });
    setErrors({});
  }, []);

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
        announcementTypeDisplay:
          formData.announcementType === "GOLF_COURSE"
            ? "골프장 공지"
            : formData.announcementType === "GROUP"
            ? "그룹 공지"
            : "전체 공지",
        golfCourseId: "", // TODO: 실제 골프장 ID 설정
        golfCourseName: "", // TODO: 실제 골프장명 설정
        targetGroup: null,
        authorId: "", // TODO: 실제 작성자 ID 설정
        authorName: "", // TODO: 실제 작성자명 설정
        publishedAt: formData.isPublished
          ? new Date().toISOString()
          : undefined,
      });
    } catch (error) {
      console.error("공지사항 생성 실패:", error);
    }
  };

  const announcementTypeOptions = [
    { value: "GOLF_COURSE", label: "골프장 공지" },
    { value: "GROUP", label: "그룹 공지" },
    { value: "GLOBAL", label: "전체 공지" },
  ];

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
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
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, announcementType: value }))
          }
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="공지사항 내용을 입력하세요"
          className={`w-full h-32 px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
            errors.content ? "border-red-300" : "border-gray-300"
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
            className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <span className="text-sm font-medium text-gray-700">즉시 공개</span>
        </label>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
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
  );
};

export default AnnouncementCreateForm;
