import { apiClient } from "@/shared/lib/api-client";
import { DayOffRequestListResponse, DayOffSearchParams } from "../types";

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
 * 휴무 신청 승인
 */
export const approveDayOffRequest = async (id: string): Promise<void> => {
  await apiClient.patch(`/api/v1/users/day-off-requests/${id}/approve/`);
};

/**
 * 휴무 신청 반려
 */
export const rejectDayOffRequest = async (id: string): Promise<void> => {
  await apiClient.patch(`/api/v1/users/day-off-requests/${id}/reject/`);
};

/**
 * 휴무 신청 일괄 승인
 */
export const bulkApproveDayOffRequests = async (
  requestIds: string[]
): Promise<void> => {
  await apiClient.post("/api/v1/users/day-off-requests/bulk_approve/", {
    request_ids: requestIds,
  });
};

/**
 * 휴무 신청 일괄 거절
 */
export const bulkRejectDayOffRequests = async (
  requestIds: string[],
  rejectionReason: string
): Promise<void> => {
  await apiClient.post("/api/v1/users/day-off-requests/bulk_reject/", {
    request_ids: requestIds,
    rejection_reason: rejectionReason,
  });
};
