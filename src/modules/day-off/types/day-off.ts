// ================================
// 기본 타입 정의
// ================================

export type DayOffRequestType = "day_off" | "waiting";
export type DayOffRequestTypeDisplay = "휴무" | "대기";

export type DayOffStatus = "reviewing" | "approved" | "rejected";
export type DayOffStatusDisplay = "검토 중" | "승인" | "반려";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type EmploymentTypeDisplay = "정규직" | "계약직" | "파트타임";

// ================================
// 휴무 신청 관련 타입
// ================================

export interface DayOffRequest extends Record<string, unknown> {
  id: string;
  request_type: DayOffRequestType;
  request_type_display: DayOffRequestTypeDisplay;
  caddie: string;
  caddie_name: string;
  reason: string;
  golf_course: number;
  golf_course_name: string;
  status: DayOffStatus;
  status_display: DayOffStatusDisplay;
  processed_by: string | null;
  processed_by_name: string | null;
  processed_at: string | null;
  rejection_reason: string | null;
  date: string;
  created_at: string;

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
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: DayOffRequest[];
}
