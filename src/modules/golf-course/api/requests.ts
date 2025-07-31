// 골프장 관련 API 요청 함수들

import { apiClient } from "@/shared/lib/api-client";
import { buildUrl, GOLF_COURSE_ENDPOINTS } from "./endpoints";
import {
  transformEditableToApiRequest,
  transformFiltersToParams,
} from "./transforms";

import type {
  BulkDeleteRequest,
  EditableGolfCourse,
  GolfCourseDetail,
  GolfCourseDetailResponse,
  GolfCourseFilters,
  GolfCourseGroupDetailResponse,
  GolfCourseListResponse,
  GolfCourseSimpleResponse,
} from "../types";

/**
 * 골프장 목록 조회
 */
export const fetchGolfCourses = async (
  page: number = 1,
  search: string = "",
  filters: GolfCourseFilters
): Promise<GolfCourseListResponse> => {
  const params = transformFiltersToParams({
    search,
    contract: filters.contract,
    membership_type: filters.membership_type,
    page,
  });

  const url = buildUrl(GOLF_COURSE_ENDPOINTS.LIST, params);
  return await apiClient.get<GolfCourseListResponse>(url);
};

/**
 * 골프장 상세 정보 조회
 */
export const fetchGolfCourseDetail = async (
  id: string
): Promise<GolfCourseDetailResponse> => {
  const url = GOLF_COURSE_ENDPOINTS.DETAIL(id);
  return await apiClient.get<GolfCourseDetailResponse>(url);
};

/**
 * 골프장 생성
 */
export const createGolfCourse = async (
  formData: EditableGolfCourse
): Promise<GolfCourseDetailResponse> => {
  const requestData = transformEditableToApiRequest(formData);
  return await apiClient.post<GolfCourseDetailResponse>(
    GOLF_COURSE_ENDPOINTS.CREATE,
    requestData
  );
};

/**
 * 골프장 수정
 */
export const updateGolfCourse = async (
  id: string,
  data: Partial<GolfCourseDetail> | Partial<EditableGolfCourse>
): Promise<GolfCourseDetailResponse> => {
  const url = GOLF_COURSE_ENDPOINTS.UPDATE(id);
  return await apiClient.patch<GolfCourseDetailResponse>(url, data);
};

/**
 * 골프장 삭제
 */
export const deleteGolfCourse = async (id: string): Promise<void> => {
  const url = GOLF_COURSE_ENDPOINTS.DELETE(id);
  await apiClient.delete(url);
};

/**
 * 골프장 대량 삭제
 */
export const bulkDeleteGolfCourses = async (ids: string[]): Promise<void> => {
  const requestData: BulkDeleteRequest = { ids };
  await apiClient.post(GOLF_COURSE_ENDPOINTS.BULK_DELETE, requestData);
};

/**
 * 골프장 간소 목록 조회 (드롭다운용)
 */
export const fetchGolfCoursesSimple =
  async (): Promise<GolfCourseSimpleResponse> => {
    return await apiClient.get<GolfCourseSimpleResponse>(
      GOLF_COURSE_ENDPOINTS.SIMPLE_LIST
    );
  };

/**
 * 골프장 그룹 상세 정보 조회
 */
export const fetchGolfCourseGroupDetail = async (
  id: string
): Promise<GolfCourseGroupDetailResponse> => {
  const url = GOLF_COURSE_ENDPOINTS.GROUP_DETAIL(id);
  return await apiClient.get<GolfCourseGroupDetailResponse>(url);
};

/**
 * 골프장 검색
 */
export const searchGolfCourses = async (
  keyword: string,
  filters?: Partial<GolfCourseFilters>
): Promise<GolfCourseListResponse> => {
  const params = transformFiltersToParams({
    search: keyword,
    ...filters,
  });

  const url = buildUrl(GOLF_COURSE_ENDPOINTS.SEARCH, params);
  return await apiClient.get<GolfCourseListResponse>(url);
};

/**
 * 골프장 필터링
 */
export const filterGolfCourses = async (
  filters: GolfCourseFilters,
  page: number = 1
): Promise<GolfCourseListResponse> => {
  const params = transformFiltersToParams({
    ...filters,
    page,
  });

  const url = buildUrl(GOLF_COURSE_ENDPOINTS.FILTER, params);
  return await apiClient.get<GolfCourseListResponse>(url);
};
