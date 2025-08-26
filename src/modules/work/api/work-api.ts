import { apiClient } from "@/shared/lib/api-client";
import {
  DailyScheduleDetailResponse,
  RoundingSettings,
  Work,
  WorkSchedule,
} from "../types";

// ================================
// API 응답 타입들
// ================================

interface DailyScheduleListResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    golf_course: {
      id: string;
      name: string;
    };
    date: string;
    status: string;
    time_interval: number;
    parts_count: number;
    total_staff: number;
    available_staff: number;
    created_by: string;
    created_at: string;
  }>;
}

interface AutoAssignRequest {
  max_assignments?: number;
  min_rest_minutes?: number;
}

interface AutoAssignResponse {
  success: boolean;
  message: string;
  data?: {
    assigned_count: number;
    message: string;
  };
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

export interface WorkScheduleResponse {
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

export interface WorkSlotResponse {
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
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 라운딩 설정 일괄 업데이트 API 타입
interface BulkUpdateRoundingSettingsResponse {
  success: boolean;
  message: string;
  data?: {
    golf_course_id: string;
    updated_parts_count: number;
  };
}

// 골프장별 특수반 현황 API 타입
interface SpecialGroupsStatusResponse {
  success: boolean;
  message: string;
  data: Array<{
    golf_course_id: string;
    golf_course_name: string;
    location: string;
    status: string;
    special_group_count: number;
    total_caddie_count: number;
    special_schedule_id: string;
  }>;
}

// 특수 스케줄 상세 조회 API 타입
interface SpecialScheduleDetailResponse {
  success: boolean;
  message: string;
  data: {
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
  };
}

// 근무표 생성 API 응답 타입
interface CreateWorkScheduleResponse {
  success: boolean;
  message: string;
  data: {
    golf_course_id: string;
    date: string;
  };
}

// 특정 날짜 근무표 조회 API 응답 타입
interface WorkScheduleByDateResponse {
  success: boolean;
  message: string;
  data: {
    date: string;
    golf_course_id: string;
    schedules: Array<{
      id: string;
      golf_course: string;
      golf_course_name: string;
      schedule_type: string;
      date: string;
      total_staff: number;
      available_staff: number;
      status: string;
      created_by: string;
      created_by_name: string;
      parts_count: number;
      time_interval: number;
      created_at: string;
      updated_at: string;
    }>;
    schedule_parts: Array<{
      schedule_id: string;
      part_number: number;
      start_time: string;
      end_time: string;
    }>;
  };
}

// ================================
// API 엔드포인트 상수
// ================================

export const WORK_API_ENDPOINTS = {
  ROUNDING_SETTINGS: "/api/v1/work/rounding-settings/",
  SCHEDULES: "/api/v1/work/schedules/",
  DAILY_SCHEDULES: "/api/v1/work/daily-schedules/",
  TIME_SLOTS: "/api/v1/work/time-slots/",
  SLOTS: "/api/v1/work/slots/",
  SLOT_BULK_UPDATE: "/api/v1/work/slots/bulk_update_status/",
} as const;

// ================================
// 라운딩 설정 관련 API
// ================================

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

// ================================
// 근무표 관련 API
// ================================

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
    WORK_API_ENDPOINTS.DAILY_SCHEDULES,
    requestData
  );

