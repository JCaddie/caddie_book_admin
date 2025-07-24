import { apiClient } from "@/shared/lib/api-client";
import { RoundingSettings, Work, WorkSchedule } from "../types";

// API 응답 타입들
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

interface RoundingSettingsResponse {
  id: string;
  golf_course: string;
  golf_course_name: string;
  part_count: number;
  time_interval: number;
  is_active: boolean;
  notes: string;
  parts: Array<{
    id: string;
    part_number: number;
    start_time: string;
    end_time: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface WorkScheduleResponse {
  id: string;
  golf_course: string;
  golf_course_name: string;
  schedule_type: string;
  date: string;
  name: string;
  total_staff: number;
  available_staff: number;
  status: string;
  notes: string;
  created_by: string;
  created_by_name: string;
  parts_count: number;
  parts: Array<{
    id: string;
    part_number: number;
    start_time: string;
    end_time: string;
    time_interval: number;
    is_active: boolean;
    time_slots_count: number;
    created_at?: string;
    updated_at?: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface WorkTimeSlotResponse {
  id: string;
  part: string;
  part_number: number;
  schedule_name: string;
  golf_course_name: string;
  start_time: string;
  end_time: string;
  position_index: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface WorkSlotResponse {
  id: string;
  time_slot: string;
  time_slot_start_time: string;
  time_slot_end_time: string;
  part_number: number;
  field: string;
  field_name: string;
  caddie: string | null;
  caddie_name: string | null;
  special_group: string | null;
  special_group_name: string | null;
  assigned_by: string | null;
  assigned_by_name: string | null;
  assigned_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

// API 엔드포인트 상수
const WORK_API_ENDPOINTS = {
  ROUNDING_SETTINGS: "/api/v1/work/rounding-settings/",
  SCHEDULES: "/api/v1/work/schedules/",
  TIME_SLOTS: "/api/v1/work/time-slots/",
  SLOTS: "/api/v1/work/slots/",
  SCHEDULES_SIMPLE_LIST: "/api/v1/work/schedules/simple_list/",
} as const;

/**
 * 라운딩 설정 조회 API
 */
export const fetchRoundingSettings = async (
  golfCourseId: string
): Promise<RoundingSettings> => {
  const response = await apiClient.get<RoundingSettingsResponse>(
    `${WORK_API_ENDPOINTS.ROUNDING_SETTINGS}${golfCourseId}/`
  );

  // 백엔드 형식을 프론트엔드 형식으로 변환
  return {
    numberOfRounds: response.part_count,
    timeUnit: response.time_interval,
    roundTimes: response.parts.map((part) => ({
      round: part.part_number,
      startTime: part.start_time.slice(0, 5), // HH:MM 형식으로 변환
      endTime: part.end_time.slice(0, 5),
    })),
  };
};

/**
 * 라운딩 설정 저장/수정 API (POST)
 */
export const upsertRoundingSettings = async (
  golfCourseId: string,
  settings: RoundingSettings,
  golfCourseName?: string
): Promise<void> => {
  // 프론트엔드 형식을 백엔드 형식으로 변환
  const requestData = {
    golf_course: golfCourseId,
    part_count: settings.numberOfRounds,
    time_interval: settings.timeUnit,
    is_active: true,
    notes: golfCourseName
      ? `${golfCourseName} ${settings.numberOfRounds}부제 라운딩 설정`
      : `${settings.numberOfRounds}부제 라운딩 설정`,
    parts: settings.roundTimes.map((roundTime) => ({
      part_number: roundTime.round,
      start_time: roundTime.startTime,
      end_time: roundTime.endTime,
    })),
  };

  await apiClient.post(WORK_API_ENDPOINTS.ROUNDING_SETTINGS, requestData);
};

/**
 * 라운딩 설정 전체 수정 API (PUT)
 */
export const updateRoundingSettings = async (
  golfCourseId: string,
  settings: RoundingSettings,
  golfCourseName?: string
): Promise<void> => {
  // 프론트엔드 형식을 백엔드 형식으로 변환
  const requestData = {
    golf_course: golfCourseId,
    part_count: settings.numberOfRounds,
    time_interval: settings.timeUnit,
    is_active: true,
    notes: golfCourseName
      ? `${golfCourseName} ${settings.numberOfRounds}부제 라운딩 설정`
      : `${settings.numberOfRounds}부제 라운딩 설정`,
    parts: settings.roundTimes.map((roundTime) => ({
      part_number: roundTime.round,
      start_time: roundTime.startTime,
      end_time: roundTime.endTime,
    })),
  };

  await apiClient.put(
    `${WORK_API_ENDPOINTS.ROUNDING_SETTINGS}${golfCourseId}/`,
    requestData
  );
};

/**
 * 라운딩 설정 부분 수정 API (PATCH)
 */
export const patchRoundingSettings = async (
  golfCourseId: string,
  settings: Partial<RoundingSettings>
): Promise<void> => {
  // 프론트엔드 형식을 백엔드 형식으로 변환
  const requestData: Record<string, unknown> = {};

  if (settings.numberOfRounds !== undefined) {
    requestData.part_count = settings.numberOfRounds;
  }
  if (settings.timeUnit !== undefined) {
    requestData.time_interval = settings.timeUnit;
  }

  await apiClient.patch(
    `${WORK_API_ENDPOINTS.ROUNDING_SETTINGS}${golfCourseId}/`,
    requestData
  );
};

/**
 * 근무표 조회 API
 */
export const fetchWorkSchedule = async (
  golfCourseId: string,
  date: string
): Promise<WorkSchedule> => {
  const response = await apiClient.get<WorkScheduleResponse>(
    `${WORK_API_ENDPOINTS.SCHEDULES}?golf_course=${golfCourseId}&date=${date}`
  );

  // 백엔드 응답을 프론트엔드 형식으로 변환
  return {
    id: response.id,
    golfCourse: response.golf_course_name,
    golfCourseId: response.golf_course,
    scheduleType: response.schedule_type,
    date: response.date,
    name: response.name,
    totalStaff: response.total_staff,
    availableStaff: response.available_staff,
    status: response.status,
    notes: response.notes,
    createdBy: response.created_by,
    createdByName: response.created_by_name,
    partsCount: response.parts_count,
    parts: response.parts.map((part) => ({
      id: part.id,
      scheduleId: response.id,
      partNumber: part.part_number,
      startTime: part.start_time.slice(0, 5),
      endTime: part.end_time.slice(0, 5),
      timeInterval: part.time_interval,
      isActive: part.is_active,
      timeSlotsCount: part.time_slots_count,
      createdAt: part.created_at || "",
      updatedAt: part.updated_at || "",
    })),
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
};

/**
 * 근무표 생성 API 응답 타입
 */
interface CreateWorkScheduleResponse {
  success: boolean;
  message: string;
  data: {
    golf_course_id: string;
    date: string;
  };
}

/**
 * 근무표 생성 API
 */
export const createWorkSchedule = async (
  golfCourseId: string,
  date: string,
  timeInterval: number,
  parts: Array<{
    part_number: number;
    start_time: string;
    end_time: string;
  }>
): Promise<{ golfCourseId: string; date: string }> => {
  const requestData = {
    golf_course: golfCourseId,
    schedule_type: "daily",
    date: date,
    time_interval: timeInterval,
    parts: parts,
  };

  const response = await apiClient.post<CreateWorkScheduleResponse>(
    WORK_API_ENDPOINTS.SCHEDULES,
    requestData
  );

  // 새로운 응답 구조에 맞게 반환
  return {
    golfCourseId: response.data.golf_course_id,
    date: response.data.date,
  };
};

/**
 * 시간 슬롯 조회 API
 */
export const fetchWorkTimeSlots = async (
  scheduleId: string
): Promise<WorkTimeSlotResponse[]> => {
  const response = await apiClient.get<{
    count: number;
    results: WorkTimeSlotResponse[];
  }>(`${WORK_API_ENDPOINTS.TIME_SLOTS}?schedule=${scheduleId}`);

  return response.results;
};

/**
 * 근무 슬롯 조회 API
 */
export const fetchWorkSlots = async (
  scheduleId: string
): Promise<WorkSlotResponse[]> => {
  const response = await apiClient.get<{
    count: number;
    results: WorkSlotResponse[];
  }>(`${WORK_API_ENDPOINTS.SLOTS}?schedule=${scheduleId}`);

  return response.results;
};

/**
 * 캐디 배정 API
 */
export const assignCaddieToSlot = async (
  slotId: string,
  caddieId: string,
  assignedBy: string
): Promise<WorkSlotResponse> => {
  const requestData = {
    caddie: caddieId,
    assigned_by: assignedBy,
    assigned_at: new Date().toISOString(),
  };

  return apiClient.patch<WorkSlotResponse>(
    `${WORK_API_ENDPOINTS.SLOTS}${slotId}/`,
    requestData
  );
};

/**
 * 캐디 배정 해제 API
 */
export const unassignCaddieFromSlot = async (
  slotId: string
): Promise<WorkSlotResponse> => {
  const requestData = {
    caddie: null,
    assigned_by: null,
    assigned_at: null,
  };

  return apiClient.patch<WorkSlotResponse>(
    `${WORK_API_ENDPOINTS.SLOTS}${slotId}/`,
    requestData
  );
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
