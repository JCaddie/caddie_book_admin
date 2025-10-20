import React, { memo, useCallback, useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  ConfirmationModal,
  SearchWithButton,
} from "@/shared/components/ui";
import { UserActionBarProps } from "../types";
import { ROLE_FILTER_OPTIONS } from "../constants";

export const UserActionBar: React.FC<UserActionBarProps> = memo(
  ({
    totalCount,
    selectedCount,
    roleFilter,
    onRoleFilterChange,
    onDeleteSelected,
    onCreateClick,
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

          {/* 우측: 필터, 검색창과 버튼들 */}
          <div className="flex items-center gap-8">
            {/* 권한 필터 */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-[106px]"
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
            >
              {ROLE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 검색창 */}
            <SearchWithButton placeholder="검색어 입력" />

            {/* 버튼 그룹 */}
            <div className="flex items-center gap-4">
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
                onClick={onCreateClick}
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
          title="사용자 삭제"
          message={`선택한 ${selectedCount}개 사용자를 삭제하시겠습니까?`}
        />
      </>
    );
  }
);

UserActionBar.displayName = "UserActionBar";

export default UserActionBar;
