"use client";

import { useMemo } from "react";
import { usePagination, useTableData } from "@/shared/hooks";
import { CartDetail, CartHistoryItem } from "../types";
import {
  generateCartDetail,
  generateCartHistory,
  createEmptyCartHistoryTemplate,
} from "../utils";

// 페이지당 아이템 수
const ITEMS_PER_PAGE = 20;

interface UseCartDetailProps {
  cartId: string;
}

interface UseCartDetailReturn {
  // 카트 상세 정보
  cartDetail: CartDetail;

  // 이력 데이터
  historyData: CartHistoryItem[];
  paddedHistoryData: CartHistoryItem[];
  realDataCount: number;

  // 페이지네이션
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
      itemsPerPage: ITEMS_PER_PAGE,
    });

  // 빈 행 템플릿
  const emptyRowTemplate = useMemo(() => createEmptyCartHistoryTemplate(), []);

  // 테이블 데이터 패딩 (20개 행으로 고정)
  const { paddedData } = useTableData({
    data: currentData,
    itemsPerPage: ITEMS_PER_PAGE,
    emptyRowTemplate,
  });

  return {
    cartDetail,
    historyData,
    paddedHistoryData: paddedData,
    realDataCount: currentData.length,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
