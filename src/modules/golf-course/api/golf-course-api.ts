// ⚠️ DEPRECATED: 이 파일은 하위 호환성을 위해 유지됩니다.
// 새로운 코드에서는 다음을 사용하세요:
// import { ... } from "@/modules/golf-course/api";

// 새로운 모듈 구조로 re-export
export {
  bulkDeleteGolfCourses,
  createGolfCourse,
  deleteGolfCourse,
  fetchGolfCourseDetail,
  fetchGolfCourseGroupDetail,
  fetchGolfCourseGroupStatus,
  fetchGolfCourses,
  fetchGolfCoursesSimple,
  updateGolfCourse,
} from "./index";

// 타입들도 함께 re-export
export type {
  BulkDeleteRequest,
  EditableGolfCourse,
  GolfCourseDetail,
  GolfCourseDetailResponse,
  GolfCourseFilters,
  GolfCourseGroupDetailResponse,
  GolfCourseGroupStatusResponse,
  GolfCourseListResponse,
  GolfCourseSimple,
  GolfCourseSimpleResponse,
} from "../types";

// API 클라이언트도 re-export
export { apiClient } from "@/shared/lib/api-client";
