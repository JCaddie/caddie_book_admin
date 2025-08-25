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

  // API caddies -> 화면용 CaddieData 매핑
  const convertCaddiesToCaddieData = useCallback(
    (
      apiCaddies: DailyScheduleDetailData["caddies"] | undefined
    ): CaddieData[] => {
      if (!apiCaddies) return [];
      return apiCaddies.map((c, idx) => ({
        id: idx + 1, // 내부 표시용 숫자 ID 생성
        name: c.name,
        group: c.primary_group?.id ?? 0,
        badge: c.special_group?.name || "하우스",
        status: c.today_status || "근무",
        originalId: c.id, // 원본 UUID 유지
        order: c.primary_group_order,
        groupName: c.primary_group?.name,
      }));
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

      // 상세 데이터 설정
      const detailData = {
        fields: data.fields,
        caddies: data.caddies,
        parts: data.parts,
        filter_metadata: data.filter_metadata,
      };

      setState({
        scheduleData,
        detailData,
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
      const sourceCaddies = convertCaddiesToCaddieData(
        state.detailData?.caddies
      );
      return filterCaddies(sourceCaddies, filters);
    },
    [state.detailData?.caddies, convertCaddiesToCaddieData]
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
    sourceCaddies: convertCaddiesToCaddieData(state.detailData?.caddies),

    // 액션
    fetchScheduleData,
    refreshData,
    getFilteredCaddies,

    // 유틸리티
    convertFieldsToFieldType,
    convertCaddiesToCaddieData,
  };
};
