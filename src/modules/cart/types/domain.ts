// ===================== 도메인 모델 타입들 =====================

// 카트 상태
export type CartStatus = "사용중" | "대기" | "점검중" | "고장" | "사용불가";

// 카트 타입 정의
export interface Cart extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  status: CartStatus;
  fieldName: string;
  golfCourseName: string;
  managerName: string;
  createdAt: string;
  updatedAt: string;
  isEmpty?: boolean; // 빈 행 여부
}

// 카트 상세 정보
export interface CartDetail {
  id: string;
  name: string;
  status: CartStatus;
  fieldName: string;
  managerName: string;
  golfCourseName: string;
  golfCourseId?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  batteryLevel?: number;
  batteryStatus?: string;
}

// 카트 이력 아이템
export interface CartHistoryItem extends Record<string, unknown> {
  id: string;
  no: number;
  date: string; // YYYY.MM.DD.(요일) 형식
  time: string; // HH:MM 형식
  cartName: string;
  group: string;
  personInCharge: string;
  fieldName: string;
  managerName: string;
}
