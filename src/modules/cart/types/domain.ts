// ===================== 도메인 모델 타입들 =====================

// 카트 상태 (API status_display 값 사용)
export type CartStatus = string; // "사용 가능", "사용 중", "점검 중" 등

// 카트 타입 정의
export interface Cart {
  id: string;
  no: number;
  name: string;
  status: CartStatus;
  location: string; // location으로 통일 (fieldName 대신)
  golfCourseName: string;
  managerName: string; // current_caddie.name 또는 "미배정"
  batteryLevel: number;
  batteryStatus: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  isEmpty?: boolean; // 빈 행 여부
  [key: string]: unknown; // 인덱스 시그니처 추가 (DataTable 호환성)
}

// 카트 상세 정보
export interface CartDetail {
  id: string;
  name: string;
  status: CartStatus;
  location: string; // API의 location 필드
  managerName: string;
  golfCourseName: string;
  golfCourseId: string;
  managerId?: string;
  batteryLevel: number;
  batteryStatus: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// 카트 이력 아이템
export interface CartHistoryItem {
  id: string;
  no: number;
  caddieName: string;
  caddieRole: string;
  usageDate: string; // YYYY-MM-DD 형식
  startTime: string; // HH:MM:SS 형식
  endTime: string; // HH:MM:SS 형식
  duration: number; // 분 단위
  isOngoing: boolean;
  notes: string;
  createdAt: string;
  [key: string]: unknown; // 인덱스 시그니처 추가 (DataTable 호환성)
}
