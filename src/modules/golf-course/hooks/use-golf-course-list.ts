import { useQuery } from "@tanstack/react-query";
import { fetchGolfCourses } from "../api/golf-course-api";
import {
  GolfCourseFilters,
  GolfCourseListResponse,
} from "../types/golf-course";

export const useGolfCourseList = (
  page: number,
  searchTerm: string,
  filters: GolfCourseFilters
) => {
  return useQuery<GolfCourseListResponse, Error>({
    queryKey: ["golf-courses", page, searchTerm, filters],
    queryFn: () => fetchGolfCourses({ page, searchTerm, filters }),
    staleTime: 120000, // 2분
  });
};
