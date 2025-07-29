// ================================
// 캐디 도메인 타입
// ================================

// import type { GolfCourse } from "@/shared/types/domain"; // 현재 사용하지 않음

// 성별 타입
export type Gender = "M" | "F";

// 고용형태 타입
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY";

// 등록 상태 타입
export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED";

// 그룹 타입
export type GroupType = "PRIMARY" | "SPECIAL";

// 캐디 그룹 도메인 모델
export interface CaddieGroup {
  id: string;
  name: string;
  group_type: GroupType;
  order: number;
  is_active: boolean;
  description: string;
  golf_course: string;
  created_at: string;
  updated_at: string;
}

// 캐디 도메인 모델 (비즈니스 로직에서 사용)
export interface CaddieDomain {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  golfCourseName: string;
  gender: Gender;
  employmentType: EmploymentType;
  address: string;
  isOnDuty: boolean;
  primaryGroup: number | null;
  primaryGroupOrder: number;
  specialGroup: number | null;
  specialGroupOrder: number;
  workScore: number;
  isTeamLeader: boolean;
  registrationStatus: RegistrationStatus;
  remainingDaysOff: number;
  createdAt: Date;
  updatedAt: Date;
}

// 특수 그룹 타입 (레거시 호환성)
export interface SpecialGroup {
  id: string;
  name: string;
  golf_course_name: string;
  group_type: string;
  order: number;
}

// 역할 표시 타입 (레거시 호환성)
export interface RoleDisplay {
  role: string;
  is_team_leader: boolean;
}

// 캐디 경력 정보
export interface CaddieCareer {
  golf_course_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

// 근무 배정 정보
export interface AssignedWork {
  message: string;
  upcoming_schedules: unknown[];
  current_assignment: unknown | null;
}

// 캐디 연락처 정보
export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

// 캐디 상태 정보
export interface CaddieStatus {
  isOnDuty: boolean;
  registrationStatus: RegistrationStatus;
  remainingDaysOff: number;
  workScore: number;
}

// 캐디 그룹 정보
export interface CaddieGroupInfo {
  primaryGroup: number | null;
  primaryGroupOrder: number;
  specialGroup: number | null;
  specialGroupOrder: number;
  isTeamLeader: boolean;
}

// 캐디 통계 정보
export interface CaddieStats {
  totalCaddies: number;
  activeCaddies: number;
  onDutyCaddies: number;
  averageWorkScore: number;
  pendingApprovals: number;
}
