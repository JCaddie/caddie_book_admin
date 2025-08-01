import { useQuery } from "@tanstack/react-query";
import { getAdmins } from "../api/user-api";
import { AdminsApiResponse } from "../types";

interface UseAdminListParams {
  search?: string;
  role?: string;
  page?: number;
  page_size?: number;
}

export const useAdminList = (params?: UseAdminListParams) => {
  return useQuery<AdminsApiResponse>({
    queryKey: ["admins", params],
    queryFn: () => getAdmins(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 관리자 목록 쿼리 키 상수
 */
export const ADMIN_LIST_QUERY_KEY = ["admin-list"] as const;
