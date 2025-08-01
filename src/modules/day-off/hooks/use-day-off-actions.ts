"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveDayOffRequests,
  rejectDayOffRequests,
} from "../api/day-off-api";
import { CACHE_KEYS } from "@/shared/lib/query-config";
import { useMutationError } from "@/shared/hooks/use-query-error";

interface UseDayOffActionsReturn {
  // 상태
  isApproving: boolean;
  isRejecting: boolean;

  // 액션 함수
  approveRequests: (requestIds: string[]) => Promise<void>;
  rejectRequests: (
    requestIds: string[],
    rejectionReason?: string
  ) => Promise<void>;

  // 유틸리티
  resetLoadingStates: () => void;
}

export const useDayOffActions = (): UseDayOffActionsReturn => {
  const queryClient = useQueryClient();

  // 승인 mutation
  const approveMutation = useMutation({
    mutationFn: async (requestIds: string[]) => {
      return approveDayOffRequests(requestIds);
    },
    onSuccess: () => {
      // day-off 요청 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.DAY_OFF_REQUESTS],
      });
    },
    onError: (error: Error) => {
      console.error("승인 처리 중 오류:", error);
    },
  });

  // 반려 mutation
  const rejectMutation = useMutation({
    mutationFn: async ({
      requestIds,
      rejectionReason,
    }: {
      requestIds: string[];
      rejectionReason?: string;
    }) => {
      return rejectDayOffRequests(requestIds, rejectionReason);
    },
    onSuccess: () => {
      // day-off 요청 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.DAY_OFF_REQUESTS],
      });
    },
    onError: (error: Error) => {
      console.error("반려 처리 중 오류:", error);
    },
  });

  // 승인 처리
  const approveRequests = useCallback(
    async (requestIds: string[]) => {
      if (requestIds.length === 0) return;
      await approveMutation.mutateAsync(requestIds);
    },
    [approveMutation]
  );

  // 반려 처리
  const rejectRequests = useCallback(
    async (requestIds: string[], rejectionReason?: string) => {
      if (requestIds.length === 0) return;
      await rejectMutation.mutateAsync({ requestIds, rejectionReason });
    },
    [rejectMutation]
  );

  // 로딩 상태 초기화 - React Query에서는 자동으로 관리됨
  const resetLoadingStates = useCallback(() => {
    // React Query에서 mutation 상태가 자동 관리되므로 빈 함수
  }, []);

  return {
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    approveRequests,
    rejectRequests,
    resetLoadingStates,
    approveError: useMutationError(approveMutation.error, "update"),
    rejectError: useMutationError(rejectMutation.error, "update"),
  };
};
