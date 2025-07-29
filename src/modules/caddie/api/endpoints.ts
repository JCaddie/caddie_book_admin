// ================================
// 캐디 API 엔드포인트 정의
// ================================

import type { CaddieListParams } from "../types";

// 기본 API 경로
const BASE_API_PATH = "/api/v1";

// 캐디 관련 엔드포인트
export const CADDIE_ENDPOINTS = {
  // 캐디 목록
  LIST: `${BASE_API_PATH}/caddies`,

  // 캐디 상세
  DETAIL: (id: string) => `${BASE_API_PATH}/caddies/${id}`,

  // 캐디 생성
  CREATE: `${BASE_API_PATH}/caddies`,

  // 캐디 수정
  UPDATE: (id: string) => `${BASE_API_PATH}/caddies/${id}`,

  // 캐디 삭제
  DELETE: (id: string) => `${BASE_API_PATH}/caddies/${id}`,

  // 캐디 벌크 삭제
  BULK_DELETE: `${BASE_API_PATH}/caddies/bulk-delete`,

  // 캐디 그룹 목록
  GROUPS: (golfCourseId: string) =>
    `${BASE_API_PATH}/golf-courses/${golfCourseId}/groups`,

  // 신규 캐디 관련
  NEW_CADDIES: {
    LIST: `${BASE_API_PATH}/new-caddies`,
    BULK_APPROVE: `${BASE_API_PATH}/new-caddies/bulk-approve`,
    BULK_REJECT: `${BASE_API_PATH}/new-caddies/bulk-reject`,
  },
} as const;

// 쿼리 파라미터 빌더
export const buildCaddieListQuery = (params: CaddieListParams): string => {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params.page_size) {
    searchParams.append("page_size", params.page_size.toString());
  }

  if (params.search) {
    searchParams.append("search", params.search);
  }

  if (params.group) {
    searchParams.append("group", params.group);
  }

  if (params.special_team) {
    searchParams.append("special_team", params.special_team);
  }

  if (params.golf_course) {
    searchParams.append("golf_course", params.golf_course);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// 캐디 그룹 쿼리 빌더
export const buildCaddieGroupQuery = (
  groupType: "PRIMARY" | "SPECIAL"
): string => {
  const searchParams = new URLSearchParams();
  searchParams.append("group_type", groupType);
  return `?${searchParams.toString()}`;
};

// URL 빌더 헬퍼 함수들
export const buildCaddieListUrl = (params: CaddieListParams = {}): string => {
  return `${CADDIE_ENDPOINTS.LIST}${buildCaddieListQuery(params)}`;
};

export const buildCaddieDetailUrl = (id: string): string => {
  return CADDIE_ENDPOINTS.DETAIL(id);
};

export const buildCaddieGroupsUrl = (
  golfCourseId: string,
  groupType: "PRIMARY" | "SPECIAL"
): string => {
  return `${CADDIE_ENDPOINTS.GROUPS(golfCourseId)}${buildCaddieGroupQuery(
    groupType
  )}`;
};

// 페이지네이션 헬퍼
export const buildPaginationParams = (page: number, pageSize: number = 20) => ({
  page,
  page_size: pageSize,
});

// 필터 파라미터 헬퍼
export const buildFilterParams = (filters: {
  search?: string;
  group?: string;
  specialTeam?: string;
  golfCourse?: string;
}) => ({
  search: filters.search || undefined,
  group: filters.group || undefined,
  special_team: filters.specialTeam || undefined,
  golf_course: filters.golfCourse || undefined,
});
