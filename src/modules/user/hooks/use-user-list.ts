import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/user-api";
import { UserListApiResponse } from "../types";

/**
 * 사용자 목록 조회 훅
 */
export const useUserList = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery<UserListApiResponse>({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
