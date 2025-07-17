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

// 운영현황 카드 타입
export interface OperationCard {
  title: string;
  value: string;
  route: string;
  searchParam: string;
}
