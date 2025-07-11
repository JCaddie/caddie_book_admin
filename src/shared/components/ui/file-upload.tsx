"use client";

import React, { useCallback, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "./button";
import { formatFileSize } from "@/modules/announcement/utils";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export interface ExistingFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  url: string;
}

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // bytes
  existingFiles?: ExistingFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  onExistingFileRemove?: (fileId: string) => void;
  disabled?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "첨부 파일",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif",
  multiple = true,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  existingFiles = [],
  onFilesChange,
  onExistingFileRemove,
  disabled = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `파일 크기가 너무 큽니다. 최대 ${formatFileSize(
          maxSize
        )}까지 업로드 가능합니다.`;
      }
      return null;
    },
    [maxSize]
  );

  const handleFileSelect = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      setError(null);

      // 파일 개수 체크
      const totalFiles =
        existingFiles.length + uploadedFiles.length + files.length;
      if (totalFiles > maxFiles) {
        setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      const newFiles: UploadedFile[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          newFiles.push({
            id: `upload-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            file,
            name: file.name,
            size: file.size,
          });
        }
      });

      if (errors.length > 0) {
        setError(errors.join("\n"));
        return;
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [existingFiles.length, uploadedFiles, maxFiles, onFilesChange, validateFile]
  );

  const handleUploadedFileRemove = useCallback(
    (fileId: string) => {
      const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
      setUploadedFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [uploadedFiles, onFilesChange]
  );

  const handleExistingFileRemove = useCallback(
    (fileId: string) => {
      onExistingFileRemove?.(fileId);
    },
    [onExistingFileRemove]
  );

  const totalFiles = existingFiles.length + uploadedFiles.length;
  const canAddMore = totalFiles < maxFiles && !disabled;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 라벨 */}
      <div className="flex items-center">
        <label className="text-sm font-semibold text-gray-800 w-22">
          {label}
        </label>
      </div>

      {/* 파일 목록 */}
      <div className="space-y-2">
        {/* 기존 파일들 */}
        {existingFiles.map((file) => (
          <div
            key={file.id}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-md text-sm font-semibold"
          >
            <span className="truncate max-w-[200px]" title={file.originalName}>
              {file.originalName}
            </span>
            <span className="text-xs text-gray-500">
              ({formatFileSize(file.size)})
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleExistingFileRemove(file.id)}
                className="flex-shrink-0 p-0.5 hover:bg-orange-100 rounded transition-colors"
                title="파일 삭제"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        {/* 새로 업로드한 파일들 */}
        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-md text-sm font-semibold"
          >
            <span className="truncate max-w-[200px]" title={file.name}>
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              ({formatFileSize(file.size)})
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleUploadedFileRemove(file.id)}
                className="flex-shrink-0 p-0.5 hover:bg-orange-100 rounded transition-colors"
                title="파일 삭제"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        {/* 파일 추가 버튼 */}
        {canAddMore && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleFileSelect}
            className="inline-flex items-center gap-1 px-2 py-2 h-8 text-sm"
          >
            <Plus size={16} />
            추가하기
          </Button>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm whitespace-pre-line">{error}</div>
      )}

      {/* 파일 정보 */}
      <div className="text-xs text-gray-500">
        {totalFiles > 0 && (
          <span>
            {totalFiles}/{maxFiles}개 파일 •{" "}
          </span>
        )}
        최대 파일 크기: {formatFileSize(maxSize)}
      </div>
    </div>
  );
};

export default FileUpload;
