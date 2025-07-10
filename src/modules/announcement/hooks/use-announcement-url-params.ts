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

    // 공지사항 타입 파라미터 처리
    const typeParam = searchParams.get("type");
    if (typeParam && (typeParam === "JCADDIE" || typeParam === "GOLF_COURSE")) {
      filters.type = typeParam;

      // 타입에 따른 기본 검색어 설정
      const typeSearchTerm = typeParam === "JCADDIE" ? "제이캐디" : "골프장";
      if (!searchParam) {
        // 별도 검색어가 없는 경우에만 적용
        filters.searchTerm = typeSearchTerm;
      }
    }

    // 필터가 하나라도 있으면 상태 업데이트
    if (Object.keys(filters).length > 0) {
      onFiltersChange(filters);
    }
  }, [searchParams, onFiltersChange]);
};
