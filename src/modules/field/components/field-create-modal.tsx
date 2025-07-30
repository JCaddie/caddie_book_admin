"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { FieldFormData } from "../types";
import FieldForm from "./field-form";

export interface FieldCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FieldFormData) => void;
  isLoading?: boolean;
}

const EMPTY_FORM: FieldFormData = {
  name: "",
  golf_course_id: "",
  hole_count: 0,
  is_active: true,
  description: "",
};

const FieldCreateModal: React.FC<FieldCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FieldFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...EMPTY_FORM,
        // ADMIN 권한일 때 자동으로 골프장 ID 설정
        golf_course_id:
          user?.role === "ADMIN" && user.golfCourseId ? user.golfCourseId : "",
      });
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof FieldFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = () => {
    setError(null);

    // 유효성 검사
    if (!formData.name.trim()) {
      setError("필드명을 입력해주세요.");
      return;
    }

    if (!formData.golf_course_id) {
      setError("골프장을 선택해주세요.");
      return;
    }

    if (!formData.hole_count || formData.hole_count <= 0) {
      setError("홀 수를 입력해주세요.");
      return;
    }

    onSubmit(formData);
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">새 필드 생성</h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-6">
          <FieldForm formData={formData} onInputChange={handleInputChange} />

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldCreateModal;
