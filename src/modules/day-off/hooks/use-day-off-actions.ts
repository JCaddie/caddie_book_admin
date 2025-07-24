"use client";

import { useCallback, useState } from "react";
import {
  approveDayOffRequests,
  rejectDayOffRequests,
} from "../api/day-off-api";

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
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // 승인 처리
  const approveRequests = useCallback(async (requestIds: string[]) => {
    if (requestIds.length === 0) return;

    setIsApproving(true);
    try {
      await approveDayOffRequests(requestIds);
    } catch (error) {
      console.error("승인 처리 중 오류:", error);
      throw error; // 상위 컴포넌트에서 처리하도록 에러를 다시 던짐
    } finally {
      setIsApproving(false);
    }
  }, []);

  // 반려 처리
  const rejectRequests = useCallback(
    async (requestIds: string[], rejectionReason?: string) => {
      if (requestIds.length === 0) return;

      setIsRejecting(true);
      try {
        await rejectDayOffRequests(requestIds, rejectionReason);
      } catch (error) {
        console.error("반려 처리 중 오류:", error);
        throw error; // 상위 컴포넌트에서 처리하도록 에러를 다시 던짐
      } finally {
        setIsRejecting(false);
      }
    },
    []
  );

  // 로딩 상태 초기화
  const resetLoadingStates = useCallback(() => {
    setIsApproving(false);
    setIsRejecting(false);
  }, []);

  return {
    isApproving,
    isRejecting,
    approveRequests,
    rejectRequests,
    resetLoadingStates,
  };
};
