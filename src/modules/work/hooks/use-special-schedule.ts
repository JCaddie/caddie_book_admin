import { useEffect, useState } from "react";
import { fetchSpecialScheduleDetail } from "../api/work-api";

// 특수 스케줄 데이터 타입
export interface SpecialScheduleData {
  id: string;
  golf_course: {
    id: string;
    name: string;
  };
  schedule_type: string;
  status: string;
  time_interval: number;
  fields: Array<{
    id: string;
    name: string;
    number: number;
  }>;
  parts: Array<{
    id: string;
    part_number: number;
    name: string;
    start_time: string | null;
    end_time: string | null;
    schedule_matrix: Array<{
      time: string;
      slots: Array<{
        field_number: number;
        work_slot_id: string;
        special_group: {
          id: string;
          name: string;
          member_count: number;
        } | null;
      }>;
    }>;
  }>;
  available_special_groups: Array<{
    id: string;
    name: string;
    group_type: string;
    member_count: number;
  }>;
}

export const useSpecialSchedule = (scheduleId?: string) => {
  const [specialSchedule, setSpecialSchedule] =
    useState<SpecialScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchSpecialScheduleDetail(id);
      setSpecialSchedule(data);
    } catch (err) {
      console.error("특수 스케줄 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "특수 스케줄 조회에 실패했습니다."
      );
      setSpecialSchedule(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule(scheduleId);
    }
  }, [scheduleId]);

  // 빈 데이터 상태 체크 함수들
  const hasNoParts = specialSchedule?.parts.length === 0;
  const hasNoTimeSettings =
    specialSchedule?.parts.some((part) => part.start_time === null) || false;
  const hasNoMatrix =
    specialSchedule?.parts.every((part) => part.schedule_matrix.length === 0) ||
    false;

  return {
    specialSchedule,
    isLoading,
    error,
    fetchSchedule,
    hasNoParts,
    hasNoTimeSettings,
    hasNoMatrix,
    refetch: () => scheduleId && fetchSchedule(scheduleId),
  };
};
