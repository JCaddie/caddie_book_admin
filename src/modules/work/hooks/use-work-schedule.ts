import { useCallback, useState } from "react";
import { CaddieData, WorkSchedule, WorkSlot, WorkTimeSlot } from "../types";
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
  const [schedule, setSchedule] = useState<WorkSchedule | null>(null);
  const [timeSlots, setTimeSlots] = useState<WorkTimeSlot[]>([]);
  const [workSlots, setWorkSlots] = useState<WorkSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 근무표 조회
  const fetchSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchWorkSchedule(golfCourseId, date);
      setSchedule(data);

      // 시간 슬롯과 근무 슬롯도 함께 조회
      const timeSlotsData = await fetchWorkTimeSlots(data.id);
      const workSlotsData = await fetchWorkSlots(data.id);

      setTimeSlots(
        timeSlotsData.map((slot) => ({
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
        }))
      );
      setWorkSlots(
        workSlotsData.map((slot) => ({
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
        }))
      );

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "근무표 조회에 실패했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [golfCourseId, date]);

  // 근무표 생성
  const createSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await createWorkSchedule(
        golfCourseId,
        date,
        0, // TODO: 실제 timeInterval 값으로 교체
        [] // TODO: 실제 parts 배열로 교체
      );
      setSchedule(null);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "근무표 생성에 실패했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [golfCourseId, date]);

  // 캐디 배정
  const assignCaddie = useCallback(
    async (slotId: string, caddie: CaddieData, assignedBy: string) => {
      try {
        const updatedSlot = await assignCaddieToSlot(
          slotId,
          caddie.id.toString(),
          assignedBy
        );

        // 로컬 상태 업데이트
        setWorkSlots((prev) =>
          prev.map((slot) => {
            if (slot.id === slotId) {
              const slotData =
                updatedSlot as import("../api/work-api").WorkSlotResponse;
              return {
                id: slotData.id,
                timeSlotId: slotData.time_slot,
                timeSlotStartTime: slotData.time_slot_start_time,
                timeSlotEndTime: slotData.time_slot_end_time,
                partNumber: slotData.part_number,
                fieldId: slotData.field,
                fieldName: slotData.field_name,
                caddieId: slotData.caddie,
                caddieName: slotData.caddie_name,
                specialGroupId: slotData.special_group,
                specialGroupName: slotData.special_group_name,
                assignedById: slotData.assigned_by,
                assignedByName: slotData.assigned_by_name,
                assignedAt: slotData.assigned_at,
                notes: slotData.notes ?? "",
                createdAt: slotData.created_at,
                updatedAt: slotData.updated_at,
              };
            }
            return slot;
          })
        );

        return updatedSlot;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "캐디 배정에 실패했습니다.";
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  // 캐디 배정 해제
  const unassignCaddie = useCallback(async (slotId: string) => {
    try {
      const updatedSlot = await unassignCaddieFromSlot(slotId);

      // 로컬 상태 업데이트
      setWorkSlots((prev) =>
        prev.map((slot) => {
          if (slot.id === slotId) {
            const slotData =
              updatedSlot as import("../api/work-api").WorkSlotResponse;
            return {
              id: slotData.id,
              timeSlotId: slotData.time_slot,
              timeSlotStartTime: slotData.time_slot_start_time,
              timeSlotEndTime: slotData.time_slot_end_time,
              partNumber: slotData.part_number,
              fieldId: slotData.field,
              fieldName: slotData.field_name,
              caddieId: slotData.caddie,
              caddieName: slotData.caddie_name,
              specialGroupId: slotData.special_group,
              specialGroupName: slotData.special_group_name,
              assignedById: slotData.assigned_by,
              assignedByName: slotData.assigned_by_name,
              assignedAt: slotData.assigned_at,
              notes: slotData.notes ?? "",
              createdAt: slotData.created_at,
              updatedAt: slotData.updated_at,
            };
          }
          return slot;
        })
      );

      return updatedSlot;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "캐디 배정 해제에 실패했습니다.";
      setError(errorMessage);
      throw err;
    }
  }, []);

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
