import { useQuery } from "@tanstack/react-query";
import { fetchSpecialScheduleDetail } from "../api/work-api";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";

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
  // React Query를 사용한 데이터 페칭
  const {
    data: specialSchedule,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [CACHE_KEYS.SPECIAL_SCHEDULE, scheduleId],
    queryFn: () => fetchSpecialScheduleDetail(scheduleId!),
    enabled: !!scheduleId, // scheduleId가 있을 때만 쿼리 실행
    ...QUERY_CONFIG.REALTIME_OPTIONS,
  });

  // 표준화된 에러 처리
  const error = useQueryError(queryError, "특수 스케줄 조회에 실패했습니다.");

  // 기존 인터페이스 호환성을 위한 fetchSchedule 함수
  const fetchSchedule = async (id: string) => {
    if (id === scheduleId) {
      await refetch();
    } else {
      console.warn(
        "fetchSchedule: scheduleId가 변경되었습니다. useQuery가 자동으로 처리합니다."
      );
    }
  };

  // 빈 데이터 상태 체크 함수들
  const hasNoFields = specialSchedule?.fields.length === 0;
  const hasNoParts = specialSchedule?.parts.length === 0;
  const hasNoTimeSettings =
    specialSchedule?.parts.some((part) => part.start_time === null) || false;
  // 매트릭스 체크를 더 관대하게: parts가 없거나 시간 설정이 없을 때만 true
  const hasNoMatrix = hasNoParts || hasNoTimeSettings;

  return {
    specialSchedule: specialSchedule || null,
    isLoading,
    error,
    fetchSchedule,
    hasNoFields,
    hasNoParts,
    hasNoTimeSettings,
    hasNoMatrix,
    refetch,
  };
};
