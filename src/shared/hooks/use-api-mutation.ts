import { useCallback, useState } from "react";
import { usePermissionError } from "./use-permission-error";

// ================================
// 타입 정의
// ================================

export interface UseApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  mutationFn: (variables: TVariables) => Promise<TData>;
}

export interface UseApiMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  reset: () => void;
}

// ================================
// 훅 구현
// ================================

export function useApiMutation<TData, TVariables>(
  options: UseApiMutationOptions<TData, TVariables>
): UseApiMutationReturn<TData, TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handlePermissionError } = usePermissionError();

  const { mutationFn, onSuccess, onError, onSettled } = options;

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.");

        // 권한 에러 처리
        handlePermissionError(error);

        setError(error.message);
        onError?.(error);

        throw error;
      } finally {
        setIsLoading(false);
        onSettled?.();
      }
    },
    [mutationFn, onSuccess, onError, onSettled, handlePermissionError]
  );

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      return mutate(variables);
    },
    [mutate]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    mutate,
    mutateAsync,
    isLoading,
    error,
    clearError,
    reset,
  };
}
