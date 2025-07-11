import { VacationRequest } from "../types";

export const mockVacationData: VacationRequest[] = [
  {
    id: "1",
    caddieId: "caddie1",
    caddieName: "홍길동",
    requestType: "휴무",
    reason:
      "휴무 신청합니다. 휴무 신청합니다. 휴무 신청합니다. 휴무 신청합니다. 휴무 신청합니다. 휴무 신청합니다.",
    phone: "010-1234-5678",
    status: "검토 중",
    requestDate: "2025.05.06",
    createdAt: "2025-05-06T10:00:00Z",
    updatedAt: "2025-05-06T10:00:00Z",
  },
  {
    id: "2",
    caddieId: "caddie2",
    caddieName: "김철수",
    requestType: "대기",
    reason:
      "대기 신청합니다. 대기 신청합니다. 대기 신청합니다. 대기 신청합니다. 대기 신청합니다. 대기 신청합니다.",
    phone: "010-2345-6789",
    status: "승인",
    approver: "강감찬",
    requestDate: "2025.05.05",
    approvalDate: "2025.05.06",
    createdAt: "2025-05-05T09:00:00Z",
    updatedAt: "2025-05-06T11:00:00Z",
  },
  {
    id: "3",
    caddieId: "caddie3",
    caddieName: "박영희",
    requestType: "휴무",
    reason: "개인사정으로 휴무 신청합니다.",
    phone: "010-3456-7890",
    status: "반려",
    approver: "을지문덕",
    requestDate: "2025.05.04",
    approvalDate: "2025.05.05",
    createdAt: "2025-05-04T14:00:00Z",
    updatedAt: "2025-05-05T16:00:00Z",
  },
];

export const getVacationRequests = () => mockVacationData;
export const getVacationRequestCount = () => mockVacationData.length;
