// ===================== API 응답 타입들 =====================

// API 카트 상태 타입
export type ApiCartStatus = "available" | "in_use" | "maintenance";

// API 골프장 정보
export interface ApiGolfCourse {
  id: string;
  name: string;
}

// API 담당 관리자 정보
export interface ApiManager {
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
  manager: ApiManager | null;
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
  golf_course: string;
  battery_level: number;
  manager?: string;
}

// API 카트 수정 요청
export interface ApiUpdateCartRequest {
  name?: string;
  status?: ApiCartStatus;
  golf_course_id?: string;
  manager?: string;
  battery_level?: number;
}

// ===================== 카트 상세 API 응답 타입들 =====================

// API 카트 기본 정보 응답
export interface ApiCartDetailResponse {
  id: string;
  name: string;
  status: ApiCartStatus;
  status_display: string;
  battery_level: number;
  battery_status: string;
  location: string;
  golf_course: ApiGolfCourse;
  manager: ApiManager;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// API 카트 이력 아이템
export interface ApiCartHistoryItem {
  id: string;
  usage_date: string; // YYYY-MM-DD 형식
  start_time: string; // HH:MM:SS 형식
  end_time?: string; // HH:MM:SS 형식
  duration?: number; // 분 단위
  caddie?: {
    id: string;
    name: string;
  } | null;
  is_ongoing: boolean;
  notes?: string;
}

// API 카트 이력 응답
export interface ApiCartHistoryResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ApiCartHistoryItem[];
}

// ===================== API 선택지 응답 타입들 =====================

// API 카트 상태 선택지 응답
export interface ApiStatusChoicesResponse {
  success: boolean;
  message: string;
  choices: Array<{
    value: ApiCartStatus;
    label: string;
  }>;
}

// API 배터리 레벨 선택지 응답
export interface ApiBatteryLevelChoicesResponse {
  success: boolean;
  message: string;
  choices: Array<{
    value: number;
    label: string;
  }>;
}
