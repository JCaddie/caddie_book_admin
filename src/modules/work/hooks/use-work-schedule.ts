import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaddieData, WorkSlot } from "../types";
import { CACHE_KEYS, QUERY_CONFIG } from "@/shared/lib/query-config";
import { useQueryError } from "@/shared/hooks/use-query-error";
import {
  assignCaddieToSlot,
  createWorkSchedule,
  fetchWorkSchedule,
  fetchWorkSlots,
  fetchWorkTimeSlots,
  unassignCaddieFromSlot,
} from "../api";

interface UseWorkScheduleProps {
  golfCourseId: string;
  date: string;
}

export const useWorkSchedule = ({
  golfCourseId,
  date,
}: UseWorkScheduleProps) => {
  // React Query를 사용한 스케줄 데이터 페칭
  const {
    data: scheduleData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [CACHE_KEYS.WORK_SCHEDULE, golfCourseId, date],
    queryFn: async () => {
      const data = await fetchWorkSchedule(golfCourseId, date);

      // 시간 슬롯과 근무 슬롯도 함께 조회
      const [timeSlotsData, workSlotsData] = await Promise.all([
        fetchWorkTimeSlots(data.id),
        fetchWorkSlots(data.id),
      ]);

      return {
        schedule: data,
        timeSlots: timeSlotsData.map((slot) => ({
          id: slot.id,
          partId: slot.part, // 실제 partId 필드명에 맞게 수정 필요
          partNumber: slot.part_number,
          scheduleName: slot.schedule_name,
          golfCourseName: slot.golf_course_name,
          startTime: slot.start_time,
          endTime: slot.end_time,
          positionIndex: slot.position_index,
          status: slot.status,
          createdAt: slot.created_at,
          updatedAt: slot.updated_at,
        })),
        workSlots: workSlotsData.map((slot) => ({
          id: slot.id,
          timeSlotId: slot.time_slot,
          timeSlotStartTime: slot.time_slot_start_time,
          timeSlotEndTime: slot.time_slot_end_time,
          partNumber: slot.part_number,
          fieldId: slot.field,
          fieldName: slot.field_name,
          caddieId: slot.caddie,
          caddieName: slot.caddie_name,
          specialGroupId: slot.special_group,
          specialGroupName: slot.special_group_name,
          assignedById: slot.assigned_by,
          assignedByName: slot.assigned_by_name,
          assignedAt: slot.assigned_at,
          notes: slot.notes ?? "",
          createdAt: slot.created_at,
          updatedAt: slot.updated_at,
        })),
      };
    },
    enabled: !!(golfCourseId && date),
    ...QUERY_CONFIG.REALTIME_OPTIONS,
  });

  // 데이터 추출
  const schedule = scheduleData?.schedule || null;
  const timeSlots = useMemo(
    () => scheduleData?.timeSlots || [],
    [scheduleData?.timeSlots]
  );
  const workSlots = useMemo(
    () => scheduleData?.workSlots || [],
    [scheduleData?.workSlots]
  );

  // 표준화된 에러 처리
  const error = useQueryError(
    queryError,
    "스케줄 조회 중 오류가 발생했습니다."
  );

  // 기존 인터페이스 호환성을 위한 fetchSchedule 함수
  const fetchSchedule = useCallback(async () => {
    const result = await refetch();
    return result.data?.schedule;
  }, [refetch]);

  // 근무표 생성
  const createSchedule = useCallback(async () => {
    try {
      const data = await createWorkSchedule(
        golfCourseId,
        date,
        0, // TODO: 실제 timeInterval 값으로 교체
        [] // TODO: 실제 parts 배열로 교체
      );

      // 데이터 다시 로드
      await refetch();

      return data;
    } catch (err) {
      throw err;
    }
  }, [golfCourseId, date, refetch]);

  // 캐디 배정
  const assignCaddie = useCallback(
    async (slotId: string, caddie: CaddieData, assignedBy: string) => {
      try {
        const updatedSlot = await assignCaddieToSlot(
          slotId,
          caddie.id.toString(),
          assignedBy
        );

        // 데이터 다시 로드
        await refetch();

        return updatedSlot;
      } catch (err) {
        throw err;
      }
    },
    [refetch]
  );

  // 캐디 배정 해제
  const unassignCaddie = useCallback(
    async (slotId: string) => {
      try {
        const updatedSlot = await unassignCaddieFromSlot(slotId);

        // 데이터 다시 로드
        await refetch();

        return updatedSlot;
      } catch (err) {
        throw err;
      }
    },
    [refetch]
  );

  // 특정 필드와 시간의 슬롯 찾기
  const getSlotAtPosition = useCallback(
    (fieldId: string, timeSlotId: string): WorkSlot | null => {
      return (
        workSlots.find(
          (slot) => slot.fieldId === fieldId && slot.timeSlotId === timeSlotId
        ) || null
      );
    },
    [workSlots]
  );

  // 특정 필드와 시간에 배정된 캐디 찾기
  const getCaddieAtPosition = useCallback(
    (fieldId: string, timeSlotId: string): CaddieData | null => {
      const slot = getSlotAtPosition(fieldId, timeSlotId);
      if (!slot || !slot.caddieId) return null;

      // 실제 캐디 데이터는 별도로 관리해야 함
      // 여기서는 기본적인 정보만 반환
      return {
        id: parseInt(slot.caddieId),
        name: slot.caddieName || "알 수 없음",
        group: 1, // 기본값
        badge: "하우스", // 기본값
        status: "근무",
      };
    },
    [getSlotAtPosition]
  );

  return {
    schedule,
    timeSlots,
    workSlots,
    isLoading,
    error,
    fetchSchedule,
    createSchedule,
    assignCaddie,
    unassignCaddie,
    getSlotAtPosition,
    getCaddieAtPosition,
  };
};
