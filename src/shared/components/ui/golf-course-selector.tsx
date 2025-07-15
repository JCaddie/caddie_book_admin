"use client";

import React from "react";
import { Dropdown, Search } from "./";
import { GOLF_COURSE_DROPDOWN_OPTIONS } from "@/shared/constants/golf-course";

export interface GolfCourseSelectorProps {
  selectedGolfCourseId: string;
  searchTerm: string;
  onGolfCourseChange: (golfCourseId: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const GolfCourseSelector: React.FC<GolfCourseSelectorProps> = ({
  selectedGolfCourseId,
  searchTerm,
  onGolfCourseChange,
  onSearchChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Dropdown
        options={GOLF_COURSE_DROPDOWN_OPTIONS}
        value={selectedGolfCourseId}
        onChange={onGolfCourseChange}
        placeholder="골프장 선택"
        containerClassName="w-48"
      />
      <Search
        placeholder="골프장명 검색"
        value={searchTerm}
        onChange={onSearchChange}
        containerClassName="w-64"
      />
    </div>
  );
};

export default GolfCourseSelector;
