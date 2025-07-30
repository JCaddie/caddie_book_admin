// ================================
// 캐디 API 요청 함수
// ================================

import { apiClient } from "@/shared/lib/api-client";
import type {
  BulkDeleteCaddiesRequest,
  CaddieDetailResponse,
  CaddieGroupListResponse,
  CaddieListParams,
  CaddieListResponse,
  CreateCaddieRequest,
  UpdateCaddieRequest,
} from "../types/api";
import {
  buildCaddieDetailUrl,
  buildCaddieGroupsUrl,
  buildCaddieListUrl,
  CADDIE_ENDPOINTS,
} from "./endpoints";

// ================================
// 캐디 목록 관련 API
// ================================

/**
 * 캐디 목록 조회
 * GET /api/v1/caddies/
 */
export const fetchCaddieList = async (
  params: CaddieListParams = {}
): Promise<CaddieListResponse> => {
  const url = buildCaddieListUrl(params);
  return apiClient.get<CaddieListResponse>(url);
};

// ================================
// 캐디 상세 관련 API
// ================================

/**
 * 캐디 상세정보 조회
 * GET /api/v1/caddies/{id}/
 */
export const fetchCaddieDetail = async (
  id: string
): Promise<CaddieDetailResponse> => {
  const url = buildCaddieDetailUrl(id);
  return apiClient.get<CaddieDetailResponse>(url);
};

/**
 * 캐디 정보 수정
 * PATCH /api/v1/caddies/{id}/
 */
export const updateCaddie = async (
  id: string,
  data: UpdateCaddieRequest
): Promise<CaddieDetailResponse> => {
  const url = CADDIE_ENDPOINTS.UPDATE(id);
  return apiClient.patch<CaddieDetailResponse>(url, data);
};

/**
 * 캐디 삭제
 * DELETE /api/v1/caddies/{id}/
 */
export const deleteCaddie = async (id: string): Promise<void> => {
  const url = CADDIE_ENDPOINTS.DELETE(id);
  return apiClient.delete(url);
};

// ================================
// 캐디 생성 관련 API
// ================================

/**
 * 캐디 생성
 * POST /api/v1/caddies/
 */
export const createCaddie = async (
  data: CreateCaddieRequest
): Promise<CaddieDetailResponse> => {
  return apiClient.post<CaddieDetailResponse>(CADDIE_ENDPOINTS.CREATE, data);
};

// ================================
// 캐디 벌크 작업 API
// ================================

/**
 * 캐디 벌크 삭제
 * POST /api/v1/caddies/bulk-delete/
 */
export const bulkDeleteCaddies = async (
  data: BulkDeleteCaddiesRequest
): Promise<{ success: boolean; message: string }> => {
  return apiClient.post(CADDIE_ENDPOINTS.BULK_DELETE, data);
};

// ================================
// 캐디 그룹 관련 API
// ================================

/**
 * 캐디 그룹 목록 조회
 * GET /api/v1/golf-courses/{golf_course_id}/groups/?group_type=TYPE
 */
export const fetchCaddieGroups = async (
  golfCourseId: string,
  groupType: "PRIMARY" | "SPECIAL"
): Promise<CaddieGroupListResponse> => {
  const url = buildCaddieGroupsUrl(golfCourseId, groupType);
  return apiClient.get<CaddieGroupListResponse>(url);
};

// ================================
// 개별 필드 업데이트 API (편의 함수들)
// ================================

/**
 * 캐디 고용형태 업데이트
 */
export const updateCaddieEmploymentType = async (
  id: string,
  employment_type: string
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, { employment_type });
};

/**
 * 캐디 근무점수 업데이트
 */
export const updateCaddieWorkScore = async (
  id: string,
  work_score: number
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, { work_score });
};

/**
 * 캐디 팀장 여부 업데이트
 */
export const updateCaddieTeamLeader = async (
  id: string,
  is_team_leader: boolean
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, { is_team_leader });
};

/**
 * 캐디 주그룹 업데이트
 */
export const updateCaddiePrimaryGroup = async (
  id: string,
  primary_group_id: string
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, { primary_group_id });
};

/**
 * 캐디 특수반 업데이트
 */
export const updateCaddieSpecialGroups = async (
  id: string,
  special_group_ids: string[]
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, { special_group_ids });
};

/**
 * 캐디 연락처 정보 업데이트
 */
export const updateCaddieContact = async (
  id: string,
  contactData: {
    name?: string;
    phone?: string;
    email?: string;
  }
): Promise<CaddieDetailResponse> => {
  return updateCaddie(id, contactData);
};

/**
 * 캐디 주소 정보 수정
 * PATCH /api/v1/caddies/{id}/address/
 */
export const updateCaddieAddress = async (
  id: string,
  data: {
    address?: string;
    detailed_address?: string;
  }
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/address/`;
  return apiClient.patch(url, data);
};
