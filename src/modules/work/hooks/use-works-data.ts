import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "@/modules/work/types";
import { SAMPLE_GOLF_COURSES } from "@/modules/work/constants";

export interface UseWorksDataReturn {
  worksList: Work[];
  setWorksList: React.Dispatch<React.SetStateAction<Work[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredWorks: Work[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    handleSearchChange,
  };
};

export default useWorksData;
