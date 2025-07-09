import { TableItem } from "@/shared/hooks";

// ================================
// 핵심 근무 관련 타입
// ================================

// 근무 스케줄 데이터 타입
export interface Work extends TableItem {
  no: number;
  date: string; // 일자 (YYYY.MM.DD 형식)
  golfCourse: string; // 골프장명
  totalStaff: number; // 전체 인원수
  availableStaff: number; // 가용인원수
  status: "planning" | "confirmed" | "completed" | "cancelled"; // 상태
  createdAt?: string;
  updatedAt?: string;
}

// 근무 스케줄 필터 타입
export interface WorkFilter {
  search: string;
  status: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// 근무 스케줄 생성/수정 데이터 타입
export interface WorkFormData {
  date: string;
  golfCourseId: string;
  totalStaff: number;
  availableStaff: number;
  notes?: string;
}

// ================================
// 페이지 및 컴포넌트 Props 타입
// ================================

// 근무 상세 페이지 Props
export interface WorkDetailPageProps {
  params: Promise<{
    id: string; // 골프장 ID
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

// 캐디 카드 컴포넌트 Props
export interface CaddieCardProps {
  caddie?: {
    id: number;
    name: string;
    group: number;
    badge: string;
    status: string;
    specialBadge?: string;
  };
  isEmpty?: boolean;
  emptyText?: string;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: (caddie: CaddieData) => void;
  isDragging?: boolean;
}

// ================================
// 도메인 데이터 타입
// ================================

// 캐디 데이터 타입
export interface CaddieData {
  id: number;
  name: string;
  group: number;
  badge: string;
  status: string;
  specialBadge?: string;
}

// 필드 데이터 타입
export interface Field {
  id: number;
  name: string;
}

// 인원 필터 타입
export interface PersonnelFilter {
  status: string;
  group: string;
  badge: string;
}

// 시간대 슬롯 타입
export interface TimeSlots {
  part1: string[];
  part2: string[];
  part3: string[];
}

// 인원 통계 타입
export interface PersonnelStats {
  total: number;
  available: number;
}
