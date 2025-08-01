import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCart } from "../api/cart-api";
import { ApiCreateCartRequest } from "../types";
import { CACHE_KEYS } from "@/shared/lib/query-config";
import { useMutationError } from "@/shared/hooks/use-query-error";

interface UseCartCreateReturn {
  createNewCart: (data: {
    name: string;
    golf_course_id: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCartCreate = (onSuccess?: () => void): UseCartCreateReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; golf_course_id: string }) => {
      // API 요청 데이터 구성
      const requestData: ApiCreateCartRequest = {
        name: data.name,
        golf_course: data.golf_course_id,
        battery_level: 0, // 배터리는 항상 0으로 자동 설정
      };

      return createCart(requestData);
    },
    onSuccess: () => {
      // 카트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CARTS] });
      // 성공 시 콜백 실행
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("카트 생성 중 오류 발생:", error);
    },
  });

  const createNewCart = async (data: {
    name: string;
    golf_course_id: string;
  }) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      // 에러는 이미 mutation에서 처리되므로 다시 던지기만 함
      throw err;
    }
  };

  return {
    createNewCart,
    isLoading: mutation.isPending,
    error: useMutationError(mutation.error, "create"),
  };
};
