"use client";

import React, { useCallback } from "react";
import type { AnnouncementFormData, AnnouncementFormErrors } from "../../types";
import { ANNOUNCEMENT_CONSTANTS } from "../../constants";
import { validateContent, validateTitle } from "../../utils";

interface AnnouncementBasicFieldsProps {
  formData: Pick<AnnouncementFormData, "title" | "content">;
  errors: Pick<AnnouncementFormErrors, "title" | "content">;
  isReadonly?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onFieldError: (field: keyof AnnouncementFormErrors, error?: string) => void;
}

/**
 * 공지사항 기본 필드 컴포넌트
 * 제목과 내용 입력을 담당합니다.
 */
export const AnnouncementBasicFields: React.FC<
  AnnouncementBasicFieldsProps
> = ({
  formData,
  errors,
  isReadonly = false,
  onTitleChange,
  onContentChange,
  onFieldError,
}) => {
  // 제목 입력 핸들러 (실시간 유효성 검사)
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onTitleChange(value);

      // 실시간 유효성 검사
      const titleError = validateTitle(value);
      onFieldError("title", titleError || undefined);
    },
    [onTitleChange, onFieldError]
  );

  // 내용 입력 핸들러 (실시간 유효성 검사)
  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      onContentChange(value);

      // 실시간 유효성 검사
      const contentError = validateContent(value);
      onFieldError("content", contentError || undefined);
    },
    [onContentChange, onFieldError]
  );

  return (
    <div className="space-y-6">
      {/* 제목 필드 */}
      <div>
        <label
          htmlFor="announcement-title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="announcement-title"
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder={ANNOUNCEMENT_CONSTANTS.FORM.PLACEHOLDERS.TITLE}
          maxLength={ANNOUNCEMENT_CONSTANTS.FORM.VALIDATION.TITLE_MAX_LENGTH}
          readOnly={isReadonly}
          className={`
            w-full px-4 py-3 border rounded-lg text-sm transition-colors
            ${
              errors.title
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-200"
            }
            ${
              isReadonly
                ? "bg-gray-50 cursor-not-allowed"
                : "bg-white focus:ring-2"
            }
          `}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
        <div className="mt-1 text-right text-xs text-gray-500">
          {formData.title.length}/
          {ANNOUNCEMENT_CONSTANTS.FORM.VALIDATION.TITLE_MAX_LENGTH}
        </div>
      </div>

      {/* 내용 필드 */}
      <div>
        <label
          htmlFor="announcement-content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="announcement-content"
          value={formData.content}
          onChange={handleContentChange}
          placeholder={ANNOUNCEMENT_CONSTANTS.FORM.PLACEHOLDERS.CONTENT}
          maxLength={ANNOUNCEMENT_CONSTANTS.FORM.VALIDATION.CONTENT_MAX_LENGTH}
          readOnly={isReadonly}
          rows={12}
          className={`
            w-full px-4 py-3 border rounded-lg text-sm transition-colors resize-none
            ${
              errors.content
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-200"
            }
            ${
              isReadonly
                ? "bg-gray-50 cursor-not-allowed"
                : "bg-white focus:ring-2"
            }
          `}
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? "content-error" : undefined}
        />
        {errors.content && (
          <p id="content-error" className="mt-1 text-sm text-red-600">
            {errors.content}
          </p>
        )}
        <div className="mt-1 text-right text-xs text-gray-500">
          {formData.content.length}/
          {ANNOUNCEMENT_CONSTANTS.FORM.VALIDATION.CONTENT_MAX_LENGTH}
        </div>
      </div>
    </div>
  );
};
