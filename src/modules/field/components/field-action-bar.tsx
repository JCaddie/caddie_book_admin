"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button, GolfCourseSelector, Search } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { FIELD_CONSTANTS } from "../constants";

interface FieldActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
  // 골프장 필터링 props (MASTER 권한에서만 사용)
  selectedGolfCourseId?: string;
  golfCourseSearchTerm?: string;
  onGolfCourseChange?: (golfCourseId: string) => void;
  onGolfCourseSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FieldActionBar: React.FC<FieldActionBarProps> = ({
  totalCount,
  selectedCount,
  searchTerm,
  onSearchChange,
  onDeleteClick,
  onCreateClick,
  selectedGolfCourseId = "",
  golfCourseSearchTerm = "",
  onGolfCourseChange,
  onGolfCourseSearchChange,
}) => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  return (
    <div className="space-y-4">
      {/* MASTER 권한일 때만 골프장 선택 영역 표시 */}
      {isMaster && onGolfCourseChange && onGolfCourseSearchChange && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-black">골프장 선택</span>
          </div>
          <GolfCourseSelector
            selectedGolfCourseId={selectedGolfCourseId}
            searchTerm={golfCourseSearchTerm}
            onGolfCourseChange={onGolfCourseChange}
            onSearchChange={onGolfCourseSearchChange}
          />
        </div>
      )}

      {/* 기존 액션바 영역 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-black">
            총 {totalCount}건
          </span>
        </div>

        {/* 오른쪽: 검색창 + 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 검색 */}
          <Search
            placeholder={FIELD_CONSTANTS.UI_TEXT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            containerClassName="w-[360px]"
          />

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2">
            {/* 삭제 버튼 */}
            <Button
              variant="secondary"
              size="md"
              onClick={onDeleteClick}
              disabled={selectedCount === 0}
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
              {FIELD_CONSTANTS.UI_TEXT.CREATE_BUTTON}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
