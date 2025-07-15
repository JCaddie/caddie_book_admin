"use client";

import { useCallback, useMemo, useState } from "react";
import { GOLF_COURSE_LIST } from "@/shared/constants/golf-course";

export interface UseGolfCourseFilterReturn {
  selectedGolfCourseId: string;
  searchTerm: string;
  setSelectedGolfCourseId: (id: string) => void;
  setSearchTerm: (term: string) => void;
  handleGolfCourseChange: (golfCourseId: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFilteredData: <
    T extends { golfCourseName?: string; golfCourse?: string; name?: string }
  >(
    data: T[]
  ) => T[];
  selectedGolfCourseName: string | null;
}

export const useGolfCourseFilter = (): UseGolfCourseFilterReturn => {
  const [selectedGolfCourseId, setSelectedGolfCourseId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 선택된 골프장 이름 가져오기
  const selectedGolfCourseName = useMemo(() => {
    if (!selectedGolfCourseId) return null;
    const course = GOLF_COURSE_LIST.find(
      (course) => course.id === selectedGolfCourseId
    );
    return course?.name || null;
  }, [selectedGolfCourseId]);

  // 골프장 드롭다운 변경 핸들러
  const handleGolfCourseChange = useCallback((golfCourseId: string) => {
    setSelectedGolfCourseId(golfCourseId);
    // 드롭다운 선택 시 검색어 클리어
    if (golfCourseId) {
      setSearchTerm("");
    }
  }, []);

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      // 검색 시 드롭다운 선택 클리어
      if (value) {
        setSelectedGolfCourseId("");
      }
    },
    []
  );

  // 데이터 필터링 함수
  const getFilteredData = useCallback(
    <T extends { golfCourseName?: string; golfCourse?: string; name?: string }>(
      data: T[]
    ): T[] => {
      return data.filter((item) => {
        // 골프장 필드명 우선순위: golfCourseName > golfCourse > name
        const golfCourseName =
          item.golfCourseName || item.golfCourse || item.name || "";

        // 드롭다운으로 특정 골프장 선택한 경우
        if (selectedGolfCourseId && selectedGolfCourseName) {
          return golfCourseName === selectedGolfCourseName;
        }

        // 검색어로 필터링하는 경우
        if (searchTerm) {
          return golfCourseName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }

        // 필터링 조건이 없으면 모든 데이터 반환
        return true;
      });
    },
    [selectedGolfCourseId, selectedGolfCourseName, searchTerm]
  );

  return {
    selectedGolfCourseId,
    searchTerm,
    setSelectedGolfCourseId,
    setSearchTerm,
    handleGolfCourseChange,
    handleSearchChange,
    getFilteredData,
    selectedGolfCourseName,
  };
};
