import { apiClient } from "@/shared/lib/api-client";
import { RoundingSettings, Work } from "../types";

// API 응답 타입
interface WorkScheduleApiResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Array<{
    id: string;
    date: string;
    golf_course: {
      id: string;
      name: string;
    };
    total_staff: number;
    available_staff: number;
    status: string;
  }>;
}

// API 엔드포인트 상수
const WORK_API_ENDPOINTS = {
  ROUNDING_SETTINGS: "/api/v1/work/rounding-settings/upsert/",
  SCHEDULES_SIMPLE_LIST: "/api/v1/work/schedules/simple_list/",
} as const;

/**
 * 라운딩 설정 저장/수정 API
 */
export const upsertRoundingSettings = async (
  golfCourseId: string,
  settings: RoundingSettings
): Promise<void> => {
  // 프론트엔드 형식을 백엔드 형식으로 변환
  const requestData = {
    golf_course: golfCourseId,
    part_count: settings.numberOfRounds,
    time_interval: settings.timeUnit,
    is_active: true,
    parts: settings.roundTimes.map((roundTime) => ({
      part_number: roundTime.round,
      start_time: roundTime.startTime,
      end_time: roundTime.endTime,
    })),
  };

  await apiClient.post(WORK_API_ENDPOINTS.ROUNDING_SETTINGS, requestData);
};

/**
 * 라운딩 설정 조회 API
 */
export const fetchRoundingSettings = async (
  golfCourseId: string
): Promise<RoundingSettings> => {
  const response = await apiClient.get<{
    golf_course: string;
    part_count: number;
    time_interval: number;
    is_active: boolean;
    parts: Array<{
      part_number: number;
      start_time: string;
      end_time: string;
    }>;
  }>(`/api/v1/work/rounding-settings/${golfCourseId}/`);

  // 백엔드 형식을 프론트엔드 형식으로 변환
  return {
    numberOfRounds: response.part_count,
    timeUnit: response.time_interval,
    roundTimes: response.parts.map((part) => ({
      round: part.part_number,
      startTime: part.start_time,
      endTime: part.end_time,
    })),
  };
};

/**
 * 근무 스케줄 목록 조회 API
 */
export const fetchWorkSchedules = async (): Promise<Work[]> => {
  const response = await apiClient.get<WorkScheduleApiResponse>(
    WORK_API_ENDPOINTS.SCHEDULES_SIMPLE_LIST
  );

  // 백엔드 형식을 프론트엔드 형식으로 변환
  return response.results.map((schedule, index) => ({
    id: schedule.id,
    no: index + 1,
    date: schedule.date
      ? new Date(schedule.date)
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, ".")
      : "미정",
    golfCourse: schedule.golf_course.name,
    golfCourseId: schedule.golf_course.id,
    totalStaff: schedule.total_staff,
    availableStaff: schedule.available_staff,
    status: schedule.status as
      | "planning"
      | "confirmed"
      | "completed"
      | "cancelled",
    scheduleType: "regular", // API에서 제공되지 않으므로 기본값 사용
    createdAt: new Date().toISOString(), // API에서 제공되지 않으므로 현재 시간 사용
    updatedAt: new Date().toISOString(),
  }));
};
