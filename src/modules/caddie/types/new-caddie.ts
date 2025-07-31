import { REGISTRATION_STATUS } from "../constants/new-caddie";

// ================================
// 신규 캐디 도메인 타입
// ================================

// 등록 상태 타입
export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];

// 신규 캐디 신청 상태 (기존 호환성)
export type NewCaddieStatus = "pending" | "approved" | "rejected";

// 신규 캐디 신청 데이터 타입 (API 응답 기준)
export interface NewCaddieApplication extends Record<string, unknown> {
  id: string;
  name: string;
  phone: string;
  email: string;
  golf_course: {
    id: string;
    name: string;
    region: string;
  };
  registration_status: RegistrationStatus;
  created_at: string;
  // UI에서 변환되는 필드들 (API 응답에는 없음)
  registration_status_display?: string;
  status?: NewCaddieStatus;
  requestDate?: string;
}

// ================================
// API 관련 타입
// ================================

// 신규 캐디 목록 API 응답
export interface NewCaddieListResponse {
  success: boolean;
  message?: string;
  data: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: NewCaddieApplication[];
  };
}

// API 응답 기본 형태
export interface NewCaddieApiResponse {
  success: boolean;
  message?: string;
}

// ================================
// UI 관련 타입
// ================================

// 모달 타입
export type ModalType = "all" | "selected";

// ================================
// 상태 관리 타입
// ================================

// 신규 캐디 상태 관리 타입
export interface NewCaddieState {
  searchTerm: string;
  selectedRowKeys: string[];
  applications: NewCaddieApplication[];
  isApprovalModalOpen: boolean;
  isRejectModalOpen: boolean;
  modalType: ModalType;
  isIndividualApprovalModalOpen: boolean;
  isIndividualRejectModalOpen: boolean;
  selectedCaddieId: string;
  selectedCaddieName: string;
  isLoading: boolean;
  error: string | null;
}

// 신규 캐디 액션 타입
export interface NewCaddieActions {
  setSearchTerm: (term: string) => void;
  setSelectedRowKeys: (keys: string[]) => void;
  setApplications: (
    apps:
      | NewCaddieApplication[]
      | ((prev: NewCaddieApplication[]) => NewCaddieApplication[])
  ) => void;
  openApprovalModal: (type: ModalType) => void;
  openRejectModal: (type: ModalType) => void;
  openIndividualApprovalModal: (id: string, name: string) => void;
  openIndividualRejectModal: (id: string, name: string) => void;
  handleBulkApprove: () => void;
  handleBulkReject: (rejectionReason: string) => void;
  handleIndividualApprove: () => void;
  handleIndividualReject: (rejectionReason: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClear: () => void;
  handleSelectChange: (keys: string[]) => void;
  handleRowClick: (record: NewCaddieApplication) => void;
}
