// ================================
// 특수반 관리 타입
// ================================

// 특수반 데이터 타입
export interface SpecialGroup {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  groups: SpecialGroup[];
  onEdit: (group: SpecialGroup) => void;
  onDelete: (groupId: string) => void;
  onStatusChange: (groupId: string, isActive: boolean) => void;
}

// 특수반 설정 모달 Props
export interface SpecialGroupSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groups: SpecialGroup[]) => void;
  initialGroups?: SpecialGroup[];
  isLoading?: boolean;
}

// 특수반 스케줄 테이블 Props
export interface SpecialGroupScheduleTableProps {
  groups: SpecialGroup[];
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
