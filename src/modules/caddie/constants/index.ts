// ================================
// 캐디 상수 통합 Export (중복 방지)
// ================================

// 메인 캐디 상수들
export {
  CADDIE_CONSTANTS,
  CADDIE_EDIT_CONSTANTS,
  DEFAULT_GOLF_COURSE_OPTIONS,
  DEFAULT_GROUP_OPTIONS,
  DEFAULT_SPECIAL_TEAM_OPTIONS,
  EMPLOYMENT_TYPE_CHOICES,
  GENDER_CHOICES,
  TEAM_LEADER_CHOICES,
} from "./caddie";

// 캐디 상수에서 REGISTRATION_STATUS_CHOICES를 가져옴 (중복 방지)
export { REGISTRATION_STATUS_CHOICES } from "./caddie";

// 신규 캐디 상수들 (실제 존재하는 것들만)
export {
  MOCK_NEW_CADDIE_APPLICATIONS,
  NEW_CADDIE_CONSTANTS,
  REGISTRATION_STATUS,
} from "./new-caddie";
