import { apiClient } from "@/shared/lib/api-client";
import {
  DayOffRequest,
  DayOffRequestListResponse,
  DayOffSearchParams,
} from "../types";

/**
 * 휴무 신청 상세 조회
 */
export const getDayOffRequestDetail = async (
  id: string
): Promise<DayOffRequest> => {
  return apiClient.get<DayOffRequest>(`/api/v1/users/day-off-requests/${id}/`);
};

/**
 * 휴무 신청 목록 조회
 */
export const getDayOffRequests = async (
  params?: DayOffSearchParams
): Promise<DayOffRequestListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.page_size) {
    searchParams.append("page_size", params.page_size.toString());
  }

  if (params?.request_type) {
    searchParams.append("request_type", params.request_type);
  }

  if (params?.status) {
    searchParams.append("status", params.status);
  }

  if (params?.search) {
    searchParams.append("search", params.search);
  }

  const queryString = searchParams.toString();
  const url = `/api/v1/users/day-off-requests/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<DayOffRequestListResponse>(url);
};

/**
 * 휴무 신청 승인 (단일 또는 일괄)
 */
export const approveDayOffRequests = async (
  requestIds: string[]
): Promise<void> => {
  if (requestIds.length === 1) {
    // 단일 승인
    await apiClient.patch(
      `/api/v1/users/day-off-requests/${requestIds[0]}/approve/`
    );
  } else {
    // 일괄 승인
    await apiClient.post("/api/v1/users/day-off-requests/bulk_approve/", {
      request_ids: requestIds,
    });
  }
};

/**
 * 휴무 신청 반려 (단일 또는 일괄)
 */
export const rejectDayOffRequests = async (
  requestIds: string[],
  rejectionReason?: string
): Promise<void> => {
  if (requestIds.length === 1) {
    // 단일 반려
    await apiClient.patch(
      `/api/v1/users/day-off-requests/${requestIds[0]}/reject/`
    );
  } else {
    // 일괄 반려
    await apiClient.post("/api/v1/users/day-off-requests/bulk_reject/", {
      request_ids: requestIds,
      rejection_reason: rejectionReason || "",
    });
  }
};

// ================================
// Deprecated Functions (하위 호환성을 위해 유지)
// ================================

/**
 * @deprecated Use approveDayOffRequests instead
 */
export const approveDayOffRequest = async (id: string): Promise<void> => {
  await approveDayOffRequests([id]);
};

/**
 * @deprecated Use rejectDayOffRequests instead
 */
export const rejectDayOffRequest = async (id: string): Promise<void> => {
  await rejectDayOffRequests([id]);
};

/**
 * @deprecated Use approveDayOffRequests instead
 */
export const bulkApproveDayOffRequests = async (
  requestIds: string[]
): Promise<void> => {
  await approveDayOffRequests(requestIds);
};

/**
 * @deprecated Use rejectDayOffRequests instead
 */
export const bulkRejectDayOffRequests = async (
  requestIds: string[],
  rejectionReason: string
): Promise<void> => {
  await rejectDayOffRequests(requestIds, rejectionReason);
};
