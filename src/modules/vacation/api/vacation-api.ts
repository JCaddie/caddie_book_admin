import { apiClient } from "@/shared/lib/api-client";
import { VacationRequestListResponse, VacationSearchParams } from "../types";

/**
 * 휴무 신청 목록 조회
 */
export const getVacationRequests = async (
  params?: VacationSearchParams
): Promise<VacationRequestListResponse> => {
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

  return apiClient.get<VacationRequestListResponse>(url);
};

/**
 * 휴무 신청 승인
 */
export const approveVacationRequest = async (id: string): Promise<void> => {
  await apiClient.patch(`/api/v1/users/day-off-requests/${id}/approve/`);
};

/**
 * 휴무 신청 반려
 */
export const rejectVacationRequest = async (id: string): Promise<void> => {
  await apiClient.patch(`/api/v1/users/day-off-requests/${id}/reject/`);
};
