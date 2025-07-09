"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Save } from "lucide-react";

import {
  Button,
  TextField,
  FileUpload,
  ConfirmationModal,
} from "@/shared/components/ui";
import type { UploadedFile, ExistingFile } from "@/shared/components/ui";
import {
  Announcement,
  AnnouncementFormMode,
  AnnouncementFormData,
  AnnouncementFormErrors,
} from "../types";
import { ANNOUNCEMENT_FORM_RULES, FILE_UPLOAD_CONFIG } from "../constants";
import {
  validateAnnouncementForm,
  validateTitle,
  validateContent,
} from "../utils";

interface AnnouncementFormProps {
  mode: AnnouncementFormMode;
  announcement?: Announcement;
  onSave?: (data: AnnouncementFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  mode,
  announcement,
  onSave,
  onDelete,
  onCancel,
  loading = false,
  className = "",
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});

  // 폼 데이터 상태
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: announcement?.title || "",
    content: announcement?.content || "",
    isPublished: announcement?.isPublished || false,
    files: [],
    removeFileIds: [],
  });

  // 읽기 전용 모드 체크
  const isReadonly = mode === "view";

  // 제목 입력 핸들러 (실시간 유효성 검사)
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, title: value }));

      // 실시간 유효성 검사
      const titleError = validateTitle(value);
      setErrors((prev) => ({ ...prev, title: titleError || undefined }));
    },
    []
  );

  // 내용 입력 핸들러 (실시간 유효성 검사)
  const handleContentChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));

    // 실시간 유효성 검사
    const contentError = validateContent(value);
    setErrors((prev) => ({ ...prev, content: contentError || undefined }));
  }, []);

  // 게시 상태 토글 핸들러
  const handlePublishToggle = useCallback(() => {
    setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  }, []);

  // 새 파일 추가 핸들러
  const handleFilesChange = useCallback((files: UploadedFile[]) => {
    setFormData((prev) => ({
      ...prev,
      files: files.map((f) => f.file),
    }));

    // 파일 관련 에러 초기화
    setErrors((prev) => ({ ...prev, files: undefined }));
  }, []);

  // 기존 파일 삭제 핸들러
  const handleExistingFileRemove = useCallback((fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      removeFileIds: [...prev.removeFileIds, fileId],
    }));
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

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!announcement?.id) return;

    setIsDeleteModalOpen(false);
    try {
      await onDelete?.(announcement.id);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      setErrors({ general: "삭제 중 오류가 발생했습니다." });
    }
  }, [announcement?.id, onDelete]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }, [onCancel, router]);

  // 수정 모드로 이동
  const handleEdit = useCallback(() => {
    if (announcement?.id) {
      router.push(`/admin/announcements/${announcement.id}/edit`);
    }
  }, [announcement?.id, router]);

  // 기존 파일 목록 생성 (삭제 예정 파일 제외)
  const existingFiles: ExistingFile[] =
    announcement?.files
      ?.filter((file) => !formData.removeFileIds.includes(file.id))
      .map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        size: file.size,
        url: file.url,
      })) || [];

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === "create" && "공지사항 등록"}
          {mode === "edit" && "공지사항 수정"}
          {mode === "view" && "공지사항 상세"}
        </h2>

        {/* 상세보기 모드 액션 버튼 */}
        {mode === "view" && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              icon={<Edit2 size={16} />}
            >
              수정
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              icon={<Trash2 size={16} />}
            >
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* 폼 내용 */}
      <div className="p-6 space-y-6">
        {/* 일반 에러 메시지 */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* 제목 */}
        <TextField
          label="제목"
          value={formData.title}
          onChange={handleTitleChange}
          error={errors.title}
          disabled={isReadonly || loading}
          placeholder="제목을 입력하세요"
          maxLength={ANNOUNCEMENT_FORM_RULES.TITLE_MAX_LENGTH}
          required
        />

        {/* 내용 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            disabled={isReadonly || loading}
            placeholder="내용을 입력하세요"
            rows={12}
            maxLength={ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH}
            className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              isReadonly
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                : "border-gray-300"
            } ${errors.content ? "border-red-300" : ""}`}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content}</p>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              최대 {ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH.toLocaleString()}
              자
            </span>
            <span>
              {formData.content.length.toLocaleString()}/
              {ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 게시 상태 */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-semibold text-gray-800">
            게시 상태
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={handlePublishToggle}
              disabled={isReadonly || loading}
              className="sr-only"
            />
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isPublished ? "bg-primary" : "bg-gray-200"
              } ${
                isReadonly || loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPublished ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
            <span className="ml-2 text-sm text-gray-700">
              {formData.isPublished ? "게시됨" : "게시 안함"}
            </span>
          </label>
        </div>

        {/* 첨부 파일 */}
        <FileUpload
          existingFiles={existingFiles}
          onFilesChange={handleFilesChange}
          onExistingFileRemove={handleExistingFileRemove}
          disabled={isReadonly || loading}
          accept={FILE_UPLOAD_CONFIG.ACCEPT_TYPES}
          maxFiles={FILE_UPLOAD_CONFIG.MAX_FILES}
          maxSize={FILE_UPLOAD_CONFIG.MAX_SIZE}
        />

        {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex items-center justify-end gap-2 p-6 border-t bg-gray-50">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={loading || isSaving}
        >
          취소
        </Button>
        {mode !== "view" && (
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || isSaving}
            loading={isSaving}
            icon={<Save size={16} />}
          >
            {mode === "create" ? "등록" : "완료"}
          </Button>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="공지사항 삭제"
        message="정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
};

export default AnnouncementForm;
