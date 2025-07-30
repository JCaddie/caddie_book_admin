// 골프장 모듈 타입 통합 export

// API 관련 타입
export type {
  GolfCourseApiResponse,
  GolfCourseListData,
  GolfCourseListResponse,
  GolfCourseDetail,
  GolfCourseDetailResponse,
  GolfCourseSimple,
  GolfCourseSimpleResponse,
  GolfCourseGroupDetailResponse,
  GolfCourseGroup,
  GolfCourseGroupsListResponse,
  GolfCourseFilters,
  BulkDeleteRequest,
} from "./api";

// UI 관련 타입
export type {
  GolfCourse,
  EditableGolfCourse,
  GolfCourseFormErrors,
  GolfCourseOption,
  GolfCourseFilterState,
  GolfCourseSortOption,
  GolfCourseViewMode,
  GolfCourseAction,
  GolfCourseStatus,
} from "./ui";

// 도메인 관련 타입
export type {
  ContactInfo,
  GolfCourseBasicInfo,
  GolfCourseContractInfo,
  GolfCourseOperationStats,
  GolfCourseDomain,
  GolfCourseGroup,
  GolfCourseGroupStatus,
  GolfCourseOperationSummary,
  GolfCourseSearchCriteria,
  GolfCourseSortCriteria,
  GolfCoursePagination,
} from "./domain";

// 하위 호환성을 위한 기존 export들 (점진적 마이그레이션용)
export type {
  GolfCourseDetail as GolfCourseDetailLegacy,
  GolfCourseApiResponse as GolfCourseApiResponseLegacy,
  GolfCourseFilters as GolfCourseFiltersLegacy,
} from "./api";

export type { EditableGolfCourse as EditableGolfCourseLegacy } from "./ui";

// 자주 사용되는 타입들의 별칭
export type GolfCourseId = string;
export type GolfCourseName = string;
