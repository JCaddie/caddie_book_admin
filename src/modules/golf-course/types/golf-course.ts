// 통합된 도메인 타입 사용
import type { GolfCourse as BaseGolfCourse } from "@/shared/types/domain";

export interface GolfCourse extends BaseGolfCourse {
  no: number;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
}

// 실제 API 응답 구조에 맞는 골프장 타입
export interface GolfCourseApiResponse {
  id: string; // UUID 형태의 골프장 ID
  name: string; // 골프장명
  region: string; // 지역
  contract_status: string; // 계약 상태 (snake_case)
  phone: string; // 전화번호 (빈 문자열 가능)
  membership_type: string; // 회원제 타입 (snake_case)
  total_caddies: number; // 총 캐디 수 (snake_case)
  field_count: number; // 필드 수 (snake_case)
}

export interface GolfCourseDetail {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  ceo_name: string;
  membership_type: string;
  contract_status: string;
  contract_start_date: string;
  contract_end_date: string;
  manager_name: string;
  manager_contact: string;
  manager_email: string;
  total_caddies: number;
  field_count: number;
  cart_count: number;
  manager_count: number;
  work_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface GolfCourseListData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: GolfCourseApiResponse[];
}

export interface GolfCourseListResponse {
  success: boolean;
  message: string;
  data: GolfCourseListData;
}

export interface GolfCourseFilters {
  contract: string;
  field_count: string;
  membership_type: string;
  category: string;
}

export interface EditableGolfCourse {
  id: string;
  name: string;
  region: string;
  address: string;
  contractStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  phone: string;
  representative: {
    name: string;
    contact: string;
    email: string;
  };
  manager: {
    name: string;
    contact: string;
    email: string;
  };
}

// 골프장 그룹 현황 API 응답 타입
export interface GolfCourseGroupStatus {
  id: string;
  name: string;
  location: string;
  primary_group_count: number;
  special_group_count: number;
  total_caddies: number;
}

export interface GolfCourseGroupStatusResponse {
  results: GolfCourseGroupStatus[];
  count: number;
  page: number;
  total_pages: number;
}

// 골프장 그룹 상세 API 응답 타입
export interface GolfCourseGroupDetail {
  id: string;
  name: string;
  location: string;
  address: string;
  contract_status: string;
}

export interface GroupMember {
  id: string;
  name: string;
  is_team_leader: boolean;
  order?: number; // 그룹 내 순서
}

export interface Group {
  id: number;
  name: string;
  order: number;
  member_count: number;
  members: GroupMember[];
}

export interface GroupSummary {
  primary_group_count: number;
  special_group_count: number;
  total_caddies: number;
}

export interface CaddieSummary {
  total_caddies: number;
  team_leaders: number;
  active_caddies: number;
}

export interface GolfCourseGroupDetailResponse {
  golf_course: GolfCourseGroupDetail;
  group_summary: GroupSummary;
  caddie_summary: CaddieSummary;
}