  return {
    golfCourseId: response.data.golf_course_id,
    date: response.data.date,
  };
};

/**
 * 특정 날짜 근무표 조회 API
 */
export const fetchWorkScheduleByDate = async (
  date: string,
  golfCourseId: string
): Promise<{
  date: string;
  golfCourseId: string;
  schedules: Array<{
    id: string;
    golfCourse: string;
    golfCourseName: string;
    scheduleType: string;
    date: string;
    totalStaff: number;
    availableStaff: number;
    status: string;
    createdBy: string;
    createdByName: string;
    partsCount: number;
    timeInterval: number;
    createdAt: string;
    updatedAt: string;
  }>;
  scheduleParts: Array<{
    scheduleId: string;
    partNumber: number;
    startTime: string;
    endTime: string;
  }>;
}> => {
  const response = await apiClient.get<WorkScheduleByDateResponse>(
    `${WORK_API_ENDPOINTS.SCHEDULES}?date=${date}&golf_course=${golfCourseId}`
  );

  return {
    date: response.data.date,
    golfCourseId: response.data.golf_course_id,
    schedules: response.data.schedules.map((schedule) => ({
      id: schedule.id,
      golfCourse: schedule.golf_course,
      golfCourseName: schedule.golf_course_name,
      scheduleType: schedule.schedule_type,
      date: schedule.date,
      totalStaff: schedule.total_staff,
      availableStaff: schedule.available_staff,
      status: schedule.status,
      createdBy: schedule.created_by,
      createdByName: schedule.created_by_name,
      partsCount: schedule.parts_count,
      timeInterval: schedule.time_interval,
      createdAt: schedule.created_at,
      updatedAt: schedule.updated_at,
    })),
    scheduleParts: response.data.schedule_parts.map((part) => ({
      scheduleId: part.schedule_id,
      partNumber: part.part_number,
      startTime: part.start_time.slice(0, 5), // HH:MM 형식으로 변환
      endTime: part.end_time.slice(0, 5), // HH:MM 형식으로 변환
    })),
  };
};

// ================================
// 시간 슬롯 및 근무 슬롯 관련 API
// ================================

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

// ================================
// 캐디 배정 관련 API
// ================================

/**
 * 캐디 배정 API (POST 방식)
 */
export const assignCaddieToSlotPost = async (
  slotId: string,
  caddieId: string
): Promise<void> => {
  try {
    await apiClient.post(
      `${WORK_API_ENDPOINTS.SLOTS}${slotId}/assign_caddie/`,
      {
        caddie_id: caddieId,
      }
    );

    console.log("캐디 배정 API 호출 완료");
  } catch (error: unknown) {
    console.error("캐디 배정 실패:", error);

    let errorMessage = "캐디 배정에 실패했습니다. 다시 시도해주세요.";

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response?: { data?: { message?: string } } };

      if (apiError.response?.data) {
        const errorData = apiError.response.data;

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
    } else if (error && typeof error === "object" && "message" in error) {
      const messageError = error as { message: string };
      errorMessage = messageError.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    throw new Error(errorMessage);
  }
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

// ================================
// 특수 스케줄 관련 API
// ================================

/**
 * 라운딩 설정 일괄 업데이트 API
 */
export const bulkUpdateRoundingSettings = async (
  scheduleId: string,
  timeInterval: number,
  partsConfig: Array<{
    partNumber: number;
    name: string;
    startTime: string;
    endTime: string;
  }>
): Promise<{ scheduleId: string; updatedPartsCount: number }> => {
  try {
    const requestData = {
      schedule_type: "special",
      time_interval: timeInterval,
      parts_config: partsConfig.map((part) => ({
        part_number: part.partNumber,
        name: part.name,
        start_time: part.startTime,
        end_time: part.endTime,
        is_active: true,
      })),
    };

    const response = await apiClient.put<BulkUpdateRoundingSettingsResponse>(
      `${WORK_API_ENDPOINTS.SCHEDULES}${scheduleId}/bulk-update/`,
      requestData
    );

    if (response.success) {
      return {
        scheduleId: scheduleId,
        updatedPartsCount: response.data?.updated_parts_count || 0,
      };
    } else {
      throw new Error(response.message || "라운딩 설정 업데이트 실패");
    }
  } catch (error) {
    console.error("라운딩 설정 일괄 업데이트 실패:", error);
    throw error;
  }
};

/**
 * 특수 스케줄 상세 조회 API
 */
export const fetchSpecialScheduleDetail = async (
  scheduleId: string
): Promise<SpecialScheduleDetailResponse["data"]> => {
  try {
    const response = await apiClient.get<SpecialScheduleDetailResponse>(
      `${WORK_API_ENDPOINTS.SCHEDULES}${scheduleId}/special-groups-status/`
    );

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "특수 스케줄 조회 실패");
    }
  } catch (error) {
    console.error("특수 스케줄 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 골프장별 특수반 현황 조회 API
 */
export const fetchSpecialGroupsStatus = async (): Promise<
  SpecialGroupsStatusResponse["data"]
> => {
  try {
    const response = await apiClient.get<SpecialGroupsStatusResponse>(
      "/api/v1/golf-courses/special-groups-status/"
    );

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "특수반 현황 조회 실패");
    }
  } catch (error) {
    console.error("골프장별 특수반 현황 조회 실패:", error);
    throw error;
  }
};

/**
 * 특수반 생성 API
 */
export const createSpecialGroup = async (
  golfCourseId: string,
  data: {
    name: string;
    group_type: string;
  }
): Promise<{ success: boolean; message: string; data?: unknown }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data?: unknown;
    }>(`/api/v1/golf-courses/${golfCourseId}/groups/`, data);

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "특수반 생성 실패");
    }
  } catch (error) {
    console.error("특수반 생성 실패:", error);
    throw error;
  }
};

/**
 * 특수반 삭제 API
 */
export const deleteSpecialGroup = async (
  golfCourseId: string,
  groupId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/golf-courses/groups/${groupId}/`);

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "특수반 삭제 실패");
    }
  } catch (error) {
    console.error("특수반 삭제 실패:", error);
    throw error;
  }
};

/**
 * 특수반 배치 API
 */
export const assignSpecialGroupToSlot = async (
  scheduleId: string,
  data: {
    part_id: string;
    time: string;
    field_number: number;
    special_group_id: string;
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(
      `${WORK_API_ENDPOINTS.SCHEDULES}${scheduleId}/assign-special-group/`,
      data
    );

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "특수반 배치 실패");
    }
  } catch (error) {
    console.error("특수반 배치 실패:", error);
    throw error;
  }
};

/**
 * 특수반 배치 제거 API
 */
export const removeSpecialGroupFromSlot = async (
  slotId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/work/slots/${slotId}/`);

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "특수반 배치 제거 실패");
    }
  } catch (error) {
    console.error("특수반 배치 제거 실패:", error);
    throw error;
  }
};

