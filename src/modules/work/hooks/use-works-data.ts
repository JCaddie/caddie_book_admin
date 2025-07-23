import { useEffect, useMemo, useState } from "react";
import { Work } from "@/modules/work/types";
import { WORKS_PAGE_SIZE } from "@/modules/work/constants";
import { usePagination } from "@/shared/hooks";
import { fetchWorkSchedules } from "@/modules/work/api";

export interface UseWorksDataReturn {
  worksList: Work[];
  setWorksList: React.Dispatch<React.SetStateAction<Work[]>>;
  filteredWorks: Work[];
  currentData: Work[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  handlePageChange: (page: number) => void;
  refetch: () => Promise<void>;
}

const useWorksData = (): UseWorksDataReturn => {
  const [worksList, setWorksList] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 가져오기
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchWorkSchedules();
      setWorksList(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
      console.error("근무 스케줄 데이터 로딩 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchData();
  }, []);

  // 필터링된 데이터 (현재는 모든 데이터를 그대로 사용)
  const filteredWorks = useMemo(() => {
    return worksList;
  }, [worksList]);

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

  return {
    worksList,
    setWorksList,
    filteredWorks,
    currentData: paginatedData,
    currentPage,
    totalPages,
    isLoading,
    error,
    handlePageChange,
    refetch: fetchData,
  };
};

export default useWorksData;
