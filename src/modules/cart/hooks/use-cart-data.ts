"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCartList } from "../api/cart-api";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";
import { ApiCartData, ApiCartListResponse } from "../types/api";
import { Cart } from "../types/domain";

// API 응답을 도메인 타입으로 변환하는 함수
const transformApiCartToDomain = (
  apiCart: ApiCartData,
  index: number
): Cart => {
  return {
    id: apiCart.id,
    no: index + 1,
    name: apiCart.name,
    status: apiCart.status_display,
    location: "", // API에서 location 정보가 없으므로 빈 문자열
    golfCourseName: apiCart.golf_course.name,
    managerName: apiCart.current_caddie?.name || "미배정",
    batteryLevel: apiCart.battery_level,
    batteryStatus: apiCart.battery_status,
    isAvailable: apiCart.is_available,
    createdAt: apiCart.created_at || new Date().toISOString(),
    updatedAt: apiCart.updated_at || new Date().toISOString(),
    isEmpty: false,
  };
};

export const useCartData = (params?: {
  selectedGolfCourseId?: string;
  isMaster?: boolean;
  page?: number;
  search?: string;
  golf_course?: string;
}) => {
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<ApiCartListResponse>({
    queryKey: [CACHE_KEYS.CARTS, params],
    queryFn: () =>
      fetchCartList(
        params?.page || 1,
        20,
        params?.search,
        undefined,
        params?.selectedGolfCourseId || params?.golf_course
      ),
    ...QUERY_CONFIG.DEFAULT_OPTIONS,
  });

  const error = useQueryError(
    queryError,
    "카트 목록 조회 중 오류가 발생했습니다."
  );

  // API 응답을 도메인 타입으로 변환
  const transformedData: Cart[] =
    data?.data?.results?.map((apiCart, index) =>
      transformApiCartToDomain(apiCart, index)
    ) || [];

  return {
    data: transformedData,
    totalCount: data?.data?.count || 0,
    totalPages: data?.data?.total_pages || 0,
    currentPage: data?.data?.page || 1,
    isLoading,
    error,
    refetch,
  };
};
