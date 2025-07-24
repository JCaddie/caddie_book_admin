"use client";

import { useCallback, useState } from "react";

interface UsePermissionErrorReturn {
  isPermissionError: boolean;
  permissionErrorMessage: string;
  handlePermissionError: (error: Error) => void;
  clearPermissionError: () => void;
}

export const usePermissionError = (): UsePermissionErrorReturn => {
  const [isPermissionError, setIsPermissionError] = useState(false);
  const [permissionErrorMessage, setPermissionErrorMessage] = useState("");

  const handlePermissionError = useCallback((error: Error) => {
    // 권한 부족 에러인지 확인 (401, 403 에러 모두 포함)
    if (
      error.message.includes("권한이 없습니다") ||
      error.message.includes("권한 부족") ||
      error.message.includes("접근 권한이 없습니다")
    ) {
      setIsPermissionError(true);
      setPermissionErrorMessage(error.message);
      return true; // 권한 에러로 처리됨
    }
    return false; // 일반 에러
  }, []);

  const clearPermissionError = useCallback(() => {
    setIsPermissionError(false);
    setPermissionErrorMessage("");
  }, []);

  return {
    isPermissionError,
    permissionErrorMessage,
    handlePermissionError,
    clearPermissionError,
  };
};
