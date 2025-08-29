import { useCallback } from "react";
import { autoAssignWorkSlots } from "@/modules/work/api";

interface AutoAssignOptions {
  max_assignments?: number;
  min_rest_minutes?: number;
}

interface UseAutoAssignReturn {
  handleAutoAssign: (
    golfCourseId: string,
    date: string,
    options?: AutoAssignOptions
  ) => Promise<boolean>;
  handleFill: (
    golfCourseId: string,
    date: string,
    options?: AutoAssignOptions
  ) => Promise<boolean>;
}

export const useAutoAssign = (onSuccess?: () => void): UseAutoAssignReturn => {
  const handleAutoAssign = useCallback(
    async (
      golfCourseId: string,
      date: string,
      options: AutoAssignOptions = {}
    ): Promise<boolean> => {
      const { max_assignments = 2, min_rest_minutes = 300 } = options;

      try {
        const result = await autoAssignWorkSlots(golfCourseId, date, {
          max_assignments,
          min_rest_minutes,
        });

        if (result.success) {
          console.log("자동 배정 완료:", result.message);
          onSuccess?.();
          return true;
        } else {
          console.error("자동 배정 실패:", result.message);
          return false;
        }
      } catch (error) {
        console.error("자동 배정 중 오류 발생:", error);
        return false;
      }
    },
    [onSuccess]
  );

  const handleFill = useCallback(
    async (
      golfCourseId: string,
      date: string,
      options?: AutoAssignOptions
    ): Promise<boolean> => {
      return handleAutoAssign(golfCourseId, date, options);
    },
    [handleAutoAssign]
  );

  return {
    handleAutoAssign,
    handleFill,
  };
};
