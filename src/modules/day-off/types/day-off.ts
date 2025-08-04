// ================================
// 기본 타입 정의
// ================================

export type DayOffRequestType = "day_off" | "waiting";
export type DayOffRequestTypeDisplay = "휴무" | "대기";

export type DayOffStatus =
  | "SICK_LEAVE_REQUEST"
  | "APPROVED"
  | "REJECTED"
  | "reviewing"
  | "approved"
  | "rejected";
export type DayOffStatusDisplay =
  | "병가 신청"
  | "승인"
  | "반려"
  | "검토 중"
  | "승인"
  | "반려";

export type ProcessResult = "APPROVED" | "REJECTED" | "PENDING";
export type ProcessResultDisplay = "승인" | "반려" | "대기";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type EmploymentTypeDisplay = "정규직" | "계약직" | "파트타임";

// ================================
// 휴무 신청 관련 타입
// ================================

export interface DayOffRequest extends Record<string, unknown> {
  id: string;
  caddie: string;
  caddie_name: string;
  date: string;
  status: DayOffStatus;
  display_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  request_type: DayOffRequestType;
  request_reason: string;
  requested_at: string | null;
  processed_by: string | null;
  processed_by_name: string | null;
  processed_at: string | null;
  process_result: ProcessResult;
  process_notes: string;

  // 하위 호환성을 위한 필드들
  request_type_display?: DayOffRequestTypeDisplay;
  status_display?: DayOffStatusDisplay;
  reason?: string;
  rejection_reason?: string;
  golf_course?: number;
  golf_course_name?: string;

  // 캐디 상세 정보 (상세 조회 시에만 포함)
  caddie_employment_type?: EmploymentType;
  caddie_employment_type_display?: EmploymentTypeDisplay;
  caddie_is_team_leader?: boolean;
  caddie_primary_group?: string;
  caddie_special_group?: string | null;
  caddie_phone?: string;
  caddie_email?: string;
  caddie_address?: string;

  isEmpty?: boolean; // BaseTable 자동 패딩을 위한 속성
}

// ================================
// 필터 및 검색 관련 타입
// ================================

export interface DayOffRequestFilter {
  request_type?: DayOffRequestType | "";
  status?: DayOffStatus | "";
  searchTerm?: string;
}

export interface DayOffSearchParams {
  page?: number;
  page_size?: number;
  request_type?: DayOffRequestType;
  status?: DayOffStatus;
  search?: string;
}

// ================================
// API 응답 타입
// ================================

export interface DayOffRequestListResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: DayOffRequest[];
  };
}

export interface DayOffRequestDetailResponse {
  success: boolean;
  message: string;
  data: DayOffRequest;
}
