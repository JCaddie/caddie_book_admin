// API 요청/응답 전용 타입 정의

/**
 * 골프장 목록 API 응답 (실제 백엔드 응답 구조)
 */
export interface GolfCourseApiResponse {
  id: string;
  name: string;
  region: string;
  contract_status: string;
  phone: string;
  membership_type: string;
  total_caddies: number;
  field_count: number;
}

/**
 * 골프장 목록 응답 데이터
 */
export interface GolfCourseListData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: GolfCourseApiResponse[];
}

/**
 * 골프장 목록 API 응답
 */
export interface GolfCourseListResponse {
  success: boolean;
  message: string;
  data: GolfCourseListData;
}

/**
 * 골프장 상세 정보 (실제 백엔드 응답 구조)
 */
export interface GolfCourseDetail {
  id: string;
  total_caddies: number;
  field_count: number;
  cart_count: number;
  manager_count: number;
  work_count: number;
  created_at: string;
  updated_at: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  ceo_name: string;
  membership_type: string;
  contract_status: string;
  contract_start_date: string | null;
  contract_end_date: string | null;
  manager_name: string;
  manager_contact: string;
  manager_email: string;
  is_active: boolean;
}

/**
 * 골프장 상세 정보 API 응답
 */
export interface GolfCourseDetailResponse {
  success: boolean;
  message: string;
  data: GolfCourseDetail;
}

/**
 * 골프장 간소 목록 (드롭다운용)
 */
export interface GolfCourseSimple {
  id: string;
  name: string;
}

/**
 * 골프장 간소 목록 API 응답
 */
export interface GolfCourseSimpleResponse {
  success: boolean;
  message: string;
  count: number;
  results: GolfCourseSimple[];
}

/**
 * 골프장 그룹 상세 API 응답
 */
export interface GolfCourseGroupDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    region: string;
    groups: Array<{
      id: string;
      name: string;
      caddie_count: number;
    }>;
  };
}

/**
 * 골프장 그룹 상태 API 응답
 */
export interface GolfCourseGroupStatusResponse {
  success: boolean;
  message: string;
  data: {
    golf_course_id: string;
    golf_course_name: string;
    groups: Array<{
      group_id: string;
      group_name: string;
      total_caddies: number;
      working_caddies: number;
      resting_caddies: number;
      off_duty_caddies: number;
    }>;
  };
}

/**
 * 골프장 필터 (API 요청용)
 */
export interface GolfCourseFilters {
  contract: string;
  field_count: string;
  membership_type: string;
  category: string;
}

/**
 * 벌크 삭제 요청
 */
export interface BulkDeleteRequest {
  ids: string[];
}
