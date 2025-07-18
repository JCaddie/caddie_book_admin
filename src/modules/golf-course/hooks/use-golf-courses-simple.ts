import { useQuery } from "@tanstack/react-query";
import {
  fetchGolfCoursesSimple,
  GolfCourseSimpleResponse,
} from "../api/golf-course-api";

/**
 * 골프장 간소 목록을 가져오는 React Query 훅 (드롭다운용)
 */
export const useGolfCoursesSimple = () => {
  return useQuery<GolfCourseSimpleResponse, Error>({
    queryKey: ["golf-courses-simple"],
    queryFn: fetchGolfCoursesSimple,
    staleTime: 10 * 60 * 1000, // 10분
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * 골프장 간소 목록 쿼리 키 상수
 */
export const GOLF_COURSES_SIMPLE_QUERY_KEY = ["golf-courses-simple"] as const;
