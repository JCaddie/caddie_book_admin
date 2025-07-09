"use client";

import React, { useState, useCallback, memo } from "react";
import { Plus } from "lucide-react";
import { Button, Search, ConfirmationModal } from "@/shared/components/ui";

interface CartActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  onDeleteSelected: () => void;
  onCreateNew: () => void;
  isDeleting?: boolean;
}

const CartActionBar: React.FC<CartActionBarProps> = memo(
  ({
    totalCount,
    selectedCount,
    searchTerm,
    onSearchChange,
    onDeleteSelected,
    onCreateNew,
    isDeleting = false,
  }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

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
        <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-md">
          {/* 좌측: 총 건수 */}
          <div className="flex items-center">
            <span className="text-base font-bold text-gray-900">
              총 {totalCount}건
            </span>
          </div>

          {/* 우측: 검색창과 버튼들 */}
          <div className="flex items-center gap-8">
            {/* 검색창 */}
            <Search
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="검색어 입력"
              containerClassName="w-[360px]"
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
          title="카트를 삭제할까요?"
          message={`선택한 ${selectedCount}개의 카트를 삭제합니다. 삭제 시 복원이 불가합니다.`}
          confirmText="삭제"
          cancelText="취소"
        />
      </>
    );
  }
);

CartActionBar.displayName = "CartActionBar";

export default CartActionBar;
