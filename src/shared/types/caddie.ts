import { TableItem } from "@/shared/hooks";

// 캐디 기본 정보 인터페이스
export interface Caddie extends TableItem {
  no: number;
  name: string;
  golfCourse: string;
  gender: string;
  workStatus: string;
  group: string;
  groupOrder: string;
  specialTeam: string;
  phone: string;
  workScore: string;
}

// 필터 옵션 타입
export interface FilterOption {
  value: string;
  label: string;
}

// 캐디 필터 상태 타입
export interface CaddieFilters {
  searchTerm: string;
  selectedGroup: string;
  selectedSpecialTeam: string;
}

// 캐디 선택 상태 타입
export interface CaddieSelection {
  selectedRowKeys: string[];
  selectedRows: Caddie[];
}
