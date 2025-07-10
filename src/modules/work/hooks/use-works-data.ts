import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "@/modules/work/types";
import { SAMPLE_GOLF_COURSES, WORKS_PAGE_SIZE } from "@/modules/work/constants";
import { usePagination, useTableData } from "@/shared/hooks";

export interface UseWorksDataReturn {
  worksList: Work[];
  setWorksList: React.Dispatch<React.SetStateAction<Work[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredWorks: Work[];
  paddedData: Work[];
  currentPage: number;
  totalPages: number;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageChange: (page: number) => void;
}

// 샘플 데이터 생성 함수
const generateSampleWorks = (count: number): Work[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `work-${index + 1}`,
    no: index + 1,
    date: "2025.01.06",
    golfCourse: SAMPLE_GOLF_COURSES[index % SAMPLE_GOLF_COURSES.length],
    totalStaff: 130,
    availableStaff: 130,
    status: "planning" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const useWorksData = (): UseWorksDataReturn => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [worksList, setWorksList] = useState<Work[]>([]);

  // 초기 데이터 생성
  const initialWorks = useMemo(() => generateSampleWorks(26), []);

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 초기 데이터 설정
  useEffect(() => {
    if (worksList.length === 0) {
      setWorksList(initialWorks);
    }
  }, [initialWorks, worksList.length]);

  // 필터링된 데이터
  const filteredWorks = useMemo(() => {
    return worksList.filter((work) => {
      const matchesSearch =
        searchTerm === "" ||
        work.golfCourse.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [worksList, searchTerm]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredWorks,
      itemsPerPage: WORKS_PAGE_SIZE,
    });

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * WORKS_PAGE_SIZE;
    return currentData.map((work, index) => ({
      ...work,
      no: startIndex + index + 1,
    }));
  }, [currentData, currentPage]);

  // 빈 행 템플릿
  const emptyRowTemplate = useMemo(
    () => ({
      no: 0,
      date: "",
      golfCourse: "",
      totalStaff: 0,
      availableStaff: 0,
      status: "planning" as const,
      createdAt: "",
      updatedAt: "",
    }),
    []
  );

  // 패딩된 데이터 생성 (빈 행 추가)
  const { paddedData } = useTableData({
    data: paginatedData,
    itemsPerPage: WORKS_PAGE_SIZE,
    emptyRowTemplate,
  });

  // 검색 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    worksList,
    setWorksList,
    searchTerm,
    setSearchTerm,
    filteredWorks,
    paddedData,
    currentPage,
    totalPages,
    handleSearchChange,
    handlePageChange,
  };
};

export default useWorksData;
