import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cart } from "../types";
import { deleteCartsBulk } from "../api";
import { CACHE_KEYS } from "@/shared/lib/query-config";
import { useMutationError } from "@/shared/hooks/use-query-error";

interface UseCartActionsProps {
  onCartListUpdate: () => Promise<void>;
  onSelectionClear: () => void;
}

/**
 * 카트 액션(삭제, 생성 등) 관리 훅
 */
export const useCartActions = ({
  onCartListUpdate,
  onSelectionClear,
}: UseCartActionsProps) => {
  const queryClient = useQueryClient();

  // 카트 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: async (cartIds: string[]) => {
      return deleteCartsBulk(cartIds);
    },
    onSuccess: async () => {
      // 카트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.CARTS] });
      // 선택 상태 초기화
      onSelectionClear();
      // 추가 업데이트 로직 실행
      await onCartListUpdate();
    },
    onError: (error: Error) => {
      console.error("카트 삭제 중 오류 발생:", error);
    },
  });

  // 선택된 카트 삭제
  const deleteSelectedCarts = useCallback(
    async (selectedCarts: Cart[]) => {
      if (selectedCarts.length === 0) return;

      const cartIds = selectedCarts.map((cart) => cart.id);
      await deleteMutation.mutateAsync(cartIds);
    },
    [deleteMutation]
  );

  // 새 카트 생성 - 기존 인터페이스 호환성을 위해 유지
  const createNewCart = useCallback(
    (cartData: Omit<Cart, "id" | "no" | "createdAt" | "updatedAt">) => {
      // 실제 생성은 useCartCreate 훅에서 담당
      if (process.env.NODE_ENV === "development") {
        console.log("새 카트 생성:", cartData);
      }
      // 생성 후 목록 새로고침
      onCartListUpdate();
    },
    [onCartListUpdate]
  );

  return {
    isDeleting: deleteMutation.isPending,
    error: useMutationError(deleteMutation.error, "delete"),
    deleteSelectedCarts,
    createNewCart,
  };
};
