import { apiClient } from "@/shared/lib/api-client";
import {
  AdminsApiResponse,
  CaddieAssignmentOverviewResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  UserDetailApiResponse,
  UserListApiResponse,
} from "../types/user";

// 타입들을 다시 export
export type { AdminsApiResponse, UserDetailApiResponse, UserListApiResponse };

/**
 * 사용자 목록 조회 (새로운 API 형식)
 */
export const getUsers = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
}): Promise<UserListApiResponse> => {
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

  if (params?.role) {
    searchParams.append("role", params.role);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/users/${queryString ? `?${queryString}` : ""}`;

  return apiClient.get<UserListApiResponse>(endpoint);
};

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
 * 사용자 상세 조회
 */
export const getUserDetail = async (
  userId: string
): Promise<UserDetailApiResponse> => {
  return apiClient.get<UserDetailApiResponse>(`/api/v1/users/${userId}/`);
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
