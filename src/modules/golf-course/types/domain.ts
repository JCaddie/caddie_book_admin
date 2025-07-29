// 비즈니스 도메인 모델 타입 정의

/**
 * 연락처 정보
 */
export interface ContactInfo {
  name: string;
  contact: string;
  email: string;
}

/**
 * 골프장 기본 정보
 */
export interface GolfCourseBasicInfo {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
}

/**
 * 골프장 계약 정보
 */
export interface GolfCourseContractInfo {
  contractStatus: string;
  membershipType: string;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
}

/**
 * 골프장 운영 통계
 */
export interface GolfCourseOperationStats {
  totalCaddies: number;
  fieldCount: number;
  cartCount: number;
  managerCount: number;
  workCount: number;
}

/**
 * 골프장 도메인 모델 (완전한 엔티티)
 */
export interface GolfCourseDomain
  extends GolfCourseBasicInfo,
    GolfCourseContractInfo {
  representative: ContactInfo;
  manager: ContactInfo;
  operationStats: GolfCourseOperationStats;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 골프장 그룹 정보
 */
export interface GolfCourseGroup {
  id: string;
  name: string;
  caddieCount: number;
}

/**
 * 골프장 그룹 상태
 */
export interface GolfCourseGroupStatus {
  groupId: string;
  groupName: string;
  totalCaddies: number;
  workingCaddies: number;
  restingCaddies: number;
  offDutyCaddies: number;
}

/**
 * 골프장 운영 현황 요약
 */
export interface GolfCourseOperationSummary {
  golfCourseId: string;
  golfCourseName: string;
  groups: GolfCourseGroupStatus[];
}

/**
 * 골프장 검색 조건
 */
export interface GolfCourseSearchCriteria {
  keyword?: string;
  region?: string;
  contractStatus?: string;
  membershipType?: string;
  isActive?: boolean;
}

/**
 * 골프장 정렬 조건
 */
export interface GolfCourseSortCriteria {
  field: string;
  direction: "asc" | "desc";
}

/**
 * 골프장 페이지네이션 정보
 */
export interface GolfCoursePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
