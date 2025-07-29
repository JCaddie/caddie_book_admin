import { apiClient } from "@/shared/lib/api-client";
import type {
  ApiResponse,
  BulkApproveRequest,
  BulkRejectRequest,
  NewCaddieListResponse,
} from "../types";

/**
 * 신규 캐디 목록 조회 파라미터
 */
export interface NewCaddieListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

/**
 * 신규 캐디 목록 조회
 * GET /api/v1/new-caddies/
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

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/new-caddies/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<NewCaddieListResponse>(endpoint);
};

/**
 * 신규 캐디 일괄 승인
 * POST /api/v1/new-caddies/bulk-approve/
 */
export const bulkApproveNewCaddies = async (
  request: BulkApproveRequest
): Promise<ApiResponse> => {
  const endpoint = `/api/v1/new-caddies/bulk-approve/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};

/**
 * 신규 캐디 일괄 거절
 * POST /api/v1/new-caddies/bulk-reject/
 */
export const bulkRejectNewCaddies = async (
  request: BulkRejectRequest
): Promise<ApiResponse> => {
  const endpoint = `/api/v1/new-caddies/bulk-reject/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};
