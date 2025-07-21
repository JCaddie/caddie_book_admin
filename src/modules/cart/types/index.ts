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

// ===================== API 응답 타입들 =====================

// API 카트 상태 타입
export type ApiCartStatus = "available" | "in_use" | "maintenance";

// API 골프장 정보
export interface ApiGolfCourse {
  id: string;
  name: string;
}

// API 담당 캐디 정보
export interface ApiAssignedCaddie {
  id: string;
  name: string;
  phone: string;
}

// API 카트 응답 데이터
export interface ApiCartData {
  id: string;
  name: string;
  status: ApiCartStatus;
  status_display: string;
  battery_level: number; // 0, 20, 40, 60, 80, 100
  battery_status: string;
  golf_course: ApiGolfCourse;
  assigned_caddie: ApiAssignedCaddie | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

// API 카트 목록 응답
export interface ApiCartListResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ApiCartData[];
}

// API 카트 생성 요청
export interface ApiCreateCartRequest {
  name: string;
  golf_course_id: string;
  assigned_caddie_id?: string;
}

// API 카트 수정 요청
export interface ApiUpdateCartRequest {
  name?: string;
  status?: ApiCartStatus;
  golf_course_id?: string;
  assigned_caddie_id?: string;
  battery_level?: number;
}
