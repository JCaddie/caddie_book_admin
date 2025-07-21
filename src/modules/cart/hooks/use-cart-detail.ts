"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CartDetail, CartHistoryItem } from "../types";
import { fetchCartDetailWithHistory } from "../api/cart-api";
import {
  mapApiCartDetailToCartDetail,
  mapApiCartHistoriesToCartHistories,
} from "../utils";
import { CART_ITEMS_PER_PAGE } from "../constants";

interface UseCartDetailProps {
  cartId: string;
}

interface UseCartDetailReturn {
  cartDetail: CartDetail;
  historyData: CartHistoryItem[];
  currentHistoryData: CartHistoryItem[];
  realDataCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  loadCartDetail: () => Promise<void>;
}

/**
 * 카트 상세 화면 커스텀 훅
 * 카트 상세 정보와 이력 데이터를 관리합니다.
 */
export const useCartDetail = ({
  cartId,
}: UseCartDetailProps): UseCartDetailReturn => {
  // URL에서 현재 페이지 읽기
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  // 상태 관리
  const [cartDetail, setCartDetail] = useState<CartDetail>({
    id: "",
    name: "",
    status: "대기",
    fieldName: "",
    managerName: "",
    golfCourseName: "",
    createdAt: "",
    updatedAt: "",
  });
  const [historyData, setHistoryData] = useState<CartHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const loadCartDetail = useCallback(async () => {
    if (!cartId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 카트 상세 정보 로딩 시작:", cartId);

      const response = await fetchCartDetailWithHistory(cartId);

      // 카트 상세 정보 매핑
      const mappedCartDetail = mapApiCartDetailToCartDetail(response);
      setCartDetail(mappedCartDetail);

      // 이력 데이터 매핑
      const mappedHistories = mapApiCartHistoriesToCartHistories(
        response.histories
      );
      setHistoryData(mappedHistories);

      console.log("✅ 카트 상세 정보 로딩 완료:", {
        cartDetail: mappedCartDetail,
        historiesCount: mappedHistories.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 상세 정보 조회 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("❌ 카트 상세 정보 로딩 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // 페이지네이션 계산
  const { currentHistoryData, totalPages, realDataCount } = useMemo(() => {
    const totalItems = historyData.length;
    const totalPages = Math.ceil(totalItems / CART_ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * CART_ITEMS_PER_PAGE;
    const endIndex = startIndex + CART_ITEMS_PER_PAGE;
    const currentData = historyData.slice(startIndex, endIndex);

    // 페이지네이션된 데이터에 번호 추가
    const dataWithNumbers = currentData.map((item, index) => ({
      ...item,
      no: startIndex + index + 1,
    }));

    return {
      currentHistoryData: dataWithNumbers,
      totalPages: Math.max(totalPages, 1),
      realDataCount: currentData.length,
    };
  }, [historyData, currentPage]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCartDetail();
  }, [loadCartDetail]);

  return {
    cartDetail,
    historyData,
    currentHistoryData,
    realDataCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    loadCartDetail,
  };
};
