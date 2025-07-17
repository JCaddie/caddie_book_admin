// ================================
// 기본 필드 관련 타입
// ================================

/**
 * 기본 필드 데이터 (API 응답 형태)
 */
export interface FieldData {
  id: string;
  name: string;
  golf_course: string; // 골프장명(문자열)
  is_active: boolean;
  hole_count: number;
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
// 폼 관련 타입
// ================================

/**
 * 필드 생성/수정 폼 데이터
 */
export interface FieldFormData {
  name: string;
  golf_course: string;
  is_active: boolean;
  hole_count: number;
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
