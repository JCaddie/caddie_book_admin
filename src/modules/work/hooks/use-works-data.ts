import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Work } from "@/modules/work/types";
import { WORKS_PAGE_SIZE } from "@/modules/work/constants";
import { usePagination } from "@/shared/hooks";
import { fetchWorkSchedules } from "@/modules/work/api";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";
import { addNumberToItems } from "@/shared/utils/pagination-utils";

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
  // React Query를 사용한 데이터 페칭
  const {
    data: worksList = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [CACHE_KEYS.WORK_SCHEDULES],
    queryFn: fetchWorkSchedules,
    ...QUERY_CONFIG.REALTIME_OPTIONS,
  });

  // 기존 인터페이스 호환성을 위한 setWorksList 함수 (사용되지 않지만 유지)
  const setWorksList = () => {
    console.warn(
      "setWorksList는 React Query 버전에서는 사용되지 않습니다. refetch를 사용하세요."
    );
  };

  // 표준화된 에러 처리
  const error = useQueryError(queryError, "데이터를 불러오는데 실패했습니다.");

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
    return addNumberToItems(currentData, currentPage, WORKS_PAGE_SIZE);
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
    refetch,
  };
};

export default useWorksData;
