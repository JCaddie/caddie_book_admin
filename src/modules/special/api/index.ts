/**
 * Special Module API Exports
 * 특수반 모듈의 모든 API 함수들을 중앙화하여 export
 */

// API 클래스 및 인스턴스
export { specialGroupAPI } from "./special-api";

// 개별 API 함수들
export {
  createSpecialGroup,
  updateSpecialGroup,
  deleteSpecialGroup,
  getSpecialGroups,
  getSpecialScheduleDetail,
  fetchSpecialGroupsStatus,
  assignSpecialGroupToSlot,
  removeSpecialGroupFromSlot, // @deprecated - removeSlotAssignment 사용 권장
} from "./special-api";

// 타입 정의
export type {
  SpecialGroupResponse,
  SpecialScheduleDetailResponse,
  SpecialGroupsStatusResponse,
  AssignSpecialGroupRequest,
} from "./special-api";
