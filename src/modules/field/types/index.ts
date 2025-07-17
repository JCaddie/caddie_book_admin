// ================================
// 필드 상세 데이터 (상세 API)
// ================================
export interface FieldData {
  id: number;
  name: string;
  golf_course_id: string;
  golf_course_name: string;
  is_active: boolean;
  hole_count: number;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * 테이블 표시용 필드 데이터
 */
export interface FieldTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  golf_course: string;
  is_active: boolean;
  hole_count: number;
  isEmpty?: boolean;
}

// ================================
// 필드 리스트 아이템 (목록 API)
// ================================
export interface FieldListItem {
  id: number;
  name: string;
  golf_course_id: string;
  golf_course_name: string;
  is_active: boolean;
  [key: string]: unknown;
}

// ================================
// 필드 폼 데이터 (생성/수정)
// ================================
export interface FieldFormData {
  name: string;
  golf_course_id: string; // 드롭다운 value는 id
  is_active: boolean;
  hole_count: number;
  description: string;
}

// ================================
// 골프장 옵션 타입 (드롭다운)
// ================================
export interface GolfCourseOption {
  label: string; // 골프장명
  value: string; // 골프장 id
}

// ================================
// 필터 및 선택 관련 타입
// ================================

/**
 * 필드 검색 필터
 */
export interface FieldFilters {
  searchTerm: string;
}

/**
 * 필드 선택 상태
 */
export interface FieldSelection {
  selectedRowKeys: string[];
  selectedRows: FieldTableRow[];
}

// ================================
// API 관련 타입
// ================================

/**
 * 필드 목록 조회 응답
 */
export interface FieldListResponse {
  data: FieldData[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 필드 생성 요청
 */
export type CreateFieldRequest = FieldFormData;

/**
 * 필드 수정 요청
 */
export interface UpdateFieldRequest extends Partial<FieldFormData> {
  id: string;
}
