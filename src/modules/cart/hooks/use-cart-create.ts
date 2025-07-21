import { useState } from "react";
import { createCart } from "../api/cart-api";
import { ApiCreateCartRequest } from "../types";

interface UseCartCreateReturn {
  createNewCart: (data: {
    name: string;
    golf_course_id: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCartCreate = (onSuccess?: () => void): UseCartCreateReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewCart = async (data: {
    name: string;
    golf_course_id: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // API 요청 데이터 구성
      const requestData: ApiCreateCartRequest = {
        name: data.name,
        golf_course: data.golf_course_id,
        battery_level: 0, // 배터리는 항상 0으로 자동 설정
      };

      await createCart(requestData);

      // 성공 시 콜백 실행
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNewCart,
    isLoading,
    error,
  };
};
