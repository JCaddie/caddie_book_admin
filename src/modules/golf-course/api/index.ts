// 골프장 API 통합 export

// Endpoints
export { GOLF_COURSE_ENDPOINTS, buildQueryParams, buildUrl } from "./endpoints";

// Transforms
export {
  formatDateToLocal,
  formatNumberToLocal,
  transformApiResponseToTableItem,
  transformDetailApiToDomain,
  transformDetailToEditable,
  transformEditableToApiRequest,
  transformFiltersToParams,
} from "./transforms";

// Requests
export {
  bulkDeleteGolfCourses,
  createGolfCourse,
  deleteGolfCourse,
  fetchGolfCourseDetail,
  fetchGolfCourseGroupDetail,
  fetchGolfCourses,
  fetchGolfCoursesSimple,
  filterGolfCourses,
  searchGolfCourses,
  updateGolfCourse,
} from "./requests";

// 하위 호환성을 위한 기존 export (점진적 마이그레이션용)
export {
  fetchGolfCourses as fetchGolfCourseList,
  fetchGolfCourseDetail as getGolfCourseDetail,
  createGolfCourse as createNewGolfCourse,
  updateGolfCourse as patchGolfCourse,
  deleteGolfCourse as removeGolfCourse,
} from "./requests";
