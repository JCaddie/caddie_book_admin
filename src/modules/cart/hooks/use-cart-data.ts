"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCartList } from "../api/cart-api";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";

export const useCartData = (params?: {
  page?: number;
  search?: string;
  golf_course?: string;
}) => {
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [CACHE_KEYS.CARTS, params],
    queryFn: () =>
      fetchCartList(
        params?.page || 1,
        20,
        params?.search,
        undefined,
        params?.golf_course
      ),
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
  });

  const error = useQueryError(
    queryError,
    "카트 목록 조회 중 오류가 발생했습니다."
  );

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
