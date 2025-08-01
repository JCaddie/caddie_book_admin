"use client";

import React, { memo, useCallback, useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  ConfirmationModal,
  SearchWithButton,
} from "@/shared/components/ui";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";

interface AnnouncementActionBarProps {
  totalCount: number;
  selectedCount: number;
  onDeleteSelected: () => void;
  onCreateNew: () => void;
  isDeleting?: boolean;
}

const AnnouncementActionBar: React.FC<AnnouncementActionBarProps> = memo(
  ({
    totalCount,
    selectedCount,
    onDeleteSelected,
    onCreateNew,
    isDeleting = false,
  }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = useCallback(() => {
      if (selectedCount > 0) {
        setIsDeleteModalOpen(true);
      }
    }, [selectedCount]);

    const handleDeleteConfirm = useCallback(() => {
      onDeleteSelected();
      setIsDeleteModalOpen(false);
    }, [onDeleteSelected]);

    const handleDeleteCancel = useCallback(() => {
      setIsDeleteModalOpen(false);
    }, []);

    return (
      <>
        <div className="flex items-center justify-between">
          {/* 좌측: 총 건수 */}
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-black">
              총 {totalCount}건
            </span>
          </div>

          {/* 우측: 검색창과 버튼들 */}
          <div className="flex items-center gap-4">
            {/* 검색창 */}
            <SearchWithButton
              placeholder={ANNOUNCEMENT_CONSTANTS.FORM.PLACEHOLDERS.SEARCH}
            />

            {/* 버튼 그룹 */}
            <div className="flex items-center gap-2">
              {/* 삭제 버튼 */}
              <Button
                variant="secondary"
                size="md"
                onClick={handleDeleteClick}
                disabled={selectedCount === 0 || isDeleting}
                loading={isDeleting}
                className="w-24"
              >
                삭제
              </Button>

              {/* 생성 버튼 */}
              <Button
                variant="primary"
                size="md"
                onClick={onCreateNew}
                icon={<Plus size={24} />}
                className="w-24"
              >
                생성
              </Button>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="공지사항을 삭제할까요?"
          message={`선택한 ${selectedCount}개의 공지사항을 삭제합니다. 삭제 시 복원이 불가합니다.`}
          confirmText="삭제"
          cancelText="취소"
        />
      </>
    );
  }
);

AnnouncementActionBar.displayName = "AnnouncementActionBar";

export default AnnouncementActionBar;
