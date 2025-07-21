import { apiClient } from "@/shared/lib/api-client";
import { Caddie, CaddieDetail } from "@/shared/types/caddie";

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
