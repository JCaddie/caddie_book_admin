// ================================
// 통합 캐디 API (requests, detail, list 통합)
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
 * 캐디 정보 업데이트
 * PATCH /api/v1/caddies/{id}/
 */
export const updateCaddie = async (
  id: string,
  data: UpdateCaddieRequest
): Promise<void> => {
  const url = CADDIE_ENDPOINTS.UPDATE(id);
  return apiClient.patch(url, data);
};

/**
 * 캐디 삭제
 * DELETE /api/v1/caddies/{id}/
 */
export const deleteCaddie = async (id: string): Promise<void> => {
  const url = CADDIE_ENDPOINTS.DELETE(id);
  return apiClient.delete<void>(url);
};

/**
 * 캐디 생성
 * POST /api/v1/caddies/
 */
export const createCaddie = async (
  data: CreateCaddieRequest
): Promise<CaddieDetailResponse> => {
  return apiClient.post<CaddieDetailResponse>(CADDIE_ENDPOINTS.CREATE, data);
};

/**
 * 복수 캐디 삭제
 * POST /api/v1/caddies/bulk-delete/
 */
export const bulkDeleteCaddies = async (
  data: BulkDeleteCaddiesRequest
): Promise<void> => {
  return apiClient.post(CADDIE_ENDPOINTS.BULK_DELETE, data);
};

// ================================
// 캐디 그룹 관련 API
// ================================

/**
 * 캐디 그룹 목록 조회
 * GET /api/v1/golf-courses/{golfCourseId}/groups/
 */
export const fetchCaddieGroups = async (
  golfCourseId: string,
  params: { group_type?: string } = {}
): Promise<CaddieGroupListResponse> => {
  const url = buildCaddieGroupsUrl(golfCourseId, params);
  return apiClient.get<CaddieGroupListResponse>(url);
};

// ================================
// 캐디 세부 정보 업데이트 API
// ================================

/**
 * 캐디 고용형태 업데이트
 * PATCH /api/v1/caddies/{id}/employment-type/
 */
export const updateCaddieEmploymentType = async (
  id: string,
  employment_type: string
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/employment-type/`;
  return apiClient.patch(url, { employment_type });
};

/**
 * 캐디 근무점수 업데이트
 * PATCH /api/v1/caddies/{id}/work-score/
 */
export const updateCaddieWorkScore = async (
  id: string,
  work_score: number
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/work-score/`;
  return apiClient.patch(url, { work_score });
};

/**
 * 캐디 팀장여부 업데이트
 * PATCH /api/v1/caddies/{id}/team-leader/
 */
export const updateCaddieTeamLeader = async (
  id: string,
  is_team_leader: boolean
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/team-leader/`;
  return apiClient.patch(url, { is_team_leader });
};

/**
 * 캐디 주 그룹 업데이트
 * PATCH /api/v1/caddies/{id}/primary-group/
 */
export const updateCaddiePrimaryGroup = async (
  id: string,
  primary_group: string
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/primary-group/`;
  return apiClient.patch(url, { primary_group });
};

/**
 * 캐디 특수 그룹 업데이트
 * PATCH /api/v1/caddies/{id}/special-groups/
 */
export const updateCaddieSpecialGroups = async (
  id: string,
  special_groups: string[]
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/special-groups/`;
  return apiClient.patch(url, { special_groups });
};

/**
 * 캐디 연락처 정보 업데이트
 * PATCH /api/v1/caddies/{id}/contact/
 */
export const updateCaddieContact = async (
  id: string,
  data: {
    phone?: string;
    email?: string;
  }
): Promise<void> => {
  const url = `${CADDIE_ENDPOINTS.UPDATE(id)}/contact/`;
  return apiClient.patch(url, data);
};

/**
 * 캐디 주소 정보 업데이트
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
