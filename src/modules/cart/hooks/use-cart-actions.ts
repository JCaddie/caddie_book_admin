import { useCallback, useState } from "react";
import { Cart } from "../types";
import { deleteCartsBulk } from "../api";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 선택된 카트 삭제
  const deleteSelectedCarts = useCallback(
    async (selectedCarts: Cart[]) => {
      if (selectedCarts.length === 0) return;

      setIsDeleting(true);
      setError(null);

      try {
        const cartIds = selectedCarts.map((cart) => cart.id);
        await deleteCartsBulk(cartIds);

        // 성공 후 목록 새로고침 및 선택 상태 초기화
        await onCartListUpdate();
        onSelectionClear();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "카트 삭제 중 오류가 발생했습니다.";
        setError(errorMessage);
        console.error("카트 삭제 중 오류 발생:", err);
      } finally {
        setIsDeleting(false);
      }
    },
    [onCartListUpdate, onSelectionClear]
  );

  // 새 카트 생성
  const createNewCart = useCallback(
    (cartData: Omit<Cart, "id" | "no" | "createdAt" | "updatedAt">) => {
      // TODO: 실제 생성 API 호출 후 목록 새로고침
      if (process.env.NODE_ENV === "development") {
        console.log("새 카트 생성:", cartData);
      }
      // 생성 후 목록 새로고침
      onCartListUpdate();
    },
    [onCartListUpdate]
  );

  return {
    isDeleting,
    error,
    deleteSelectedCarts,
    createNewCart,
  };
};
