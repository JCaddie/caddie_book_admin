// ================================
// 기본 타입 정의
// ================================

export type VacationRequestType = "휴무" | "대기";

export type VacationStatus = "검토 중" | "승인" | "반려";

// ================================
// 휴무 신청 관련 타입
// ================================

export interface VacationRequest extends Record<string, unknown> {
  id: string;
  caddieId: string;
  caddieName: string;
  requestType: VacationRequestType;
  reason: string;
  phone: string;
  status: VacationStatus;
  approver?: string;
  requestDate: string;
  approvalDate?: string;
  golfCourse: string; // 소속 골프장 정보 추가
  createdAt: string;
  updatedAt: string;
  isEmpty?: boolean; // BaseTable 자동 패딩을 위한 속성
}

// ================================
// 필터 및 검색 관련 타입
// ================================

export interface VacationRequestFilter {
  requestType?: VacationRequestType | "";
  status?: VacationStatus | "";
  searchTerm?: string;
}

export interface VacationSearchParams {
  page?: number;
  limit?: number;
  requestType?: VacationRequestType;
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
  data: VacationRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
