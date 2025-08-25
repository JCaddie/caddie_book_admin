"use client";

import { useCallback, useState } from "react";
import { fetchDailyScheduleDetail } from "@/modules/work/api";
import {
  CaddieData,
  DailyScheduleDetailData,
  Field,
  WorkDetailState,
} from "@/modules/work/types";
import { FIELDS, PERSONNEL_STATS } from "@/modules/work/constants/work-detail";
import { filterCaddies } from "@/modules/work/utils/work-detail-utils";

export const useWorkDetail = (golfCourseId: string, currentDate: Date) => {
  const [state, setState] = useState<WorkDetailState>({
    scheduleData: null,
    detailData: null,
    isLoading: false,
    error: null,
  });

  // API 응답의 fields를 Field 타입으로 변환하는 함수
  const convertFieldsToFieldType = useCallback(
    (
      apiFields:
        | Array<{
            id: string;
            name: string;
            order: number;
            is_active: boolean;
          }>
        | undefined
    ): Field[] => {
      if (!apiFields) return FIELDS;
      return apiFields
        .filter((field) => field.is_active)
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
          id: parseInt(field.id) || 0,
          name: field.name,
        }));
    },
    []
  );

  // API slots에서 캐디 정보 추출하여 CaddieData로 매핑
  const convertSlotsToCaddieData = useCallback(
    (parts: DailyScheduleDetailData["parts"] | undefined): CaddieData[] => {
      if (!parts) return [];

      const caddieMap = new Map<string, CaddieData>();

      parts.forEach((part) => {
        part.slots.forEach((slot) => {
          if (slot.caddie && !caddieMap.has(slot.caddie.id)) {
            caddieMap.set(slot.caddie.id, {
              id: caddieMap.size + 1, // 내부 표시용 숫자 ID 생성
              name: slot.caddie.name,
              group: slot.caddie.primary_group?.id ?? 0,
              badge: slot.caddie.special_group?.name || "",
              status: slot.status || "근무", // slot.status를 사용하거나 기본값
              originalId: slot.caddie.id, // 원본 UUID 유지
              order: slot.caddie.primary_group?.order ?? 0,
              groupName: slot.caddie.primary_group?.name,
            });
          }
        });
      });

      return Array.from(caddieMap.values());
    },
    []
  );

  // 근무표 데이터 조회
  const fetchScheduleData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const formattedDate = currentDate.toISOString().split("T")[0];
      const response = await fetchDailyScheduleDetail(
        golfCourseId,
        formattedDate
      );
      const data = response.data;

      // 스케줄 데이터 변환
      const scheduleData = {
        date: data.date,
        golfCourseId: data.golf_course.id,
        schedules: [
          {
            id: data.id,
            golfCourse: data.golf_course.id,
            golfCourseName: data.golf_course.name,
            scheduleType: data.schedule_type,
            date: data.date,
            totalStaff: data.total_staff,
            availableStaff: data.available_staff,
            status: data.status,
            createdBy: data.created_by,
            createdByName: data.created_by,
            partsCount: data.parts.length,
            timeInterval: data.time_interval,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          },
        ],
        scheduleParts: data.parts.map((part) => ({
          scheduleId: data.id,
          partNumber: part.part_number,
          startTime: part.start_time,
          endTime: part.end_time,
        })),
      };

      // 상세 데이터 설정 - 새로운 API 구조에 맞게 수정
      const detailData = {
        fields: data.fields,
        parts: data.parts.map((part) => ({
          ...part,
          // 각 part의 slots에 변환된 캐디 데이터 추가
          slots: part.slots.map((slot) => ({
            ...slot,
            // slot.caddie가 있으면 변환된 CaddieData로 매핑
            convertedCaddie: slot.caddie
              ? {
                  id: parseInt(slot.caddie.id.slice(-6), 16) || 0,
                  name: slot.caddie.name,
                  group: slot.caddie.primary_group?.id ?? 0,
                  badge: slot.caddie.special_group?.name || "",
                  status: slot.status || "근무",
                  originalId: slot.caddie.id,
                  order: slot.caddie.primary_group?.order ?? 0,
                  groupName: slot.caddie.primary_group?.name,
                }
              : null,
          })),
        })),
        filter_metadata: data.filter_metadata,
      };

      // caddies를 별도로 설정
      const caddies = convertSlotsToCaddieData(data.parts);

      setState({
        scheduleData,
        detailData: {
          ...detailData,
          caddies,
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("근무표 조회 실패:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "근무표 조회에 실패했습니다.",
      }));
    }
  }, [currentDate, golfCourseId]);

  // 시간 슬롯 생성 (API 데이터 기반 또는 기본값)
  const generateTimeSlots = useCallback(() => {
    if (!state.scheduleData?.scheduleParts.length) {
      return null;
    }

    const result: { part1: string[]; part2: string[]; part3: string[] } = {
      part1: [],
      part2: [],
      part3: [],
    };

    state.scheduleData.scheduleParts.forEach((part) => {
      const partKey = `part${part.partNumber}` as keyof typeof result;
      const slots: string[] = [];
      const currentTime = new Date(`2000-01-01T${part.startTime}`);
      const endTime = new Date(`2000-01-01T${part.endTime}`);
      const tempTime = new Date(currentTime);

      while (tempTime < endTime) {
        slots.push(tempTime.toTimeString().slice(0, 5));
        tempTime.setMinutes(
          tempTime.getMinutes() +
            (state.scheduleData?.schedules[0]?.timeInterval || 10)
        );
      }
      result[partKey] = slots;
    });

    return result;
  }, [state.scheduleData]);

  // 인원 통계 계산
  const getPersonnelStats = useCallback(() => {
    if (!state.scheduleData?.schedules[0]) {
      return PERSONNEL_STATS;
    }

    return {
      total: state.scheduleData.schedules[0].totalStaff,
      available: state.scheduleData.schedules[0].availableStaff,
    };
  }, [state.scheduleData]);

  // 필터링된 캐디 리스트
  const getFilteredCaddies = useCallback(
    (filters: { status: string; group: string; badge: string }) => {
      const sourceCaddies = convertSlotsToCaddieData(state.detailData?.parts);
      return filterCaddies(sourceCaddies, filters);
    },
    [state.detailData?.parts, convertSlotsToCaddieData]
  );

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  return {
    // 상태
    ...state,

    // 변환된 데이터
    fields: convertFieldsToFieldType(state.detailData?.fields),
    timeSlots: generateTimeSlots(),
    personnelStats: getPersonnelStats(),
    sourceCaddies: convertSlotsToCaddieData(state.detailData?.parts),

    // 액션
    fetchScheduleData,
    refreshData,
    getFilteredCaddies,

    // 유틸리티
    convertFieldsToFieldType,
    convertSlotsToCaddieData,
  };
};
