"use client";

import React, { useCallback, useState } from "react";
import type {
  Announcement,
  AnnouncementFormData,
  AnnouncementFormErrors,
  AnnouncementFormMode,
} from "../types";
import { validateAnnouncementForm } from "../utils";
import {
  AnnouncementBasicFields,
  AnnouncementFormActions,
  AnnouncementPublishSettings,
} from "./form";

interface AnnouncementFormProps {
  mode: AnnouncementFormMode;
  announcement?: Announcement;
  onSave?: (data: AnnouncementFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * 공지사항 폼 컴포넌트
 * 분해된 서브 컴포넌트들을 조합하여 완전한 폼을 구성합니다.
 */
const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  mode,
  announcement,
  onSave,
  onDelete,
  onCancel,
  loading = false,
  className = "",
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});

  // 폼 데이터 상태
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: announcement?.title || "",
    content: announcement?.content || "",
    isPublished: announcement?.isPublished || false,
  });

  // 읽기 전용 모드 체크
  const isReadonly = mode === "view";

  // 필드별 에러 설정
  const handleFieldError = useCallback(
    (field: keyof AnnouncementFormErrors, error?: string) => {
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    []
  );

  // 제목 변경 핸들러
  const handleTitleChange = useCallback((title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  }, []);

  // 내용 변경 핸들러
  const handleContentChange = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  // 게시 상태 토글 핸들러
  const handlePublishToggle = useCallback(() => {
    setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  }, []);

  // 폼 저장 핸들러
  const handleSave = useCallback(async () => {
    // 전체 폼 유효성 검사
    const { isValid, errors: validationErrors } =
      validateAnnouncementForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      await onSave?.(formData);
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      setErrors({ general: "저장 중 오류가 발생했습니다." });
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 일반 에러 메시지 */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 폼 영역 (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <AnnouncementBasicFields
            formData={formData}
            errors={errors}
            isReadonly={isReadonly}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onFieldError={handleFieldError}
          />
        </div>

        {/* 사이드바 영역 (1/3) */}
        <div className="space-y-6">
          <AnnouncementPublishSettings
            formData={formData}
            isReadonly={isReadonly}
            onPublishToggle={handlePublishToggle}
          />
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="border-t pt-6">
        <AnnouncementFormActions
          mode={mode}
          announcement={announcement}
          onSave={handleSave}
          onDelete={onDelete}
          onCancel={onCancel}
          loading={loading}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default AnnouncementForm;
