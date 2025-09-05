"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { createTemporaryCaddie } from "@/modules/user/api/user-api";
import type { CreateTemporaryCaddieRequest } from "@/modules/user/types/user";

interface TemporaryCaddieCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  golfCourseId: string;
  golfCourseName: string;
  primaryGroupId?: string;
  specialGroupId?: string;
  groupType: "PRIMARY" | "SPECIAL";
}

export const TemporaryCaddieCreateModal: React.FC<
  TemporaryCaddieCreateModalProps
> = ({
  isOpen,
  onClose,
  onSuccess,
  golfCourseId,
  golfCourseName,
  primaryGroupId,
  specialGroupId,
  groupType,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("캐디 이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData: CreateTemporaryCaddieRequest = {
        name: formData.name.trim(),
        golf_course: golfCourseId,
        gender: "M", // 기본값으로 남성 설정
        employment_type: "FULL_TIME", // 기본값으로 정규직 설정
        address: "임시 주소", // 기본값 설정
        temporary_notes: "긴급 배정용 임시 캐디",
        ...(groupType === "PRIMARY" &&
          primaryGroupId && { primary_group: primaryGroupId }),
        ...(groupType === "SPECIAL" &&
          specialGroupId && { special_group: specialGroupId }),
      };

      const response = await createTemporaryCaddie(requestData);

      if (response.success) {
        // 성공 시 폼 초기화 및 모달 닫기
        setFormData({ name: "" });
        onSuccess();
        onClose();
      } else {
        setError(response.message || "임시 캐디 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("임시 캐디 생성 실패:", err);
      setError("임시 캐디 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "" });
      setError(null);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            임시 캐디 생성
          </h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="golf-course"
              className="block text-sm font-medium text-gray-700"
            >
              골프장
            </label>
            <Input
              id="golf-course"
              value={golfCourseName}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              캐디 이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="캐디 이름을 입력하세요"
              disabled={isSubmitting}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              {isSubmitting ? "생성 중..." : "생성"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
