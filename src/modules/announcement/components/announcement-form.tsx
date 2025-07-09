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
import { Announcement, AnnouncementFormMode } from "../types";

interface AnnouncementFormProps {
  mode: AnnouncementFormMode;
  announcement?: Announcement;
  onSave?: (data: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormData {
  title: string;
  content: string;
  isPublished: boolean;
  files: File[];
  removeFileIds: string[];
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 폼 데이터 상태
  const [formData, setFormData] = useState<FormData>({
    title: announcement?.title || "",
    content: announcement?.content || "",
    isPublished: announcement?.isPublished || false,
    files: [],
    removeFileIds: [],
  });

  // 읽기 전용 모드 체크
  const isReadonly = mode === "view";

  // 제목 입력 핸들러
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, title: value }));
      if (errors.title) {
        setErrors((prev) => ({ ...prev, title: "" }));
      }
    },
    [errors.title]
  );

  // 내용 입력 핸들러
  const handleContentChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, content: value }));
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: "" }));
      }
    },
    [errors.content]
  );

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
  }, []);

  // 기존 파일 삭제 핸들러
  const handleExistingFileRemove = useCallback((fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      removeFileIds: [...prev.removeFileIds, fileId],
    }));
  }, []);

  // 유효성 검사
  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.length > 200) {
      newErrors.title = "제목은 200자 이내로 입력해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
    } else if (formData.content.length > 5000) {
      newErrors.content = "내용은 5000자 이내로 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave?.(formData);
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, validateForm]);

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!announcement?.id) return;

    setIsDeleteModalOpen(false);
    try {
      await onDelete?.(announcement.id);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
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
        {/* 제목 */}
        <TextField
          label="제목"
          value={formData.title}
          onChange={handleTitleChange}
          error={errors.title}
          disabled={isReadonly || loading}
          placeholder="제목을 입력하세요"
          maxLength={200}
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
            maxLength={5000}
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
            <span>최대 5000자</span>
            <span>{formData.content.length}/5000</span>
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
        />
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
