// ================================
// 필드 기준 타입 (상세 API 기준)
// ================================
import type { Field as BaseField } from "@/shared/types/domain";

export interface Field extends Omit<BaseField, "id"> {
  id: string; // UUID string으로 변경
  golf_course_name: string; // 골프장명 추가
  hole_count: number;
  description: string; // 필수 필드로 변경
  created_at: string; // 필수 필드로 변경
  updated_at: string; // 필수 필드로 변경
}

// ================================
// 테이블/리스트용 타입 (id는 이미 string)
// ================================
export type FieldTableRow = {
  id: string; // 이미 string
  name: string;
  golf_course_name: string;
  is_active: boolean;
  hole_count: number;
  no?: number;
  isEmpty?: boolean;
};

// ================================
// 폼 데이터 (생성/수정)
// ================================
export type FieldFormData = Pick<
  Field,
  "name" | "golf_course_id" | "is_active" | "hole_count" | "description"
>;

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
export interface FieldFilters {
  searchTerm: string;
}

export interface FieldSelection {
  selectedRowKeys: string[];
  selectedRows: FieldTableRow[];
}

// ================================
// API 관련 타입 - 새로운 응답 구조
// ================================
export interface FieldListApiData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Field[];
}

export interface FieldListApiResponse {
  success: boolean;
  message: string;
  data: FieldListApiData;
}

export interface FieldDetailApiResponse {
  success: boolean;
  message: string;
  data: Field;
}

export type CreateFieldRequest = FieldFormData;

export interface UpdateFieldRequest extends Partial<FieldFormData> {
  id: string;
}
