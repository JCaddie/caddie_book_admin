import { useQuery } from "@tanstack/react-query";
import { fetchGolfCourseDetail } from "../api/golf-course-api";
import { GolfCourseDetailResponse } from "../types/golf-course";

export const useGolfCourseDetail = (id: string) => {
  const query = useQuery<GolfCourseDetailResponse, Error>({
    queryKey: ["golf-course-detail", id],
    queryFn: () => fetchGolfCourseDetail(id),
    enabled: !!id,
    staleTime: 120000, // 2분
  });

  return {
    ...query,
    data: query.data?.data, // API 응답의 data 부분만 반환
  };
};
