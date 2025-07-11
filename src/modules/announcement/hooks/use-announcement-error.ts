"use client";

import { useState, useCallback } from "react";
import {
  ExtendedError,
  ErrorCode,
  parseError,
  createAnnouncementError,
  logError,
  getUserErrorMessage,
} from "../utils/error-handler";

/**
 * 공지사항 에러 관리 훅
 */
export const useAnnouncementError = () => {
  const [error, setError] = useState<ExtendedError | null>(null);
  const [errorHistory, setErrorHistory] = useState<ExtendedError[]>([]);

  /**
   * 에러 처리 (원시 에러를 파싱하여 ExtendedError로 변환)
   */
  const handleError = useCallback((rawError: unknown, context?: string) => {
    const parsedError = parseError(rawError);

    // 에러 로깅
    logError(parsedError, context);

    // 에러 히스토리에 추가
    setErrorHistory((prev) => [...prev, parsedError]);

    // 현재 에러 설정
    setError(parsedError);

    return parsedError;
  }, []);

  /**
   * 특정 에러 코드로 에러 생성
   */
  const handleApiError = useCallback(
    (rawError: unknown, code: ErrorCode, context?: string) => {
      const parsedError = createAnnouncementError(
        code,
        rawError instanceof Error ? rawError.message : String(rawError)
      );

      // 에러 로깅
      logError(parsedError, context);

      // 에러 히스토리에 추가
      setErrorHistory((prev) => [...prev, parsedError]);

      // 현재 에러 설정
      setError(parsedError);

      return parsedError;
    },
    []
  );

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 에러 히스토리 초기화
   */
  const clearErrorHistory = useCallback(() => {
    setErrorHistory([]);
  }, []);

  /**
   * 사용자 친화적인 에러 메시지 가져오기
   */
  const getUserFriendlyMessage = useCallback(
    (currentError: ExtendedError | null = null): string => {
      const targetError = currentError || error;
      return targetError ? getUserErrorMessage(targetError) : "";
    },
    [error]
  );

  /**
   * 에러가 특정 타입인지 확인
   */
  const isErrorType = useCallback(
    (code: ErrorCode, currentError: ExtendedError | null = null): boolean => {
      const targetError = currentError || error;
      return targetError?.code === code;
    },
    [error]
  );

  /**
   * 에러가 중요한지 확인 (사용자에게 즉시 알려야 하는지)
   */
  const isCriticalError = useCallback(
    (currentError: ExtendedError | null = null): boolean => {
      const targetError = currentError || error;
      return targetError?.severity === "critical";
    },
    [error]
  );

  /**
   * 에러 재시도 가능 여부 확인
   */
  const isRetryable = useCallback(
    (error: ExtendedError | null = null): boolean => {
      const currentError = error || error;
      return currentError?.retryable || false;
    },
    [error]
  );

  /**
   * 에러 심각도 확인
   */
  const isHighSeverity = useCallback(
    (error: ExtendedError | null = null): boolean => {
      const currentError = error || error;
      return (
        currentError?.severity === "high" ||
        currentError?.severity === "critical"
      );
    },
    [error]
  );

  /**
   * 에러 통계 정보 가져오기
   */
  const getErrorStats = useCallback(() => {
    const totalErrors = errorHistory.length;
    const criticalErrors = errorHistory.filter(
      (err) => err.severity === "critical"
    ).length;
    const highErrors = errorHistory.filter(
      (err) => err.severity === "high"
    ).length;
    const retryableErrors = errorHistory.filter((err) => err.retryable).length;

    const errorsByCategory = errorHistory.reduce((acc, err) => {
      acc[err.category] = (acc[err.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsByCode = errorHistory.reduce((acc, err) => {
      acc[err.code] = (acc[err.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors,
      criticalErrors,
      highErrors,
      retryableErrors,
      errorsByCategory,
      errorsByCode,
    };
  }, [errorHistory]);

  return {
    error,
    errorHistory,
    handleError,
    handleApiError,
    clearError,
    clearErrorHistory,
    getUserFriendlyMessage,
    isRetryable,
    isHighSeverity,
    isErrorType,
    isCriticalError,
    getErrorStats,
  };
};
