// ⚠️ DEPRECATED: 이 파일은 하위 호환성을 위해 유지됩니다.
// 새로운 코드에서는 다음을 사용하세요:
// import { ... } from "@/modules/golf-course/types";

// 새로운 모듈 구조로 re-export
export type {
  // API 타입들
  BulkDeleteRequest,
  GolfCourseApiResponse,
  GolfCourseDetail,
  GolfCourseDetailResponse,
  GolfCourseFilters,
  GolfCourseGroupDetailResponse,
  GolfCourseListData,
  GolfCourseListResponse,
  GolfCourseSimple,
  GolfCourseSimpleResponse,

  // UI 타입들
  EditableGolfCourse,
  GolfCourse,
  GolfCourseFormErrors,
  GolfCourseOption,
  GolfCourseFilterState,
  GolfCourseSortOption,
  GolfCourseViewMode,
  GolfCourseAction,
  GolfCourseStatus,

  // 도메인 타입들
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
} from "./index";
