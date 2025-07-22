import { apiClient } from "@/shared/lib/api-client";
import type { CaddieDetail, UpdateCaddieRequest } from "../types";

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
