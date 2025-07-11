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
  createdAt: string;
  updatedAt: string;
}

export type VacationRequestType = "휴무" | "대기";

export type VacationStatus = "검토 중" | "승인" | "반려";

export interface VacationRequestFilter {
  requestType?: VacationRequestType;
  status?: VacationStatus;
  searchTerm?: string;
}

export interface VacationRequestFormData {
  caddieId: string;
  requestType: VacationRequestType;
  reason: string;
  phone: string;
}

export interface VacationRequestUpdateData {
  status: VacationStatus;
  approver?: string;
  approvalDate?: string;
}
