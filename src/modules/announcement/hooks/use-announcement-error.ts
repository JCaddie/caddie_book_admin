import { useState, useCallback } from "react";
import { ApiError } from "@/shared/types";
import { ANNOUNCEMENT_MESSAGES } from "../constants";

interface UseAnnouncementErrorReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleApiError: (
    error: unknown,
    operation: keyof typeof ANNOUNCEMENT_MESSAGES.ERROR
  ) => void;
  clearError: () => void;
}

/**
 * 공지사항 관련 에러 상태를 관리하는 훅
 */
export const useAnnouncementError = (): UseAnnouncementErrorReturn => {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback(
    (error: unknown, operation: keyof typeof ANNOUNCEMENT_MESSAGES.ERROR) => {
      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        const apiError = error as ApiError;
        errorMessage = apiError.message;
      } else {
        errorMessage = ANNOUNCEMENT_MESSAGES.ERROR[operation];
      }

      setError(errorMessage);
      console.error(`공지사항 ${operation} 중 오류 발생:`, error);
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleApiError,
    clearError,
  };
};
