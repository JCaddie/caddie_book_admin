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
