import { apiClient } from "@/shared/lib/api-client";
import { Caddie, CaddieDetail } from "@/shared/types/caddie";
import {
  ApiResponse,
  BulkApproveRequest,
  BulkRejectRequest,
  NewCaddieListResponse,
} from "../types/new-caddie";

/**
 * 캐디 목록 조회 API 응답 타입
 */
export interface CaddieListResponse {
  results: Caddie[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * 캐디 목록 조회 파라미터
 */
export interface CaddieListParams {
  page?: number;
  page_size?: number;
  search?: string;
  group?: string;
  special_team?: string;
  golf_course_id?: string;
}

/**
 * 캐디 목록 조회
 * GET /api/v1/auth/caddies/
 */
export const getCaddieList = async (
  params?: CaddieListParams
): Promise<CaddieListResponse> => {
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
  if (params?.group && params.group !== "그룹") {
    searchParams.append("group", params.group);
  }
  if (params?.special_team && params.special_team !== "특수반") {
    searchParams.append("special_team", params.special_team);
  }
  if (params?.golf_course_id) {
    searchParams.append("golf_course_id", params.golf_course_id);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/auth/caddies/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<CaddieListResponse>(endpoint);
};

/**
 * 캐디 상세정보 조회
 * GET /api/v1/auth/caddies/{id}/
 */
export const getCaddieDetail = async (id: string): Promise<CaddieDetail> => {
  const endpoint = `/api/v1/auth/caddies/${id}/`;
  return apiClient.get<CaddieDetail>(endpoint);
};

/**
 * 캐디 삭제
 * DELETE /api/v1/auth/caddies/{id}/
 */
export const deleteCaddie = async (id: string): Promise<void> => {
  const endpoint = `/api/v1/auth/caddies/${id}/`;
  return apiClient.delete<void>(endpoint);
};

/**
 * 복수 캐디 삭제
 */
export const deleteCaddies = async (ids: string[]): Promise<void> => {
  // 각 캐디를 개별적으로 삭제
  await Promise.all(ids.map((id) => deleteCaddie(id)));
};

// ================================
// 신규 캐디 관련 API
// ================================

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
 * GET /api/v1/auth/new-caddies/
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
  const endpoint = `/api/v1/auth/new-caddies/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<NewCaddieListResponse>(endpoint);
};

/**
 * 신규 캐디 일괄 승인
 * POST /api/v1/auth/new-caddies/bulk-approve/
 */
export const bulkApproveNewCaddies = async (
  request: BulkApproveRequest
): Promise<ApiResponse> => {
  const endpoint = `/api/v1/auth/new-caddies/bulk-approve/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};

/**
 * 신규 캐디 일괄 거절
 * POST /api/v1/auth/new-caddies/bulk-reject/
 */
export const bulkRejectNewCaddies = async (
  request: BulkRejectRequest
): Promise<ApiResponse> => {
  const endpoint = `/api/v1/auth/new-caddies/bulk-reject/`;
  return apiClient.post<ApiResponse>(endpoint, request);
};

// ================================
// 캐디 편집 관련 API
// ================================

/**
 * 캐디 정보 업데이트 요청 타입
 */
export interface UpdateCaddieRequest {
  name?: string;
  gender?: string;
  employment_type?: string;
  phone?: string;
  email?: string;
  address?: string;
  golf_course_id?: string;
  work_score?: number;
  is_team_leader?: boolean;
  primary_group_id?: string;
  special_group_ids?: string[];
}

/**
 * 캐디 정보 업데이트
 * PATCH /api/v1/auth/caddies/{id}/
 */
export const updateCaddie = async (
  id: string,
  data: UpdateCaddieRequest
): Promise<CaddieDetail> => {
  const endpoint = `/api/v1/auth/caddies/${id}/`;
  return apiClient.patch<CaddieDetail>(endpoint, data);
};

/**
 * 캐디 이름 업데이트
 */
export const updateCaddieName = async (
  id: string,
  name: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { name });
};

/**
 * 캐디 성별 업데이트
 */
export const updateCaddieGender = async (
  id: string,
  gender: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { gender });
};

/**
 * 캐디 고용형태 업데이트
 */
export const updateCaddieEmploymentType = async (
  id: string,
  employment_type: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { employment_type });
};

/**
 * 캐디 연락처 업데이트
 */
export const updateCaddiePhone = async (
  id: string,
  phone: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { phone });
};

/**
 * 캐디 이메일 업데이트
 */
export const updateCaddieEmail = async (
  id: string,
  email: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { email });
};

/**
 * 캐디 주소 업데이트
 */
export const updateCaddieAddress = async (
  id: string,
  address: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { address });
};

/**
 * 캐디 골프장 업데이트
 */
export const updateCaddieGolfCourse = async (
  id: string,
  golf_course_id: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { golf_course_id });
};

/**
 * 캐디 근무점수 업데이트
 */
export const updateCaddieWorkScore = async (
  id: string,
  work_score: number
): Promise<CaddieDetail> => {
  return updateCaddie(id, { work_score });
};

/**
 * 캐디 팀장 여부 업데이트
 */
export const updateCaddieTeamLeader = async (
  id: string,
  is_team_leader: boolean
): Promise<CaddieDetail> => {
  return updateCaddie(id, { is_team_leader });
};

/**
 * 캐디 주 그룹 업데이트
 */
export const updateCaddiePrimaryGroup = async (
  id: string,
  primary_group_id: string
): Promise<CaddieDetail> => {
  return updateCaddie(id, { primary_group_id });
};

/**
 * 캐디 특수반 업데이트
 */
export const updateCaddieSpecialGroups = async (
  id: string,
  special_group_ids: string[]
): Promise<CaddieDetail> => {
  return updateCaddie(id, { special_group_ids });
};
