// UI 및 폼 전용 타입 정의

/**
 * 골프장 테이블 표시용 (UI camelCase 방식)
 */
export interface GolfCourse {
  id: string;
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
}

/**
 * 골프장 편집 폼용 타입
 */
export interface EditableGolfCourse {
  id: string;
  name: string;
  region: string;
  address: string;
  contractStatus: string;
  membershipType: string;
  phone: string;
  isActive: boolean;
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

/**
 * 골프장 폼 검증 에러
 */
export interface GolfCourseFormErrors {
  name?: string;
  region?: string;
  address?: string;
  contractStatus?: string;
  membershipType?: string;
  phone?: string;
  representative?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  manager?: {
    name?: string;
    contact?: string;
    email?: string;
  };
}

/**
 * 골프장 드롭다운 옵션
 */
export interface GolfCourseOption {
  label: string;
  value: string;
}

/**
 * 골프장 필터 상태 (UI용)
 */
export interface GolfCourseFilterState {
  search: string;
  contractStatus: string;
  membershipType: string;
  isActive: string;
  page: number;
}

/**
 * 골프장 테이블 정렬 옵션
 */
export interface GolfCourseSortOption {
  field: keyof GolfCourse;
  direction: "asc" | "desc";
}

/**
 * 골프장 목록 뷰 모드
 */
export type GolfCourseViewMode = "table" | "card" | "grid";

/**
 * 골프장 액션 타입
 */
export type GolfCourseAction = "view" | "edit" | "delete" | "duplicate";

/**
 * 골프장 상태 타입
 */
export type GolfCourseStatus = "active" | "inactive" | "pending" | "suspended";
