// ================================
// 캐디 API 통합 Export
// ================================

// 엔드포인트 상수 및 빌더
export {
  CADDIE_ENDPOINTS,
  buildCaddieDetailUrl,
  buildCaddieGroupQuery,
  buildCaddieGroupsUrl,
  buildCaddieListQuery,
  buildCaddieListUrl,
  buildFilterParams,
  buildPaginationParams,
} from "./endpoints";

// 데이터 변환 함수들
export {
  createCaddieSummary,
  transformApiError,
  transformCaddieApiToUi,
  transformCaddieDetailApiToUi,
  transformCaddieListResponse,
  transformCaddieUpdateToApi,
  transformDutyStatusToDisplay,
  transformEmploymentTypeToDisplay,
  transformFiltersToApiParams,
  transformGenderToDisplay,
  transformGroupInfoToDisplay,
  transformRegistrationStatusToDisplay,
  transformTeamLeaderToDisplay,
} from "./transforms";

// API 요청 함수들
export {
  bulkDeleteCaddies,
  createCaddie,
  deleteCaddie,
  fetchCaddieDetail,
  fetchCaddieGroups,
  fetchCaddieList,
  updateCaddie,
  updateCaddieAddress,
  updateCaddieContact,
  updateCaddieEmploymentType,
  updateCaddiePrimaryGroup,
  updateCaddieSpecialGroups,
  updateCaddieTeamLeader,
  updateCaddieWorkScore,
} from "./requests";

// 신규 캐디 관련 API (별도 파일에서 관리)
export {
  getNewCaddieList,
  bulkApproveNewCaddies,
  bulkRejectNewCaddies,
  type NewCaddieListParams,
  type BulkApproveRequest,
  type BulkRejectRequest,
  type ApiResponse,
} from "./new-caddie-api";

// 하위 호환성을 위한 re-export (기존 import를 깨뜨리지 않기 위해)
export {
  fetchCaddieDetail as getCaddieDetail,
  fetchCaddieGroups as getCaddieGroups,
  fetchCaddieList as getCaddieList,
} from "./requests";

// 기존 파일들도 re-export (단계적 마이그레이션)
export * from "./caddie-detail-api";
export * from "./caddie-list-api";
export * from "./new-caddie-api";
