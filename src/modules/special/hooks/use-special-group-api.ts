/**
 * Special Group API Hook
 * 새로운 통합 API를 사용하는 hook
 */

import { useCallback, useState } from "react";
import type { CreateGroupRequest, GroupListParams } from "@/shared/types";
import { specialGroupAPI, type SpecialGroupResponse } from "../api";

export interface UseSpecialGroupAPIReturn {
  // 상태
  loading: boolean;
  error: string | null;

  // 액션
  createGroup: (data: CreateGroupRequest) => Promise<SpecialGroupResponse>;
  updateGroup: (
    id: string,
    data: Partial<CreateGroupRequest>
  ) => Promise<SpecialGroupResponse>;
  deleteGroup: (id: string) => Promise<void>;
  getGroups: (params?: GroupListParams) => Promise<SpecialGroupResponse[]>;
  getScheduleDetail: (scheduleId: string) => Promise<unknown>;
  clearError: () => void;
}

export const useSpecialGroupAPI = (): UseSpecialGroupAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createGroup = useCallback(async (data: CreateGroupRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await specialGroupAPI.create(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "특수반 생성 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGroup = useCallback(
    async (id: string, data: Partial<CreateGroupRequest>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await specialGroupAPI.update(id, data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "특수반 수정 실패";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteGroup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await specialGroupAPI.delete(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "특수반 삭제 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroups = useCallback(async (params?: GroupListParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await specialGroupAPI.list(params);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "특수반 목록 조회 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScheduleDetail = useCallback(async (scheduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await specialGroupAPI.getScheduleDetail(scheduleId);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "특수 스케줄 조회 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroups,
    getScheduleDetail,
    clearError,
  };
};
