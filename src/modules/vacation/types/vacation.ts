// ================================
// 기본 타입 정의
// ================================

export type VacationRequestType = "day_off" | "waiting";
export type VacationRequestTypeDisplay = "휴무" | "대기";

export type VacationStatus = "reviewing" | "approved" | "rejected";
export type VacationStatusDisplay = "검토 중" | "승인" | "반려";

// ================================
// 휴무 신청 관련 타입
// ================================

export interface VacationRequest extends Record<string, unknown> {
  id: string;
  request_type: VacationRequestType;
  request_type_display: VacationRequestTypeDisplay;
  caddie: string;
  caddie_name: string;
  reason: string;
  golf_course: number;
  golf_course_name: string;
  status: VacationStatus;
  status_display: VacationStatusDisplay;
  approved_by: string | null;
  approved_by_name: string | null;
  date: string;
  created_at: string;
  isEmpty?: boolean; // BaseTable 자동 패딩을 위한 속성
}

// ================================
// 필터 및 검색 관련 타입
// ================================

export interface VacationRequestFilter {
  request_type?: VacationRequestType | "";
  status?: VacationStatus | "";
  searchTerm?: string;
}

export interface VacationSearchParams {
  page?: number;
  page_size?: number;
  request_type?: VacationRequestType;
  status?: VacationStatus;
  search?: string;
}

// ================================
// 폼 관련 타입
// ================================

export interface VacationRequestFormData {
  caddieId: string;
  caddieName: string;
  requestType: VacationRequestType;
  reason: string;
  phone: string;
}

export interface VacationRequestUpdateData {
  status: VacationStatus;
  approver?: string;
  approvalDate?: string;
  updatedAt: string;
}

// ================================
// API 응답 타입
// ================================

export interface VacationRequestListResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: VacationRequest[];
}

export interface VacationRequestStatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// ================================
// 컴포넌트 Props 타입
// ================================

export interface VacationActionsProps {
  request: VacationRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

export interface VacationManagementState {
  data: VacationRequest[];
  filteredData: VacationRequest[];
  filters: VacationRequestFilter;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
