import { apiClient } from "@/shared/lib/api-client";
import {
  AdminsApiResponse,
  BulkDeleteAdminsRequest,
  BulkDeleteAdminsResponse,
  CaddieAssignmentOverviewResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  CreateTemporaryCaddieRequest,
  CreateTemporaryCaddieSuccessResponse,
  DeleteTemporaryCaddieResponse,
  UpdateAdminRequest,
  UpdateAdminResponse,
  UserDetailApiResponse,
} from "../types/user";

// 타입들을 다시 export
export type { AdminsApiResponse, UserDetailApiResponse };

/**
 * 관리자 목록 조회 (검색 및 필터링 지원)
 */
export const getAdmins = async (params?: {
  search?: string;
  role?: string;
  page?: number;
  page_size?: number;
}): Promise<AdminsApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.append("search", params.search);
  }

  if (params?.role) {
    searchParams.append("role", params.role);
  }

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.page_size) {
    searchParams.append("page_size", params.page_size.toString());
  }

  const queryString = searchParams.toString();
  const url = `/api/v1/users/admins/${queryString ? `?${queryString}` : ""}`;

  return apiClient.get(url);
};

/**
 * 어드민 상세 조회
 */
export const getUserDetail = async (
  userId: string
): Promise<UserDetailApiResponse> => {
  return apiClient.get<UserDetailApiResponse>(
    `/api/v1/users/admins/${userId}/`
  );
};

/**
 * @deprecated 그룹 관련 API로 이동됨 - getGroupAssignmentOverview 사용
 */
export const getCaddieAssignmentOverview = async (
  golfCourseId?: string
): Promise<CaddieAssignmentOverviewResponse> => {
  console.warn(
    "getCaddieAssignmentOverview is deprecated. Use getGroupAssignmentOverview from group-api instead."
  );

  const searchParams = new URLSearchParams();

  if (golfCourseId) {
    searchParams.append("golf_course_id", golfCourseId);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/caddie-groups/assignment-overview/overview/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<CaddieAssignmentOverviewResponse>(endpoint);
};

// 어드민 생성
export const createAdmin = async (
  data: CreateAdminRequest
): Promise<CreateAdminResponse> => {
  return apiClient.post("/api/v1/users/admins/", data);
};

// 어드민 벌크 삭제
export const bulkDeleteAdmins = async (
  data: BulkDeleteAdminsRequest
): Promise<BulkDeleteAdminsResponse> => {
  return apiClient.delete("/api/v1/users/admins/bulk-delete/", {
    body: JSON.stringify(data),
  });
};

// 어드민 수정
export const updateAdmin = async (
  userId: string,
  data: UpdateAdminRequest
): Promise<UpdateAdminResponse> => {
  return apiClient.patch(`/api/v1/users/admins/${userId}/`, data);
};

/**
 * @deprecated 새로운 API로 변경됨 - getCaddieAssignmentOverview 사용
 */
export const getUserAssignments = async (
  golfCourseId?: string
): Promise<CaddieAssignmentOverviewResponse> => {
  console.warn(
    "getUserAssignments is deprecated. Use getCaddieAssignmentOverview instead."
  );
  return getCaddieAssignmentOverview(golfCourseId);
};

// 임시 캐디 생성
export const createTemporaryCaddie = async (
  data: CreateTemporaryCaddieRequest
): Promise<CreateTemporaryCaddieSuccessResponse> => {
  return apiClient.post("/api/v1/users/temporary-caddies/", data);
};

// 임시 캐디 삭제
export const deleteTemporaryCaddie = async (
  caddieId: string
): Promise<DeleteTemporaryCaddieResponse> => {
  return apiClient.delete(
    `/api/v1/users/temporary-caddies/${caddieId}/delete/`
  );
};
