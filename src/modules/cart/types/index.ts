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

// 카트 상태
export type CartStatus = "사용중" | "대기" | "점검중" | "고장" | "사용불가";

// 카트 필터
export interface CartFilters {
  searchTerm: string;
  status?: CartStatus;
  golfCourseId?: string;
  fieldId?: string;
}

// 카트 선택 상태
export interface CartSelection {
  selectedRowKeys: string[];
  selectedRows: Cart[];
}

// 새 카트 생성 데이터
export interface CreateCartData {
  name: string;
  golfCourseId: string;
  fieldId: string;
  managerName: string;
}

// 카트 수정 데이터
export interface UpdateCartData extends Partial<CreateCartData> {
  status?: CartStatus;
}

// 카트 상세 정보
export interface CartDetail {
  id: string;
  name: string;
  status: CartStatus;
  fieldName: string;
  managerName: string;
  golfCourseName: string;
  createdAt: string;
  updatedAt: string;
}

// 카트 사용 이력 아이템
export interface CartHistoryItem extends Record<string, unknown> {
  id: string;
  no: number;
  date: string;
  time: string;
  cartName: string;
  group: string;
  personInCharge: string;
  fieldName: string;
  managerName: string;
  isEmpty?: boolean;
}
