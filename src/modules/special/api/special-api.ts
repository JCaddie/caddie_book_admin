/**
 * Special Group API
 * 특수반 관리를 위한 통합 API 레이어
 */

import { apiClient } from "@/shared/lib/api-client";
import { WORK_API_ENDPOINTS } from "@/modules/work/api/work-api";
import {
  BaseGroup,
  CreateGroupRequest,
  GroupListParams,
  GroupManagementAPI,
} from "@/shared/types";

// ================================
// Special Group 전용 타입 정의
// ================================

export interface SpecialGroupResponse extends BaseGroup {
  member_count: number;
  color?: string;
}

export interface SpecialScheduleDetailResponse {
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

export interface SpecialGroupsStatusResponse {
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

export interface AssignSpecialGroupRequest {
  part_id: string;
  time: string;
  field_number: number;
  special_group_id: string;
}

// ================================
// Special Group API 구현
// ================================

class SpecialGroupAPI implements GroupManagementAPI<SpecialGroupResponse> {
  /**
   * 특수반 생성
   */
  async create(data: CreateGroupRequest): Promise<SpecialGroupResponse> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: SpecialGroupResponse;
      }>(`/api/v1/golf-courses/${data.golf_course_id}/groups/`, {
        name: data.name,
        group_type: "SPECIAL",
        is_active: data.is_active ?? true,
        description: data.description,
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "특수반 생성 실패");
      }
    } catch (error) {
      console.error("특수반 생성 실패:", error);
      throw error;
    }
  }

  /**
   * 특수반 수정
   */
  async update(
    id: string,
    data: Partial<CreateGroupRequest>
  ): Promise<SpecialGroupResponse> {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
        data: SpecialGroupResponse;
      }>(`/api/v1/golf-courses/groups/${id}/`, data);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "특수반 수정 실패");
      }
    } catch (error) {
      console.error("특수반 수정 실패:", error);
      throw error;
    }
  }

  /**
   * 특수반 삭제
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/api/v1/golf-courses/groups/${id}/`);

      if (!response.success) {
        throw new Error(response.message || "특수반 삭제 실패");
      }
    } catch (error) {
      console.error("특수반 삭제 실패:", error);
      throw error;
    }
  }

  /**
   * 특수반 목록 조회
   */
  async list(params?: GroupListParams): Promise<SpecialGroupResponse[]> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.golf_course_id) {
        searchParams.append("golf_course", params.golf_course_id);
      }

      // 특수반만 조회
      searchParams.append("group_type", "SPECIAL");

      if (params?.is_active !== undefined) {
        searchParams.append("is_active", params.is_active.toString());
      }

      if (params?.search) {
        searchParams.append("search", params.search);
      }

      const queryString = searchParams.toString();
      const endpoint = `/api/v1/caddie-groups/groups/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: SpecialGroupResponse[];
      }>(endpoint);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "특수반 목록 조회 실패");
      }
    } catch (error) {
      console.error("특수반 목록 조회 실패:", error);
      throw error;
    }
  }

  /**
   * 특수반 상세 조회 (스케줄 포함)
   */
  async getScheduleDetail(
    scheduleId: string
  ): Promise<SpecialScheduleDetailResponse["data"]> {
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
  }
}

// ================================
// 특수반 스케줄 관리 API
// ================================

/**
 * 골프장별 특수반 현황 조회
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
 * 특수반 배치
 */
export const assignSpecialGroupToSlot = async (
  scheduleId: string,
  data: AssignSpecialGroupRequest
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
 * @deprecated removeSlotAssignment 사용 권장
 * 특수반 배치 제거 (하위 호환성을 위해 유지)
 */
export const removeSpecialGroupFromSlot = async (
  slotId: string
): Promise<{ success: boolean; message: string }> => {
  console.warn(
    "removeSpecialGroupFromSlot은 deprecated입니다. removeSlotAssignment를 사용하세요."
  );
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
// API 인스턴스 export
// ================================

export const specialGroupAPI = new SpecialGroupAPI();

// 호환성을 위한 개별 함수 export
export const createSpecialGroup = (data: CreateGroupRequest) =>
  specialGroupAPI.create(data);

export const updateSpecialGroup = (
  id: string,
  data: Partial<CreateGroupRequest>
) => specialGroupAPI.update(id, data);

export const deleteSpecialGroup = (id: string) => specialGroupAPI.delete(id);

export const getSpecialGroups = (params?: GroupListParams) =>
  specialGroupAPI.list(params);

export const getSpecialScheduleDetail = (scheduleId: string) =>
  specialGroupAPI.getScheduleDetail(scheduleId);
