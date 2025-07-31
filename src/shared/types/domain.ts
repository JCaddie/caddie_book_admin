/**
 * 통합된 도메인 타입 정의
 * 모든 모듈에서 공통으로 사용할 타입들을 중앙화
 */

// ================================
// 골프장 관련 타입
// ================================

export interface GolfCourse {
  id: string;
  name: string;
  region: string;
  contractStatus?: string;
  phone?: string;
  membershipType?: string;
  caddies?: number;
  fields?: number;
  isEmpty?: boolean;
}

// ================================
// 필드 관련 타입
// ================================

export interface Field {
  id: string;
  name: string;
  golf_course_id: string;
  golf_course_name: string;
  is_active: boolean;
  hole_count?: number;
  description?: string;
  availablePersonnel?: number;
  carts?: number;
  operationStatus?: "operating" | "maintenance";
  created_at?: string;
  updated_at?: string;
  isEmpty?: boolean;
}

// ================================
// 그룹 관련 타입 (통합 설계)
// ================================

// 그룹 타입 정의
export type GroupType = "PRIMARY" | "SPECIAL";

// 기본 그룹 인터페이스
export interface BaseGroup {
  id: string;
  name: string;
  group_type: GroupType;
  golf_course_id: string;
  golf_course_name?: string;
  is_active: boolean;
  order?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  isEmpty?: boolean;
}

// 확장된 그룹 인터페이스들
export interface Group extends BaseGroup {
  member_count?: number;
}

export interface GroupDetail extends BaseGroup {
  golf_course: GolfCourse;
  members: string[];
}

export interface SpecialGroup extends BaseGroup {
  color?: string;
  member_count?: number;
}

export interface GroupMembership {
  group: Group;
  role: string;
  role_display: string;
}

// 그룹 관리 API 인터페이스
export interface GroupManagementAPI<T extends BaseGroup> {
  create: (data: CreateGroupRequest) => Promise<T>;
  update: (id: string, data: Partial<CreateGroupRequest>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (params?: GroupListParams) => Promise<T[]>;
  getDetail?: (id: string) => Promise<T>;
}

// 그룹 생성 요청 타입
export interface CreateGroupRequest {
  name: string;
  group_type: GroupType;
  golf_course_id: string;
  is_active?: boolean;
  description?: string;
}

// 그룹 리스트 파라미터
export interface GroupListParams {
  golf_course_id?: string;
  group_type?: GroupType;
  is_active?: boolean;
  search?: string;
}

// ================================
// 캐디 관련 타입
// ================================

export type Gender = "MALE" | "FEMALE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type RoleDisplay = "팀장" | "팀원";

export interface Career {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
}

export interface AssignedWork {
  message: string;
  upcoming_schedules: unknown[];
  current_assignment: unknown | null;
}

export interface Caddie {
  id: string;
  name: string;
  golf_course: GolfCourse;
  gender: Gender;
  employment_type: EmploymentType;
  primary_group: Group;
  special_groups: SpecialGroup[];
  phone: string;
  work_score: number;
  isEmpty?: boolean;
}

export interface CaddieDetail {
  id: string;
  name: string;
  employment_type: EmploymentType;
  golf_course: GolfCourse;
  role_display: RoleDisplay;
  group_memberships: GroupMembership[];
  phone: string;
  email: string;
  address: string;
  assigned_work: AssignedWork;
  careers: Career[];
  gender: Gender;
  work_score: number;
  is_team_leader: boolean;
  primary_group?: Group;
  special_groups?: SpecialGroup[];
}

// ================================
// 근무 관련 타입
// ================================

export interface Work {
  id: string;
  no: number;
  date: string;
  golfCourse: string;
  golfCourseId: string;
  totalStaff: number;
  availableStaff: number;
  status: "planning" | "confirmed" | "completed" | "cancelled";
  scheduleType?: string;
  createdAt?: string;
  updatedAt?: string;
  isEmpty?: boolean;
}

// ================================
// 카트 관련 타입
// ================================

export type CartStatus = "사용중" | "대기" | "점검중" | "고장" | "사용불가";

export interface Cart {
  id: string;
  no: number;
  name: string;
  status: CartStatus;
  fieldName: string;
  golfCourseName: string;
  managerName: string;
  createdAt: string;
  updatedAt: string;
  isEmpty?: boolean;
}

// ================================
// 공지사항 관련 타입
// ================================

export type AnnouncementType = "JCADDIE" | "GOLF_COURSE";
export type AnnouncementCategory =
  | "general"
  | "system"
  | "maintenance"
  | "event"
  | "notice"
  | "urgent";
export type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  isPublished: boolean;
  isPinned: boolean;
  views: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  type: AnnouncementType;
  isEmpty?: boolean;
}

// ================================
// 사용자 관련 타입
// ================================

export type UserRole = "MASTER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  golfCourseId?: string;
  golf_course_name?: string;
  phone?: string;
  role_display?: string;
  created_at?: string;
  no?: number;
  isEmpty?: boolean;
}

// ================================
// 공통 타입
// ================================

export interface WithId {
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DragData<T = unknown> {
  type: "caddie" | "team";
  data: T;
}
