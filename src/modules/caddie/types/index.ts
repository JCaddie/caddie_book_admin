// ================================
// 캐디 타입 통합 Export
// ================================

// API 타입들
export type {
  CaddieApiResponse,
  CaddieDetail,
  CaddieDetailResponse,
  CaddieGroupApiResponse,
  CaddieGroupListResponse,
  CaddieListData,
  CaddieListParams,
  CaddieListResponse,
  CreateCaddieRequest,
  DeleteCaddieRequest,
  BulkDeleteCaddiesRequest,
  UpdateCaddieRequest,
} from "./api";

// 도메인 타입들
export type {
  AssignedWork,
  CaddieCareer,
  CaddieDomain,
  CaddieGroup,
  CaddieGroupInfo,
  CaddieStats,
  CaddieStatus,
  ContactInfo,
  EmploymentType,
  Gender,
  GroupType,
  RegistrationStatus,
  RoleDisplay,
  SpecialGroup,
} from "./domain";

// UI 타입들
export type {
  Caddie,
  CaddieAction,
  CaddieDetailViewState,
  CaddieFilters,
  CaddieFormErrors,
  CaddieFormState,
  CaddieListViewState,
  CaddiePermissionChecker,
  CaddieSelection,
  CaddieTableColumn,
  EditableCaddie,
  SelectOption,
} from "./ui";

// 하위 호환성을 위한 기본 export (기존 import를 깨뜨리지 않기 위해)
export type { Caddie as CaddieListItem } from "./ui";

export type { CaddieDetail as CaddieDetailInfo } from "./api";

// 신규 캐디 타입들
export * from "./new-caddie";
