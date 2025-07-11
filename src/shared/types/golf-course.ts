// 기본 골프장 정보 타입
export interface GolfCourse extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
  isEmpty?: boolean;
}

// 연락처 정보 타입
export interface ContactInfo {
  name: string;
  contact: string;
  email: string;
}

// 운영 현황 통계 타입
export interface OperationStats {
  caddies: number;
  admins: number;
  reservations: number;
  fields: number;
  carts: number;
}

// 골프장 상세 정보 타입
export interface GolfCourseDetail {
  id: string;
  name: string;
  address: string;
  contractStatus: string;
  contractPeriod: string;
  phone: string;
  representative: ContactInfo;
  manager: ContactInfo;
  operationStats: OperationStats;
}

// 편집 가능한 골프장 정보 타입
export interface EditableGolfCourse {
  id: string;
  name: string;
  address: string;
  contractStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  phone: string;
  representative: ContactInfo;
  manager: ContactInfo;
}

// 골프장 필터 타입
export interface GolfCourseFilters {
  contract: string;
  holes: string;
  membershipType: string;
  category: string;
  dailyTeams: string;
}

// 운영현황 카드 타입
export interface OperationCard {
  title: string;
  value: string;
  route: string;
  searchParam: string;
}
