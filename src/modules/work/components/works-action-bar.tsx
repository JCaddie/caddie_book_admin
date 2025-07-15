"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button, Dropdown, Search } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { GOLF_COURSE_DROPDOWN_OPTIONS } from "@/shared/constants/golf-course";

interface WorksActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onCreate: () => void;
  // 골프장 필터링 props (MASTER 권한에서만 사용)
  selectedGolfCourseId?: string;
  onGolfCourseChange?: (golfCourseId: string) => void;
}

const WorksActionBar: React.FC<WorksActionBarProps> = ({
  totalCount,
  selectedCount,
  searchTerm,
  onSearchChange,
  onDelete,
  onCreate,
  selectedGolfCourseId = "",
  onGolfCourseChange,
}) => {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  const handleGolfCourseFilterChange = (value: string) => {
    if (onGolfCourseChange) {
      onGolfCourseChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 총 건수 */}
      <div className="text-base font-bold text-black">총 {totalCount}건</div>

      {/* 오른쪽: 골프장 드롭다운 + 검색창 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* MASTER 권한일 때만 골프장 선택 드롭다운 표시 */}
        {isMaster && onGolfCourseChange && (
          <Dropdown
            options={GOLF_COURSE_DROPDOWN_OPTIONS}
            value={selectedGolfCourseId}
            onChange={handleGolfCourseFilterChange}
            placeholder="골프장 선택"
            containerClassName="w-48"
          />
        )}

        {/* 검색 필드 */}
        <Search
          placeholder="골프장명 검색"
          containerClassName="w-[360px]"
          onChange={onSearchChange}
          value={searchTerm}
        />

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          {/* 삭제 버튼 */}
          <Button
            variant="secondary"
            size="md"
            onClick={onDelete}
            disabled={selectedCount === 0}
            className="w-24"
          >
            삭제
          </Button>

          {/* 생성 버튼 */}
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={24} />}
            onClick={onCreate}
            className="bg-[#FEB912] hover:bg-[#E5A50F] text-white font-semibold w-24"
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorksActionBar;
