import { apiClient } from "@/shared/lib/api-client";
import type { NewCaddieListResponse } from "../types";

/**
 * 신규 캐디 목록 조회 파라미터
 */
export interface NewCaddieListParams {
  page?: number;
  page_size?: number;
  search?: string;
  golf_course?: string; // 골프장 UUID 필터 추가
}

/**
 * 일괄 승인 요청 타입
 */
export interface BulkApproveRequest {
  user_ids: string[];
}

/**
 * 일괄 거절 요청 타입
 */
export interface BulkRejectRequest {
  user_ids: string[];
  rejection_reason: string;
}

/**
 * API 응답 기본 타입
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
}

// ================================
// API 함수들
// ================================

/**
 * 신규 캐디 목록 조회
 * GET /v1/caddies/pending-registrations/
 */
export const getNewCaddieList = async (
  params?: NewCaddieListParams
): Promise<NewCaddieListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.page_size) {
    searchParams.append("page_size", params.page_size.toString());
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }
  if (params?.golf_course) {
    searchParams.append("golf_course", params.golf_course);
  }

  const queryString = searchParams.toString();
  const endpoint = `/v1/caddies/pending-registrations/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<NewCaddieListResponse>(endpoint);
};

/**
 * 신규 캐디 일괄 승인
 * POST /v1/caddies/pending-registrations/bulk-approve/
 */
export const bulkApproveNewCaddies = async (
  request: BulkApproveRequest
): Promise<ApiResponse> => {
  const endpoint = `/v1/caddies/pending-registrations/bulk-approve/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};

/**
 * 신규 캐디 일괄 거절
 * POST /v1/caddies/pending-registrations/bulk-reject/
 */
export const bulkRejectNewCaddies = async (
  request: BulkRejectRequest
): Promise<ApiResponse> => {
  const endpoint = `/v1/caddies/pending-registrations/bulk-reject/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};
