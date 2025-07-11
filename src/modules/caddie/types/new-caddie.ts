// ================================
// 신규 캐디 도메인 타입
// ================================

// 신규 캐디 신청 상태
export type NewCaddieStatus = "pending" | "approved" | "rejected";

// 신규 캐디 신청 데이터 타입
export interface NewCaddieApplication extends Record<string, unknown> {
  id: string;
  name: string;
  phone: string;
  email: string;
  requestDate: string;
  status: NewCaddieStatus;
  isEmpty?: boolean;
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
  handleBulkReject: () => void;
  handleIndividualApprove: () => void;
  handleIndividualReject: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClear: () => void;
  handleSelectChange: (keys: string[]) => void;
  handleRowClick: (record: NewCaddieApplication) => void;
}
