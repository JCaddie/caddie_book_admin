import { useQuery } from "@tanstack/react-query";
import { AdminsApiResponse, getAdmins } from "../api/user-api";

/**
 * 관리자 사용자 목록을 가져오는 React Query 훅
 */
export const useAdminList = () => {
  return useQuery<AdminsApiResponse, Error>({
    queryKey: ["admin-list"],
    queryFn: getAdmins,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * 관리자 목록 쿼리 키 상수
 */
export const ADMIN_LIST_QUERY_KEY = ["admin-list"] as const;
