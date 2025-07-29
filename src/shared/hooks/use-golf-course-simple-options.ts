import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";

export interface GolfCourseOption {
  value: string;
  label: string;
}

export interface UseGolfCourseSimpleOptionsReturn {
  options: GolfCourseOption[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 골프장 간소 목록을 드롭다운 옵션으로 가져오는 훅
 * 여러 화면에서 공통으로 사용 가능
 */
export const useGolfCourseSimpleOptions =
  (): UseGolfCourseSimpleOptionsReturn => {
    const { data, isLoading, error, refetch } = useGolfCoursesSimple();

    // 골프장 데이터를 드롭다운 옵션으로 변환
    const options: GolfCourseOption[] = data?.data
      ? [
          { value: "", label: "골프장 선택" },
          ...data.data.map((course) => ({
            value: course.id,
            label: course.name,
          })),
        ]
      : [{ value: "", label: "골프장 선택" }];

    return {
      options,
      isLoading,
      error,
      refetch,
    };
  };
