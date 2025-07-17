import { useQuery } from "@tanstack/react-query";
import { fetchGolfCourseDetail } from "../api/golf-course-api";
import { GolfCourseDetail } from "../types/golf-course";

export const useGolfCourseDetail = (id: string) => {
  return useQuery<GolfCourseDetail, Error>({
    queryKey: ["golf-course-detail", id],
    queryFn: () => fetchGolfCourseDetail(id),
    enabled: !!id,
    staleTime: 120000, // 2분
  });
};
