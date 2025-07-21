import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncementDetail } from "../api/announcement-api";
import { transformAnnouncementDetailApiData } from "../utils";

/**
 * 공지사항 상세 조회 훅
 */
export const useAnnouncementDetail = (id: string) => {
  const {
    data: apiData,
    isLoading: loading,
    error: queryError,
    refetch: fetchAnnouncement,
  } = useQuery({
    queryKey: ["announcement", id],
    queryFn: () => fetchAnnouncementDetail(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 백엔드 응답을 프론트엔드 형태로 변환
  const announcement = apiData
    ? transformAnnouncementDetailApiData(apiData)
    : null;

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "공지사항 상세 정보를 불러오는 중 오류가 발생했습니다."
    : null;

  return {
    announcement,
    loading,
    error,
    fetchAnnouncement,
  };
};
