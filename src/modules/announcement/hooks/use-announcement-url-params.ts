import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementFilters } from "../types";

interface UseAnnouncementUrlParamsProps {
  onFiltersChange: (filters: Partial<AnnouncementFilters>) => void;
}

/**
 * URL 파라미터를 처리하여 필터 상태를 초기화하는 훅
 */
export const useAnnouncementUrlParams = ({
  onFiltersChange,
}: UseAnnouncementUrlParamsProps): void => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const filters: Partial<AnnouncementFilters> = {};

    // 검색어 파라미터 처리
    const searchParam = searchParams.get("search");
    if (searchParam) {
      filters.searchTerm = decodeURIComponent(searchParam);
    }

    // 게시 상태 파라미터 처리
    const publishedParam = searchParams.get("published");
    if (publishedParam) {
      const isPublished = publishedParam.toLowerCase() === "true";
      filters.isPublished = isPublished;
    }

    // 날짜 범위 파라미터 처리
    const startDateParam = searchParams.get("startDate");
    if (startDateParam) {
      filters.startDate = startDateParam;
    }

    const endDateParam = searchParams.get("endDate");
    if (endDateParam) {
      filters.endDate = endDateParam;
    }

    // 필터가 하나라도 있으면 상태 업데이트
    if (Object.keys(filters).length > 0) {
      onFiltersChange(filters);
    }
  }, [searchParams, onFiltersChange]);
};
