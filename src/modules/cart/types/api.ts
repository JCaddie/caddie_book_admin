// ===================== API 응답 타입들 =====================

// API 카트 상태 타입
export type ApiCartStatus = "available" | "in_use" | "maintenance";

// API 상태 선택지 타입
export interface ApiStatusChoice {
  value: ApiCartStatus;
  label: string;
}

// API 배터리 레벨 선택지 타입 (0-5 단계)
export interface ApiBatteryLevelChoice {
  value: number; // 0, 1, 2, 3, 4, 5
  label: string;
}

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

// API 현재 캐디 정보
export interface ApiCurrentCaddie {
  id: string;
  name: string;
}

// API 카트 응답 데이터
export interface ApiCartData {
  id: string;
  name: string;
  status: ApiCartStatus;
  status_display: string;
  battery_level: number; // 0, 1, 2, 3, 4, 5 (단계별)
  battery_status: string;
  golf_course: ApiGolfCourse;
  current_caddie: ApiCurrentCaddie | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

// API 카트 목록 데이터
export interface ApiCartListData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ApiCartData[];
}

// API 카트 목록 응답
export interface ApiCartListResponse {
  success: boolean;
  message: string;
  data: ApiCartListData;
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

// API 카트 상세 데이터
export interface ApiCartDetailData {
  id: string;
  name: string;
  status: ApiCartStatus;
  status_display: string;
  battery_level: number;
  battery_status: string;
  location: string;
  golf_course: ApiGolfCourse;
  manager: ApiManager | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// API 카트 상세 정보 응답
export interface ApiCartDetailResponse {
  success: boolean;
  message: string;
  data: ApiCartDetailData;
}

// API 카트 이력 캐디 정보
export interface ApiCartHistoryCaddie {
  id: string;
  name: string;
  phone: string;
  role_display: string;
}

// API 카트 이력 아이템
export interface ApiCartHistoryItem {
  id: string;
  caddie: ApiCartHistoryCaddie;
  usage_date: string; // YYYY-MM-DD 형식
  start_time: string; // HH:MM:SS 형식
  end_time: string; // HH:MM:SS 형식
  duration: number; // 분 단위
  is_ongoing: boolean;
  notes: string;
  created_at: string;
}

// API 카트 이력 데이터
export interface ApiCartHistoryData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ApiCartHistoryItem[];
}

// API 카트 이력 응답
export interface ApiCartHistoryResponse {
  success: boolean;
  message: string;
  data: ApiCartHistoryData;
}

// ===================== API 선택지 응답 타입들 =====================

// API 카트 상태 선택지 응답 (constants API 사용)
export interface ApiStatusChoicesResponse {
  success: boolean;
  message: string;
  status_choices: ApiStatusChoice[];
}

// API 배터리 레벨 선택지 응답 (constants API 사용)
export interface ApiBatteryLevelChoicesResponse {
  success: boolean;
  message: string;
  battery_level_choices: ApiBatteryLevelChoice[];
}