// ================================
// 슬롯 관리 관련 API
// ================================

/**
 * 새로운 슬롯 배정 제거 API
 */
export interface RemoveSlotAssignmentRequest {
  slot_id: string;
  assignment_type: "special" | "caddie" | "all";
}

export const removeSlotAssignment = async (
  scheduleId: string,
  data: RemoveSlotAssignmentRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(
      `${WORK_API_ENDPOINTS.SCHEDULES}${scheduleId}/remove-slot-assignment/`,
      data
    );

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "슬롯 배정 제거 실패");
    }
  } catch (error) {
    console.error("슬롯 배정 제거 실패:", error);
    throw error;
  }
};

/**
 * 워크 슬롯 상태 토글 API (available ↔ reserved)
 */
export const toggleSlotStatus = async (slotId: string): Promise<void> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`${WORK_API_ENDPOINTS.SLOTS}${slotId}/toggle_status/`);

    if (!response.success) {
      throw new Error(response.message || "슬롯 상태 변경 실패");
    }
  } catch (error) {
    console.error("슬롯 상태 토글 실패:", error);
    throw error;
  }
};

/**
 * 워크 슬롯 일괄 상태 변경 API
 */
export const bulkUpdateSlotStatus = async (
  slotIds: string[],
  newStatus: "available" | "reserved"
): Promise<void> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(WORK_API_ENDPOINTS.SLOT_BULK_UPDATE, {
      slot_ids: slotIds,
      new_status: newStatus,
    });

    if (!response.success) {
      throw new Error(response.message || "일괄 상태 변경 실패");
    }
  } catch (error) {
    console.error("일괄 상태 변경 실패:", error);
    throw error;
  }
};

/**
 * 워크 슬롯에서 캐디 제거 API
 */
export const removeCaddieFromSlot = async (slotId: string): Promise<void> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`${WORK_API_ENDPOINTS.SLOTS}${slotId}/remove_caddie/`);

    if (!response.success) {
      throw new Error(response.message || "캐디 제거 실패");
    }
  } catch (error) {
    console.error("캐디 제거 실패:", error);
    throw error;
  }
};

// ================================
// 근무 스케줄 목록 관련 API
// ================================

/**
 * 근무 스케줄 목록 조회 API
 */
export const fetchWorkSchedules = async (): Promise<Work[]> => {
  const response = await apiClient.get<DailyScheduleListResponse>(
    WORK_API_ENDPOINTS.DAILY_SCHEDULES
  );

  if (!response.success) {
    throw new Error(
      response.message || "근무 스케줄 목록 조회에 실패했습니다."
    );
  }

  // 백엔드 형식을 프론트엔드 형식으로 변환
  return response.data.map((schedule, index) => ({
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
    scheduleType: "daily", // API에서 제공되지 않으므로 기본값 사용
    createdAt: schedule.created_at,
    updatedAt: schedule.created_at, // updated_at이 없으므로 created_at 사용
  }));
};

/**
 * 특정 골프장의 일일 스케줄 조회 API
 */
export const fetchDailyScheduleDetail = async (
  golfCourseId: string,
  date: string
): Promise<DailyScheduleDetailResponse> => {
  try {
    const response = await apiClient.get<DailyScheduleDetailResponse>(
      `${WORK_API_ENDPOINTS.DAILY_SCHEDULES}${golfCourseId}/${date}/`
    );

    return response;
  } catch (error) {
    console.error("근무표 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 근무표 자동 배정 API
 */
export const autoAssignWorkSlots = async (
  golfCourseId: string,
  date: string,
  data: AutoAssignRequest
): Promise<AutoAssignResponse> => {
  try {
    const response = await apiClient.post<AutoAssignResponse>(
      `${WORK_API_ENDPOINTS.DAILY_SCHEDULES}${golfCourseId}/${date}/auto-assign/`,
      data
    );

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "근무표 자동 배정 실패");
    }
  } catch (error) {
    console.error("근무표 자동 배정 실패:", error);
    throw error;
  }
};

/**
 * 모든 캐디 배정 초기화 API
 */
export const clearAllCaddieAssignments = async (
  golfCourseId: string,
  date: string
): Promise<void> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(
      `${WORK_API_ENDPOINTS.DAILY_SCHEDULES}${golfCourseId}/${date}/clear-assignments/`
    );

    if (!response.success) {
      throw new Error(response.message || "캐디 배정 초기화 실패");
    }
  } catch (error) {
    console.error("캐디 배정 초기화 실패:", error);
    throw error;
  }
};

/**
 * 일반 근무표 삭제 API
 */
export const deleteDailySchedule = async (
  golfCourseId: string,
  date: string
): Promise<void> => {
  try {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`${WORK_API_ENDPOINTS.DAILY_SCHEDULES}${golfCourseId}/${date}/`);

    if (!response.success) {
      throw new Error(response.message || "일반 근무표 삭제 실패");
    }
  } catch (error) {
    console.error("일반 근무표 삭제 실패:", error);
    throw error;
  }
};
