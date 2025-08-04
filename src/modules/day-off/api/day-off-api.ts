import { apiClient } from "@/shared/lib/api-client";
import {
  DayOffRequest,
  DayOffRequestListResponse,
  DayOffRequestDetailResponse,
  DayOffSearchParams,
} from "../types";

/**
 * 휴무 신청 상세 조회
 */
export const getDayOffRequestDetail = async (
  id: string
): Promise<DayOffRequest> => {
  const response = await apiClient.get<DayOffRequestDetailResponse>(
    `/api/v1/caddies/daily-statuses/${id}/`
  );
  return response.data;
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
  const url = `/api/v1/caddies/daily-statuses/pending_requests/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<DayOffRequestListResponse>(url);
};

/**
 * 휴무 신청 승인 (일괄 처리)
 */
export const approveDayOffRequests = async (
  requestIds: string[]
): Promise<void> => {
  await apiClient.post("/api/v1/caddies/daily-statuses/bulk-approve/", {
    request_ids: requestIds,
  });
};

/**
 * 휴무 신청 반려 (일괄 처리)
 */
export const rejectDayOffRequests = async (
  requestIds: string[],
  rejectionReason?: string
): Promise<void> => {
  await apiClient.post("/api/v1/caddies/daily-statuses/bulk-reject/", {
    request_ids: requestIds,
    rejection_reason: rejectionReason || "",
  });
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
