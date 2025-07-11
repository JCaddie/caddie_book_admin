import { VacationRequest, VacationRequestType, VacationStatus } from "../types";

// ================================
// 샘플 데이터 생성 유틸리티
// ================================

const SAMPLE_NAMES = [
  "김민수",
  "이영희",
  "박철수",
  "정수지",
  "최민정",
  "강호동",
  "윤서연",
  "장진영",
  "문성민",
  "한지원",
  "오준호",
  "신혜영",
  "조민규",
  "임나라",
  "백승호",
  "서지은",
  "홍길동",
  "김철수",
  "박영희",
  "이순신",
  "강감찬",
  "을지문덕",
  "신사임당",
  "세종대왕",
];

const SAMPLE_REASONS = [
  "개인 사정으로 인한 휴무 신청",
  "가족 행사 참석을 위한 휴무",
  "건강상 문제로 휴무 필요",
  "병원 진료 예약으로 인한 휴무",
  "자녀 학교 행사 참석",
  "부모님 병원 동행",
  "결혼식 참석을 위한 휴무",
  "장례식 참석으로 인한 휴무",
  "이사 작업을 위한 휴무",
  "정기 건강검진 예약",
  "급한 개인 업무 처리",
  "컨디션 난조로 인한 휴무",
  "교육 프로그램 참석",
  "법정 의무 이행",
  "기타 개인 사정",
];

const SAMPLE_APPROVERS = [
  "관리자",
  "김팀장",
  "이과장",
  "박부장",
  "정차장",
  "최실장",
];

// 랜덤 날짜 생성 (최근 30일 내)
const getRandomDate = (daysAgo: number = 30): string => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  return date.toISOString().split("T")[0].replace(/-/g, ".");
};

// 랜덤 전화번호 생성
const getRandomPhone = (): string => {
  const middle = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const last = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `010-${middle}-${last}`;
};

// 랜덤 요소 선택
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// ================================
// 샘플 데이터 생성
// ================================

const generateMockVacationRequest = (id: number): VacationRequest => {
  const requestType = getRandomElement<VacationRequestType>(["휴무", "대기"]);
  const status = getRandomElement<VacationStatus>(["검토 중", "승인", "반려"]);
  const caddieName = getRandomElement(SAMPLE_NAMES);
  const reason = getRandomElement(SAMPLE_REASONS);

  const requestDate = getRandomDate(30);
  const createdAt = new Date(requestDate.replace(/\./g, "-")).toISOString();

  let approver: string | undefined;
  let approvalDate: string | undefined;
  let updatedAt = createdAt;

  // 승인/반려된 경우 승인자와 승인일 설정
  if (status === "승인" || status === "반려") {
    approver = getRandomElement(SAMPLE_APPROVERS);
    const requestDateTime = new Date(createdAt);
    const approvalDateTime = new Date(
      requestDateTime.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000
    ); // 최대 3일 후
    approvalDate = approvalDateTime
      .toISOString()
      .split("T")[0]
      .replace(/-/g, ".");
    updatedAt = approvalDateTime.toISOString();
  }

  return {
    id: `vacation-${id}`,
    caddieId: `caddie-${id}`,
    caddieName,
    requestType,
    reason,
    phone: getRandomPhone(),
    status,
    approver,
    requestDate,
    approvalDate,
    createdAt,
    updatedAt,
  };
};

// 더 많은 샘플 데이터 생성 (25개)
const generateMockVacationData = (count: number = 25): VacationRequest[] => {
  return Array.from({ length: count }, (_, index) =>
    generateMockVacationRequest(index + 1)
  );
};

// ================================
// Export 함수들
// ================================

export const mockVacationData: VacationRequest[] = generateMockVacationData();

export const getVacationRequests = (): VacationRequest[] => {
  // 실제 환경에서는 API 호출
  return [...mockVacationData];
};

export const getVacationRequestCount = (): number => {
  return mockVacationData.length;
};

export const getVacationRequestById = (
  id: string
): VacationRequest | undefined => {
  return mockVacationData.find((request) => request.id === id);
};

export const getVacationRequestsByStatus = (
  status: VacationStatus
): VacationRequest[] => {
  return mockVacationData.filter((request) => request.status === status);
};

export const getVacationRequestsByType = (
  type: VacationRequestType
): VacationRequest[] => {
  return mockVacationData.filter((request) => request.requestType === type);
};

// 통계 데이터 생성
export const getVacationRequestStats = () => {
  const total = mockVacationData.length;
  const pending = mockVacationData.filter((r) => r.status === "검토 중").length;
  const approved = mockVacationData.filter((r) => r.status === "승인").length;
  const rejected = mockVacationData.filter((r) => r.status === "반려").length;

  return {
    total,
    pending,
    approved,
    rejected,
    pendingRate: total > 0 ? Math.round((pending / total) * 100) : 0,
    approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
  };
};
