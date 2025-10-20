// 백엔드 상수값 타입 정의

// 기본 상수 아이템 타입 (string id)
export interface ConstantItem {
  id: string;
  value: string;
}

// 숫자 id를 가지는 상수 아이템 타입
export interface NumericConstantItem {
  id: number;
  value: string;
}

// boolean id를 가지는 상수 아이템 타입
export interface BooleanConstantItem {
  id: boolean;
  value: string;
}

// 백엔드 상수 데이터 전체 구조
export interface BackendConstants {
  user_roles: ConstantItem[];
  genders: ConstantItem[];
  employment_types: ConstantItem[];
  registration_statuses: ConstantItem[];
  day_off_request_types: ConstantItem[];
  day_off_request_statuses: ConstantItem[];
  contract_statuses: ConstantItem[];
  membership_types: ConstantItem[];
  is_active_choices: BooleanConstantItem[];
  group_types: ConstantItem[];
  work_schedule_types: ConstantItem[];
  work_schedule_statuses: ConstantItem[];
  work_slot_statuses: ConstantItem[];
  shift_swap_statuses: ConstantItem[];
  rounding_statuses: ConstantItem[];
  cart_statuses: ConstantItem[];
  battery_levels: NumericConstantItem[];
}

// API 응답 타입
export interface ConstantsApiResponse {
  success: boolean;
  message: string;
  data: BackendConstants;
}

// 상수 카테고리 타입
export type ConstantCategory = keyof BackendConstants;

// 사용자 역할 타입
export type UserRole = "MASTER" | "ADMIN" | "CADDIE";

// 성별 타입
export type Gender = "MALE" | "FEMALE";

// 고용 형태 타입
export type EmploymentType = "FULL_TIME" | "PART_TIME";

// 등록 상태 타입
export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED";

// 휴무 요청 타입
export type DayOffRequestType = "day_off" | "waiting";

// 휴무 요청 상태 타입
export type DayOffRequestStatus = "reviewing" | "approved" | "rejected";

// 계약 상태 타입
export type ContractStatus = "active" | "expired" | "pending" | "terminated";

// 회원제 타입
export type MembershipType = "MEMBERSHIP" | "PUBLIC";

// 근무표 타입
export type WorkScheduleType = "daily" | "special";

// 근무표 상태 타입
export type WorkScheduleStatus =
  | "planning"
  | "confirmed"
  | "completed"
  | "cancelled";

// 근무 슬롯 상태 타입
export type WorkSlotStatus =
  | "available"
  | "assigned"
  | "reserved"
  | "completed"
  | "cancelled";

// 교대 변경 상태 타입
export type ShiftSwapStatus = "pending" | "accepted" | "rejected";

// 라운딩 상태 타입
export type RoundingStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

// 카트 상태 타입
export type CartStatus = "available" | "in_use" | "maintenance";

// 배터리 레벨 타입
export type BatteryLevel = 0 | 1 | 2 | 3 | 4 | 5;
