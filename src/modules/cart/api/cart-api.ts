import { apiClient } from "@/shared/lib/api-client";
import {
  ApiBatteryLevelChoicesResponse,
  ApiCartData,
  ApiCartDetailResponse,
  ApiCartHistoryResponse,
  ApiCartListResponse,
  ApiCreateCartRequest,
  ApiStatusChoicesResponse,
  ApiUpdateCartRequest,
} from "../types";

/**
 * 카트 목록 조회
 */
export const fetchCartList = async (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string,
  status?: string,
  golfCourseId?: string
): Promise<ApiCartListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (status) {
      params.append("status", status);
    }
    if (golfCourseId) {
      params.append("golf_course_id", golfCourseId);
    }

    const response = await apiClient.get<ApiCartListResponse>(
      `/api/v1/carts/?${params}`
    );
    return response;
  } catch (error) {
    console.error("카트 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 카트 상세 조회 (기본 정보)
 */
export const fetchCartDetail = async (id: string): Promise<ApiCartData> => {
  try {
    const response = await apiClient.get<ApiCartData>(`/api/v1/carts/${id}/`);
    return response;
  } catch (error) {
    console.error("카트 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 카트 사용 이력 조회
 */
export const fetchCartHistories = async (
  id: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiCartHistoryResponse> => {
  try {
    const response = await apiClient.get<ApiCartHistoryResponse>(
      `/api/v1/carts/${id}/histories/?page=${page}&page_size=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error("카트 이력 조회 실패:", error);
    throw error;
  }
};

/**
 * 카트 생성
 */
export const createCart = async (
  data: ApiCreateCartRequest
): Promise<ApiCartData> => {
  try {
    const response = await apiClient.post<ApiCartData>("/api/v1/carts/", data);
    return response;
  } catch (error) {
    console.error("카트 생성 실패:", error);
    throw error;
  }
};

/**
 * 카트 수정
 */
export const updateCart = async (
  id: string,
  data: ApiUpdateCartRequest
): Promise<ApiCartData> => {
  try {
    const response = await apiClient.put<ApiCartData>(
      `/api/v1/carts/${id}/`,
      data
    );
    return response;
  } catch (error) {
    console.error("카트 수정 실패:", error);
    throw error;
  }
};

/**
 * 카트 삭제
 */
export const deleteCart = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/carts/${id}/`);
  } catch (error) {
    console.error("카트 삭제 실패:", error);
    throw error;
  }
};

/**
 * 카트 일괄 삭제
 */
export const deleteCartsBulk = async (ids: string[]): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/carts/bulk_delete/`, {
      body: JSON.stringify({ ids }),
    });
  } catch (error) {
    console.error("카트 일괄 삭제 실패:", error);
    throw error;
  }
};

/**
 * 카트 상태 선택지 조회
 */
export const fetchStatusChoices =
  async (): Promise<ApiStatusChoicesResponse> => {
    try {
      const response = await apiClient.get<ApiStatusChoicesResponse>(
        `/api/v1/carts/status_choices/`
      );
      return response;
    } catch (error) {
      console.error("카트 상태 선택지 조회 실패:", error);
      throw error;
    }
  };

/**
 * 카트 배터리 레벨 선택지 조회
 */
export const fetchBatteryLevelChoices =
  async (): Promise<ApiBatteryLevelChoicesResponse> => {
    try {
      const response = await apiClient.get<ApiBatteryLevelChoicesResponse>(
        `/api/v1/carts/battery_level_choices/`
      );
      return response;
    } catch (error) {
      console.error("카트 배터리 레벨 선택지 조회 실패:", error);
      throw error;
    }
  };

/**
 * 카트 개별 필드 수정
 */
export const updateCartField = async (
  id: string,
  field: string,
  value: string | number
): Promise<ApiCartDetailResponse> => {
  try {
    const updateData: Record<string, string | number> = { [field]: value };

    const response = await apiClient.patch<ApiCartDetailResponse>(
      `/api/v1/carts/${id}/`,
      updateData
    );
    return response;
  } catch (error) {
    console.error("카트 필드 수정 실패:", error);
    throw error;
  }
};
