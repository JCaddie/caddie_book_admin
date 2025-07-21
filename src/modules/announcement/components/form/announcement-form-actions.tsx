"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Save, Trash2, X } from "lucide-react";
import { Button, ConfirmationModal } from "@/shared/components/ui";
import type { Announcement, AnnouncementFormMode } from "../../types";

interface AnnouncementFormActionsProps {
  mode: AnnouncementFormMode;
  announcement?: Announcement;
  onSave?: () => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  isSaving?: boolean;
  className?: string;
}

/**
 * 공지사항 폼 액션 컴포넌트
 * 저장, 수정, 삭제, 취소 등의 액션 버튼을 담당합니다.
 */
export const AnnouncementFormActions: React.FC<
  AnnouncementFormActionsProps
> = ({
  mode,
  announcement,
  onSave,
  onDelete,
  onCancel,
  loading = false,
  isSaving = false,
  className = "",
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 읽기 전용 모드 체크
  const isReadonly = mode === "view";
  const isEditing = mode === "edit" || mode === "create";

  // 삭제 확인 모달 열기
  const handleDeleteClick = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  // 삭제 확인
  const handleDeleteConfirm = useCallback(async () => {
    if (!announcement?.id || !onDelete) return;

    setIsDeleteModalOpen(false);
    try {
      await onDelete(announcement.id);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  }, [announcement?.id, onDelete]);

  // 삭제 취소
  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  // 수정 모드로 이동
  const handleEdit = useCallback(() => {
    if (announcement?.id) {
      router.push(`/announcements/${announcement.id}/edit`);
    }
  }, [announcement?.id, router]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }, [onCancel, router]);

  return (
    <>
      <div className={`flex items-center justify-between ${className}`}>
        {/* 왼쪽: 취소 버튼 */}
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="px-6 py-2"
        >
          <X className="w-4 h-4 mr-2" />
          취소
        </Button>

        {/* 오른쪽: 주요 액션 버튼들 */}
        <div className="flex items-center space-x-3">
          {isReadonly && (
            <>
              {/* 수정 버튼 (조회 모드) */}
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                disabled={loading}
                className="px-6 py-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>

              {/* 삭제 버튼 (조회 모드) */}
              {announcement?.id && onDelete && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              )}
            </>
          )}

          {isEditing && (
            <>
              {/* 삭제 버튼 (수정 모드) */}
              {mode === "edit" && announcement?.id && onDelete && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDeleteClick}
                  disabled={loading || isSaving}
                  className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              )}

              {/* 저장 버튼 (생성/수정 모드) */}
              <Button
                type="button"
                variant="primary"
                onClick={onSave}
                disabled={loading || isSaving || !onSave}
                loading={isSaving}
                className="px-8 py-2"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "등록" : "수정 완료"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        title="공지사항 삭제"
        message="이 공지사항을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isLoading={loading}
      />
    </>
  );
};
