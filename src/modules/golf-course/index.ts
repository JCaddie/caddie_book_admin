// 골프장 모듈 통합 export

// 타입들
export type * from "./types";

// API 함수들
export * from "./api";

// 컴포넌트들
export * from "./components";

// Hooks는 별도 경로에서 import
// export * from "./hooks";

// Utils (중복 함수 제외)
export {
  // Validators
  getFieldError,
  hasValidationErrors,
  isValidBusinessNumber,
  isValidEmail,
  isValidPhoneNumber,
  validateAddress,
  validateContact,
  validateEmail,
  validateGolfCourseForm,
  validateGolfCourseName,
  validateName,
  validatePhone,
  validateRegion,

  // Formatters
  createSlug,
  formatFileSize,
  formatGolfCourseSummary,
  formatNumberWithUnit,
  formatOperationStat,
  formatPhoneNumber,
  formatRelativeTime,
  getActiveStatusColor,
  getContractStatusColor,
  getMembershipTypeIcon,
  maskEmail,
  maskPhoneNumber,
  summarizeAddress,

  // Transformers (API와 중복되지 않는 것들만)
  calculateGolfCourseStats,
  cloneGolfCourseData,
  createEmptyGolfCourseData,
  createGolfCourseSummary,
  deduplicateGolfCourses,
  domainToDisplayModel,
  filterStateToUrlParams,
  groupGolfCoursesByContractStatus,
  groupGolfCoursesByRegion,
  highlightSearchTerms,
  isValidGolfCourseData,
  mergeGolfCourseData,
  sortGolfCourses,
  urlParamsToFilterState,
} from "./utils";
