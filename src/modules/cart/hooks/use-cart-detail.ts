"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CartDetail, CartHistoryItem } from "../types";
import { fetchCartDetail, fetchCartHistories } from "../api/cart-api";
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
    status: "",
    location: "",
    managerName: "",
    golfCourseName: "",
    golfCourseId: "",
    batteryLevel: 0,
    batteryStatus: "",
    isAvailable: false,
    createdAt: "",
    updatedAt: "",
  });
  const [historyData, setHistoryData] = useState<CartHistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카트 기본 정보 로드
  const loadCartDetail = useCallback(async () => {
    if (!cartId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchCartDetail(cartId);

      // 카트 상세 정보 매핑
      const mappedCartDetail = mapApiCartDetailToCartDetail(response);
      setCartDetail(mappedCartDetail);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 기본 정보 조회 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("카트 기본 정보 로딩 에러:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // 카트 이력 로드
  const loadCartHistories = useCallback(async () => {
    if (!cartId) return;

    try {
      const response = await fetchCartHistories(
        cartId,
        currentPage,
        CART_ITEMS_PER_PAGE
      );

      // 이력 데이터 매핑
      const mappedHistories = mapApiCartHistoriesToCartHistories(
        response.data?.results || []
      );
      setHistoryData(mappedHistories);
      setTotalPages(response.data?.total_pages || 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "카트 이력 조회 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("카트 이력 로딩 에러:", err);
    }
  }, [cartId, currentPage]);

  // 현재 페이지 데이터 계산
  const { currentHistoryData, realDataCount } = useMemo(() => {
    // API에서 이미 페이지네이션된 데이터를 받으므로 그대로 사용
    const dataWithNumbers = historyData.map((item, index) => ({
      ...item,
      no: (currentPage - 1) * CART_ITEMS_PER_PAGE + index + 1,
    }));

    return {
      currentHistoryData: dataWithNumbers,
      realDataCount: dataWithNumbers.length,
    };
  }, [historyData, currentPage]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCartDetail();
  }, [loadCartDetail]);

  // 페이지 변경 시 이력 데이터 로드
  useEffect(() => {
    loadCartHistories();
  }, [loadCartHistories]);

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
