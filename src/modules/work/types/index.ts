import { TableItem } from "@/shared/hooks";

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
