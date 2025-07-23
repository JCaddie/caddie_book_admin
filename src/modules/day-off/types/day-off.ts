// ================================
// 기본 타입 정의
// ================================

export type DayOffRequestType = "day_off" | "waiting";
export type DayOffRequestTypeDisplay = "휴무" | "대기";

export type DayOffStatus = "reviewing" | "approved" | "rejected";
export type DayOffStatusDisplay = "검토 중" | "승인" | "반려";

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
  approved_by: string | null;
  approved_by_name: string | null;
  date: string;
  created_at: string;
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
// 폼 관련 타입
// ================================

export interface DayOffRequestFormData {
  caddieId: string;
  caddieName: string;
  requestType: DayOffRequestType;
  reason: string;
  phone: string;
}

export interface DayOffRequestUpdateData {
  status: DayOffStatus;
  approver?: string;
  approvalDate?: string;
  updatedAt: string;
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

export interface DayOffRequestStatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// ================================
// 컴포넌트 Props 타입
// ================================

export interface DayOffActionsProps {
  request: DayOffRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

export interface DayOffManagementState {
  data: DayOffRequest[];
  filteredData: DayOffRequest[];
  filters: DayOffRequestFilter;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
