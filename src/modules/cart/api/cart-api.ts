import { apiClient } from "@/shared/lib/api-client";
import {
  ApiCartData,
  ApiCartListResponse,
  ApiCreateCartRequest,
  ApiUpdateCartRequest,
} from "../types";

/**
 * 카트 목록 조회
 */
export const fetchCarts = async ({
  page = 1,
  searchTerm,
  status,
  golfCourseId,
}: {
  page?: number;
  searchTerm?: string;
  status?: string;
  golfCourseId?: string;
}): Promise<ApiCartListResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));

    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (status) {
      params.append("status", status);
    }
    if (golfCourseId) {
      params.append("golf_course_id", golfCourseId);
    }

    console.log("🔄 카트 목록 조회 시작");
    const response = await apiClient.get<ApiCartListResponse>(
      `/api/v1/carts/?${params}`
    );
    console.log("✅ 카트 목록 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 카트 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 카트 상세 조회
 */
export const fetchCartDetail = async (id: string): Promise<ApiCartData> => {
  try {
    console.log("🔄 카트 상세 조회 시작:", id);
    const response = await apiClient.get<ApiCartData>(`/api/v1/carts/${id}/`);
    console.log("✅ 카트 상세 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 카트 상세 조회 실패:", error);
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
    console.log("🔄 카트 생성 시작:", data);
    const response = await apiClient.post<ApiCartData>(`/api/v1/carts/`, data);
    console.log("✅ 카트 생성 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 카트 생성 실패:", error);
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
    console.log("🔄 카트 수정 시작:", id, data);
    const response = await apiClient.patch<ApiCartData>(
      `/api/v1/carts/${id}/`,
      data
    );
    console.log("✅ 카트 수정 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 카트 수정 실패:", error);
    throw error;
  }
};

/**
 * 카트 삭제
 */
export const deleteCart = async (id: string): Promise<void> => {
  try {
    console.log("🔄 카트 삭제 시작:", id);
    await apiClient.delete(`/api/v1/carts/${id}/`);
    console.log("✅ 카트 삭제 성공");
  } catch (error) {
    console.error("❌ 카트 삭제 실패:", error);
    throw error;
  }
};

/**
 * 카트 일괄 삭제
 */
export const deleteCartsBulk = async (ids: string[]): Promise<void> => {
  try {
    console.log("🔄 카트 일괄 삭제 시작:", ids);
    await apiClient.delete(`/api/v1/carts/bulk_delete/`, {
      body: JSON.stringify({ ids }),
    });
    console.log("✅ 카트 일괄 삭제 성공");
  } catch (error) {
    console.error("❌ 카트 일괄 삭제 실패:", error);
    throw error;
  }
};
