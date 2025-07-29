import { useQuery } from "@tanstack/react-query";
import { fetchGolfCourses } from "../api/golf-course-api";
import {
  GolfCourseFilters,
  GolfCourseListResponse,
} from "../types/golf-course";
import { usePermissionError } from "@/shared/hooks";

export const useGolfCourseList = (
  page: number,
  searchTerm: string,
  filters: GolfCourseFilters
) => {
  const { handlePermissionError } = usePermissionError();

  const query = useQuery<GolfCourseListResponse, Error>({
    queryKey: ["golf-courses", page, searchTerm, filters],
    queryFn: () => fetchGolfCourses(page, searchTerm, filters),
    staleTime: 120000, // 2분
  });

  // 에러가 있을 때 권한 에러 처리
  if (query.error) {
    handlePermissionError(query.error);
  }

  return query;
};
