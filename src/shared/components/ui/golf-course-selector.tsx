"use client";

import React from "react";
import { Dropdown } from "./";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";

export interface GolfCourseSelectorProps {
  selectedGolfCourseId: string;
  onGolfCourseChange: (golfCourseId: string) => void;
  className?: string;
}

const GolfCourseSelector: React.FC<GolfCourseSelectorProps> = ({
  selectedGolfCourseId,
  onGolfCourseChange,
  className = "",
}) => {
  // 골프장 간소 목록 데이터 가져오기
  const { data: golfCoursesData, isLoading, error } = useGolfCoursesSimple();

  // 드롭다운 옵션 생성
  const dropdownOptions = React.useMemo(() => {
    if (!golfCoursesData?.data) {
      return [];
    }

    return golfCoursesData.data.map((golfCourse) => ({
      value: golfCourse.id,
      label: golfCourse.name,
    }));
  }, [golfCoursesData]);

  // 로딩 중이거나 에러가 있을 때 처리
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-48 h-10 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (error) {
    console.error("골프장 목록 조회 실패:", error);
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-48 h-10 bg-red-100 border border-red-300 rounded-md flex items-center justify-center">
          <span className="text-red-600 text-sm">골프장 목록 조회 실패</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Dropdown
        options={dropdownOptions}
        value={selectedGolfCourseId}
        onChange={onGolfCourseChange}
        placeholder="골프장 선택"
        containerClassName="w-48"
      />
    </div>
  );
};

export default GolfCourseSelector;
