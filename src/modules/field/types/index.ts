import { TableItem } from "@/shared/hooks";
import { FIELD_CONSTANTS } from "../constants";

// ================================
// 기본 필드 관련 타입
// ================================

/**
 * 필드 운영 상태
 */
export type FieldStatus =
  (typeof FIELD_CONSTANTS.STATUS)[keyof typeof FIELD_CONSTANTS.STATUS];

/**
 * 기본 필드 데이터 (API 응답 형태)
 */
export interface FieldData {
  id: string;
  no: number;
  fieldName: string;
  golfCourse: string;
  capacity: number;
  cart: string;
  status: FieldStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 테이블 표시용 필드 데이터
 */
export interface FieldTableRow extends TableItem {
  no: number;
  fieldName: string;
  golfCourse: string;
  capacity: number;
  cart: string;
  status: FieldStatus;
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
  fieldName: string;
  golfCourse: string;
  capacity: number;
  cart: string;
  status: FieldStatus;
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
