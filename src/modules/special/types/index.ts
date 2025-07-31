// ================================
// 특수반 관리 타입 (통합 설계 기반)
// ================================

// 공통 타입 import
export type {
  BaseGroup,
  CreateGroupRequest,
  GroupListParams,
  SpecialGroup,
} from "@/shared/types";

import type { GroupType } from "@/shared/types";

// Special 모듈 전용 확장 타입
export interface SpecialGroupUI {
  // BaseGroup으로부터 상속
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

  // SpecialGroup으로부터 상속
  color?: string;
  member_count?: number;

  // UI 전용 속성들
  isActive: boolean; // 기존 is_active와 호환성을 위한 별칭
}

// 특수반 멤버 타입
export interface SpecialGroupMember {
  id: string;
  caddieId: string;
  caddieName: string;
  groupId: string;
  joinedAt: string;
  isActive: boolean;
}

// 특수반 스케줄 타입
export interface SpecialGroupScheduleData {
  id: string;
  groupId: string;
  date: string;
  timeSlot: string;
  caddieId: string;
  caddieName: string;
  status: "scheduled" | "completed" | "cancelled";
}

// 특수반 관리 필터 타입
export interface SpecialGroupFilter {
  search: string;
  status: string;
  group: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// 특수반 생성/수정 폼 데이터 타입
export interface SpecialGroupFormData {
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
}

// ================================
// 페이지 및 컴포넌트 Props 타입
// ================================

// 특수반 상세 페이지 Props
export interface SpecialGroupDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 특수반 테이블 Props
export interface SpecialGroupTableProps {
  groups: SpecialGroupUI[];
  onEdit: (group: SpecialGroupUI) => void;
  onDelete: (groupId: string) => void;
  onStatusChange: (groupId: string, isActive: boolean) => void;
}

// 특수반 설정 모달 Props
export interface SpecialGroupSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groups: SpecialGroupUI[]) => void;
  initialGroups?: SpecialGroupUI[];
  isLoading?: boolean;
}

// 특수반 생성 모달 Props
export interface SpecialGroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  golfCourseId: string;
  golfCourseName?: string;
}

// 특수반 삭제 모달 Props
export interface SpecialGroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isLoading?: boolean;
}

// 특수반 스케줄 테이블 Props
export interface SpecialGroupScheduleTableProps {
  groups: SpecialGroupUI[];
  timeSlots: string[];
  schedules: SpecialGroupScheduleData[];
  onScheduleChange: (
    groupId: string,
    timeSlot: string,
    caddieId: string
  ) => void;
  onScheduleRemove: (scheduleId: string) => void;
}

// ================================
// 유틸리티 타입
// ================================

// 특수반 통계 타입
export interface SpecialGroupStats {
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  activeMembers: number;
  scheduleCount: number;
}
