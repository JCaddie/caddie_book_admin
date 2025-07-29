"use client";

import React from "react";
import { Search, Trash2 } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";

interface CaddieFilterBarProps {
  totalCount: number;
  selectedCount: number;
  filters: {
    searchTerm: string;
    selectedGroup: string;
    selectedSpecialTeam: string;
    selectedGolfCourseId: string;
  };
  onGroupChange: (value: string) => void;
  onSpecialTeamChange: (value: string) => void;
  onGolfCourseChange: (value: string) => void;
  onDeleteSelected: () => void;
}

const CaddieFilterBar: React.FC<CaddieFilterBarProps> = ({
  totalCount,
  selectedCount,
  filters,
  onGroupChange,
  onSpecialTeamChange,
  onGolfCourseChange,
  onDeleteSelected,
}) => {
  // 그룹 선택지 (TODO: API에서 가져오기)
  const groupOptions = [
    { value: "", label: "전체 그룹" },
    { value: "group-1", label: "A조" },
    { value: "group-2", label: "B조" },
    { value: "group-3", label: "C조" },
  ];

  // 특수반 선택지 (TODO: API에서 가져오기)
  const specialTeamOptions = [
    { value: "", label: "전체 특수반" },
    { value: "special-1", label: "마스터반" },
    { value: "special-2", label: "VIP반" },
    { value: "special-3", label: "프리미엄반" },
  ];

  // 골프장 선택지 (TODO: API에서 가져오기)
  const golfCourseOptions = [
    { value: "", label: "전체 골프장" },
    { value: "course-1", label: "강남 골프장" },
    { value: "course-2", label: "서초 골프장" },
    { value: "course-3", label: "송파 골프장" },
  ];

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 영역 */}
      <div className="flex items-center gap-4">
        {/* 검색창 */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="캐디 이름으로 검색"
            value={filters.searchTerm}
            className="pl-10"
            onChange={() => {}} // TODO: 검색 로직 구현
          />
        </div>

        {/* 필터 드롭다운들 */}
        <div className="flex items-center gap-3">
          <Dropdown
            options={groupOptions}
            value={filters.selectedGroup}
            onChange={onGroupChange}
            containerClassName="w-[140px]"
            placeholder="그룹 선택"
          />

          <Dropdown
            options={specialTeamOptions}
            value={filters.selectedSpecialTeam}
            onChange={onSpecialTeamChange}
            containerClassName="w-[140px]"
            placeholder="특수반 선택"
          />

          <Dropdown
            options={golfCourseOptions}
            value={filters.selectedGolfCourseId}
            onChange={onGolfCourseChange}
            containerClassName="w-[140px]"
            placeholder="골프장 선택"
          />
        </div>
      </div>

      {/* 액션 영역 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          전체 <span className="font-semibold text-gray-900">{totalCount}</span>
          명
          {selectedCount > 0 && (
            <>
              {" "}
              • 선택됨{" "}
              <span className="font-semibold text-blue-600">
                {selectedCount}
              </span>
              명
            </>
          )}
        </div>

        {selectedCount > 0 && (
          <Button
            size="sm"
            onClick={onDeleteSelected}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4" />
            선택 삭제 ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default CaddieFilterBar;
