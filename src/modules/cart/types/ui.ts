import { Cart, CartStatus } from "./domain";

// ===================== UI 관련 타입들 =====================

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
