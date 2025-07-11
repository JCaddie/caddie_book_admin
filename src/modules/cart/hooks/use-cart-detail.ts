"use client";

import { useMemo } from "react";
import { usePagination } from "@/shared/hooks";
import { CartDetail, CartHistoryItem } from "../types";
import { generateCartDetail, generateCartHistory } from "../utils";
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
  handlePageChange: (page: number) => void;
}

/**
 * 카트 상세 화면 커스텀 훅
 * 카트 상세 정보와 이력 데이터를 관리합니다.
 */
export const useCartDetail = ({
  cartId,
}: UseCartDetailProps): UseCartDetailReturn => {
  // 카트 상세 정보 생성
  const cartDetail = useMemo(() => generateCartDetail(cartId), [cartId]);

  // 카트 이력 데이터 생성
  const historyData = useMemo(() => generateCartHistory(50), []);

  // 페이지네이션 훅
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination<CartHistoryItem>({
      data: historyData,
      itemsPerPage: CART_ITEMS_PER_PAGE,
    });

  return {
    cartDetail,
    historyData,
    currentHistoryData: currentData,
    realDataCount: currentData.length,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
