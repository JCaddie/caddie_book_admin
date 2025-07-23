import { apiClient } from "@/shared/lib/api-client";
import {
  AdminsApiResponse,
  CaddieAssignmentOverviewResponse,
  UserDetailApiResponse,
} from "../types/user";

/**
 * 관리자 목록 조회
 */
export const getAdmins = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
}): Promise<AdminsApiResponse> => {
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
  const endpoint = `/api/v1/users/admins/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<AdminsApiResponse>(endpoint);
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
 * 캐디 그룹 배정 개요 조회 (새로운 API)
 */
export const getCaddieAssignmentOverview = async (
  golfCourseId?: string
): Promise<CaddieAssignmentOverviewResponse> => {
  const searchParams = new URLSearchParams();

  if (golfCourseId) {
    searchParams.append("golf_course_id", golfCourseId);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/caddie-groups/assignments/overview/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<CaddieAssignmentOverviewResponse>(endpoint);
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
