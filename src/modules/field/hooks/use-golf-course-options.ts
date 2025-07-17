import { useQuery } from "@tanstack/react-query";
import { fetchSimpleGolfCourses } from "../api/field-api";

export const useGolfCourseOptions = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["golf-courses-simple"],
    queryFn: fetchSimpleGolfCourses,
    staleTime: 120000,
  });

  // 항상 배열로 변환 (API 에러/비정상 응답 방지)
  const safeData = Array.isArray(data) ? data : [];
  const options = safeData.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  return { options, isLoading, isError };
};
