import { apiClient } from "@/shared/lib/api-client";
import type { CaddieListParams, CaddieListResponse } from "../types";

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
