import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AnnouncementFilters, AnnouncementWithNo } from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import { fetchAnnouncements } from "../api/announcement-api";
import {
  addNumberToAnnouncements,
  transformAnnouncementListResponse,
} from "../utils";

/**
 * 공지사항 데이터 조회 훅
 * 순수하게 데이터 fetching만 담당합니다.
 */
export const useAnnouncementData = (
  filters: AnnouncementFilters,
  currentPage: number
) => {
  // API 데이터 조회
  const {
    data: apiResponse,
    error: queryError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      ANNOUNCEMENT_CONSTANTS.API.CACHE_KEYS.ANNOUNCEMENTS,
      currentPage,
      filters,
    ],
    queryFn: () =>
      fetchAnnouncements(
        filters,
        currentPage,
        ANNOUNCEMENT_CONSTANTS.UI.PAGE_SIZE
      ),
    staleTime: ANNOUNCEMENT_CONSTANTS.API.CACHE_TIME.STALE_TIME,
    refetchOnWindowFocus: false,
  });

  // 데이터 변환 및 가공
  const transformedData = useMemo(() => {
    if (!apiResponse) return null;
    return transformAnnouncementListResponse(apiResponse);
  }, [apiResponse]);

  // 번호가 추가된 데이터
  const dataWithNo = useMemo((): AnnouncementWithNo[] => {
    if (!transformedData?.items) return [];

    return addNumberToAnnouncements(
      transformedData.items,
      currentPage,
      ANNOUNCEMENT_CONSTANTS.UI.PAGE_SIZE
    );
  }, [transformedData?.items, currentPage]);

  // 메타 데이터 계산
  const metadata = useMemo(() => {
    if (!transformedData) {
      return {
        totalCount: 0,
        totalPages: 0,
        realDataCount: 0,
        hasData: false,
      };
    }

    return {
      totalCount: transformedData.totalCount,
      totalPages: transformedData.totalPages,
      realDataCount: transformedData.items.length,
      hasData: transformedData.items.length > 0,
    };
  }, [transformedData]);

  // 에러 메시지 생성
  const errorMessage = useMemo(() => {
    if (!queryError) return null;

    if (queryError instanceof Error) {
      return queryError.message;
    }

    return "공지사항을 불러오는 중 오류가 발생했습니다.";
  }, [queryError]);

  return {
    // 데이터
    data: dataWithNo,
    rawData: apiResponse,

    // 메타데이터
    ...metadata,

    // 상태
    isLoading,
    isFetching,
    error: errorMessage,

    // 액션
    refetch,
  };
};
