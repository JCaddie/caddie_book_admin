// ================================
// 캐디 데이터 변환 함수
// ================================

import type { GolfCourse } from "@/shared/types/domain";
import type {
  CaddieApiResponse,
  CaddieDetailResponse,
  CaddieListData,
  CaddieListResponse,
} from "../types/api";
import type { Caddie } from "../types/ui";

// API 응답 → UI 모델 변환
export const transformCaddieApiToUi = (apiData: CaddieApiResponse): Caddie => {
  return {
    ...apiData,
    // 호환성을 위한 computed 필드들
    name: apiData.user_name,
    phone: apiData.user_phone,
    golf_course: {
      id: "", // API에서 제공하지 않음
      name: apiData.golf_course_name,
      region: "", // API에서 제공하지 않음
    } as GolfCourse,
  };
};

// 캐디 상세 API 응답 → UI 모델 변환
export const transformCaddieDetailApiToUi = (
  detailResponse: CaddieDetailResponse
): Caddie => {
  const apiData = detailResponse.data;

  return {
    ...apiData,
    id: String(apiData.id), // number → string 변환
    // 호환성을 위한 computed 필드들
    name: apiData.user_name,
    phone: apiData.user_phone,
    email: apiData.user_email,
    golf_course: {
      id: "", // API에서 제공하지 않음
      name: apiData.golf_course_name,
      region: "", // API에서 제공하지 않음
    } as GolfCourse,
  };
};

// 캐디 목록 API 응답 → UI 모델 변환
export const transformCaddieListResponse = (
  response: CaddieListResponse
): {
  data: CaddieListData;
  transformedResults: Caddie[];
} => {
  const transformedResults = response.data.results.map(transformCaddieApiToUi);

  return {
    data: response.data,
    transformedResults,
  };
};

// UI 필터 → API 파라미터 변환
export const transformFiltersToApiParams = (filters: {
  searchTerm?: string;
  selectedGroup?: string;
  selectedSpecialTeam?: string;
  selectedGolfCourseId?: string;
}) => ({
  search: filters.searchTerm || undefined,
  group: filters.selectedGroup || undefined,
  special_team: filters.selectedSpecialTeam || undefined,
  golf_course: filters.selectedGolfCourseId || undefined,
});

// 캐디 업데이트 UI → API 페이로드 변환
export const transformCaddieUpdateToApi = (updates: {
  name?: string;
  gender?: string;
  employment_type?: string;
  phone?: string;
  email?: string;
  address?: string;
  golf_course_id?: string;
  work_score?: number;
  is_team_leader?: boolean;
  primary_group_id?: string;
  special_group_ids?: string[];
}) => {
  // API에서 요구하는 형식으로 변환
  return {
    ...updates,
    // 필요한 경우 추가 변환 로직
  };
};

// 고용 형태 한글 변환
export const transformEmploymentTypeToDisplay = (type: string): string => {
  const displayMap: Record<string, string> = {
    FULL_TIME: "정규직",
    PART_TIME: "시간제",
    CONTRACT: "계약직",
    TEMPORARY: "임시직",
  };
  return displayMap[type] || type;
};

// 등록 상태 한글 변환
export const transformRegistrationStatusToDisplay = (
  status: string
): string => {
  const displayMap: Record<string, string> = {
    PENDING: "승인 대기",
    APPROVED: "승인됨",
    REJECTED: "거부됨",
  };
  return displayMap[status] || status;
};

// 성별 한글 변환
export const transformGenderToDisplay = (gender: string): string => {
  return gender === "M" ? "남" : "여";
};

// 팀장 여부 한글 변환
export const transformTeamLeaderToDisplay = (isTeamLeader: boolean): string => {
  return isTeamLeader ? "팀장" : "일반";
};

// 근무 상태 한글 변환
export const transformDutyStatusToDisplay = (isOnDuty: boolean): string => {
  return isOnDuty ? "근무 중" : "휴무";
};

// 그룹 정보 표시용 변환
export const transformGroupInfoToDisplay = (
  primaryGroup: number | null,
  primaryGroupOrder: number,
  specialGroup: number | null
): {
  primaryGroupDisplay: string;
  specialGroupDisplay: string;
} => {
  const primaryGroupDisplay = primaryGroup
    ? `${primaryGroup}조 (순서: ${primaryGroupOrder})`
    : "미배정";

  const specialGroupDisplay = specialGroup ? `특수반 ${specialGroup}` : "없음";

  return {
    primaryGroupDisplay,
    specialGroupDisplay,
  };
};

// 캐디 정보 요약 생성
export const createCaddieSummary = (caddie: Caddie) => ({
  id: caddie.id,
  name: caddie.user_name,
  golfCourse: caddie.golf_course_name,
  employmentType: transformEmploymentTypeToDisplay(caddie.employment_type),
  workScore: caddie.work_score,
  isOnDuty: transformDutyStatusToDisplay(caddie.is_on_duty),
  registrationStatus: transformRegistrationStatusToDisplay(
    caddie.registration_status
  ),
});

// 에러 응답 변환
export const transformApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  // API 에러 응답 형태 처리
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "알 수 없는 오류가 발생했습니다.";
};
