import { useQuery } from "@tanstack/react-query";
import { getUserDetail } from "../api/user-api";
import { User } from "../types";

/**
 * 사용자 상세 정보를 가져오는 React Query 훅
 */
export const useUserDetail = (userId: string) => {
  return useQuery<User, Error>({
    queryKey: ["admin-detail", userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * 사용자 상세 쿼리 키 생성 함수
 */
export const getUserDetailQueryKey = (userId: string) =>
  ["admin-detail", userId] as const;
