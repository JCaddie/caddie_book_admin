// ================================
// 캐디 API 관련 타입
// ================================

// API 응답 기본 구조
interface BaseApiResponse {
  success: boolean;
  message: string;
}

// 캐디 간소 정보 (드롭다운용)
export interface CaddieSimple {
  id: string;
  name: string;
  golf_course_name: string;
}

// 캐디 간소 목록 API 응답
export interface CaddieSimpleResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: CaddieSimple[];
  };
}

// 캐디 목록 API 응답 데이터
export interface CaddieListData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: CaddieApiResponse[];
}

// 캐디 목록 API 응답
export interface CaddieListResponse extends BaseApiResponse {
  data: CaddieListData;
}

// 캐디 상세 정보 API 응답
export interface CaddieDetailResponse extends BaseApiResponse {
  data: CaddieDetail;
}

// 캐디 그룹 API 응답
export interface CaddieGroupApiResponse {
  id: string;
  name: string;
  group_type: "PRIMARY" | "SPECIAL";
  order: number;
  is_active: boolean;
  description: string;
  golf_course: string;
  created_at: string;
  updated_at: string;
}

// 캐디 그룹 목록 API 응답
export interface CaddieGroupListResponse extends BaseApiResponse {
  data: CaddieGroupApiResponse[];
}

// 캐디 목록 조회 파라미터
export interface CaddieListParams {
  page?: number;
  page_size?: number;
  search?: string;
  group?: string;
  special_team?: string;
  golf_course?: string; // golf_course_id에서 golf_course로 변경
}

// 캐디 정보 업데이트 요청 타입
export interface UpdateCaddieRequest {
  name?: string;
  gender?: string;
  employment_type?: string;
  phone?: string;
  email?: string;
  address?: string;
  golf_course_id?: string;
  work_score?: number;
  is_team_leader?: boolean;
  primary_group_id?: string;
  special_group_ids?: string[];
}

// API에서 받는 캐디 기본 정보 (snake_case)
export interface CaddieApiResponse {
  id: string;
  user: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  golf_course_name: string;
  gender: "M" | "F";
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  address: string;
  is_on_duty: boolean;
  primary_group: number | null;
  primary_group_order: number;
  special_group: number | null;
  special_group_order: number;
  work_score: number;
  is_team_leader: boolean;
  registration_status: string;
  remaining_days_off: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // 인덱스 시그니처 추가 (DataTable 호환성)
}

// API에서 받는 캐디 상세 정보 (snake_case)
export interface CaddieDetail {
  id: number;
  user: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  golf_course_name: string;
  gender: "M" | "F";
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  address: string;
  is_on_duty: boolean;
  primary_group: number | null;
  primary_group_order: number;
  special_group: number | null;
  special_group_order: number;
  work_score: number;
  is_team_leader: boolean;
  registration_status: string;
  remaining_days_off: number;
  created_at: string;
  updated_at: string;
}

// 캐디 삭제 요청
export interface DeleteCaddieRequest {
  id: string;
}

// 캐디 벌크 삭제 요청
export interface BulkDeleteCaddiesRequest {
  ids: string[];
}

// 캐디 생성 요청
export interface CreateCaddieRequest {
  user_name: string;
  user_email: string;
  user_phone: string;
  golf_course_id: string;
  gender: "M" | "F";
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
  address: string;
  work_score?: number;
  is_team_leader?: boolean;
  primary_group?: number;
  special_group?: number;
}
