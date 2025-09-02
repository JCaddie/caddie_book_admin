import { useMemo } from "react";
import { QUERY_ERROR_MESSAGES } from "../lib/query-config";

/**
 * React Query 에러를 표준화된 메시지로 변환하는 훅
 */
export const useQueryError = (error: unknown, fallbackMessage?: string) => {
  return useMemo(() => {
    if (!error) return null;

    // 기본 에러 메시지 결정
    const defaultMessage = fallbackMessage || QUERY_ERROR_MESSAGES.FETCH_FAILED;

    // Error 객체인 경우
    if (error instanceof Error) {
      // 401 인증 실패 에러 처리
      if (
        error.message.includes("401") ||
        error.message.includes("인증 실패") ||
        error.message.includes("토큰이 만료")
      ) {
        return "인증이 만료되었습니다. 다시 로그인해주세요.";
      }

      // 403 권한 부족 에러 처리
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden") ||
        error.message.includes("권한")
      ) {
        return QUERY_ERROR_MESSAGES.PERMISSION_ERROR;
      }

      // 네트워크 에러 처리
      if (
        error.message.includes("Network") ||
        error.message.includes("fetch")
      ) {
        return QUERY_ERROR_MESSAGES.NETWORK_ERROR;
      }

      return error.message;
    }

    // HTTP 상태 코드 기반 에러 처리
    if (typeof error === "object" && error !== null) {
      const err = error as any;

      if (err.status === 401) {
        return "인증이 만료되었습니다. 다시 로그인해주세요.";
      }

      if (err.status === 403) {
        return QUERY_ERROR_MESSAGES.PERMISSION_ERROR;
      }

      if (err.status >= 500) {
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }

      if (err.status >= 400) {
        return err.message || "요청 처리 중 오류가 발생했습니다.";
      }
    }

    return defaultMessage;
  }, [error, fallbackMessage]);
};

/**
 * Mutation 에러 처리를 위한 전용 훅
 */
export const useMutationError = (
  error: unknown,
  operation: "create" | "update" | "delete"
) => {
  const errorMessageMap = {
    create: QUERY_ERROR_MESSAGES.CREATE_FAILED,
    update: QUERY_ERROR_MESSAGES.UPDATE_FAILED,
    delete: QUERY_ERROR_MESSAGES.DELETE_FAILED,
  };

  return useQueryError(error, errorMessageMap[operation]);
};
