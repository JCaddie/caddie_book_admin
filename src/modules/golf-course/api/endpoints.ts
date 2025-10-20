// 골프장 관련 API 엔드포인트 상수 정의

const BASE_URL = "/v1/golf-courses";

export const GOLF_COURSE_ENDPOINTS = {
  // 기본 CRUD
  LIST: `${BASE_URL}/`,
  DETAIL: (id: string) => `${BASE_URL}/${id}/`,
  CREATE: `${BASE_URL}/`,
  UPDATE: (id: string) => `${BASE_URL}/${id}/`,
  DELETE: (id: string) => `${BASE_URL}/${id}/`,

  // 대량 작업
  BULK_DELETE: `${BASE_URL}/bulk-delete/`,

  // 간소 목록 (드롭다운용)
  SIMPLE_LIST: `${BASE_URL}/simple/`,

  // 그룹 관련
  GROUP_DETAIL: (id: string) => `${BASE_URL}/${id}/groups/`,
  GROUPS_LIST: `${BASE_URL}/groups/`,

  // 통계 및 분석
  STATS: `${BASE_URL}/stats/`,
  ANALYTICS: `${BASE_URL}/analytics/`,

  // 검색 및 필터
  SEARCH: `${BASE_URL}/search/`,
  FILTER: `${BASE_URL}/filter/`,
} as const;

// 쿼리 파라미터 빌더
export const buildQueryParams = (
  params: Record<string, string | number | boolean | undefined>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

// URL 빌더 헬퍼
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }

  const queryString = buildQueryParams(params);
  return `${endpoint}${queryString ? `?${queryString}` : ""}`;
};
