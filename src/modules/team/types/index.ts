// ================================
// 팀 관리 타입
// ================================

// 팀 데이터 타입
export interface Team {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 팀 멤버 타입
export interface TeamMember {
  id: string;
  caddieId: string;
  caddieName: string;
  teamId: string;
  joinedAt: string;
  isActive: boolean;
}

// 팀 스케줄 타입
export interface TeamScheduleData {
  id: string;
  teamId: string;
  date: string;
  timeSlot: string;
  caddieId: string;
  caddieName: string;
  status: "scheduled" | "completed" | "cancelled";
}

// 팀 관리 필터 타입
export interface TeamFilter {
  search: string;
  status: string;
  team: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// 팀 생성/수정 폼 데이터 타입
export interface TeamFormData {
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
}

// ================================
// 페이지 및 컴포넌트 Props 타입
// ================================

// 팀 상세 페이지 Props
export interface TeamDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 팀 테이블 Props
export interface TeamTableProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  onStatusChange: (teamId: string, isActive: boolean) => void;
}

// 팀 설정 모달 Props
export interface TeamSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teams: Team[]) => void;
  initialTeams?: Team[];
  isLoading?: boolean;
}

// 팀 스케줄 테이블 Props
export interface TeamScheduleTableProps {
  teams: Team[];
  timeSlots: string[];
  schedules: TeamScheduleData[];
  onScheduleChange: (
    teamId: string,
    timeSlot: string,
    caddieId: string
  ) => void;
  onScheduleRemove: (scheduleId: string) => void;
}

// ================================
// 유틸리티 타입
// ================================

// 팀 통계 타입
export interface TeamStats {
  totalTeams: number;
  activeTeams: number;
  totalMembers: number;
  activeMembers: number;
  scheduleCount: number;
}

// ================================
// 하위 호환성을 위한 타입 alias
// ================================

/** @deprecated Use Team instead */
export type SpecialTeam = Team;

/** @deprecated Use TeamMember instead */
export type SpecialTeamMember = TeamMember;

/** @deprecated Use TeamScheduleData instead */
export type SpecialTeamScheduleData = TeamScheduleData;

/** @deprecated Use TeamFilter instead */
export type SpecialTeamFilter = TeamFilter;

/** @deprecated Use TeamFormData instead */
export type SpecialTeamFormData = TeamFormData;

/** @deprecated Use TeamDetailPageProps instead */
export type SpecialTeamDetailPageProps = TeamDetailPageProps;

/** @deprecated Use TeamTableProps instead */
export type SpecialTeamTableProps = TeamTableProps;

/** @deprecated Use TeamSettingModalProps instead */
export type SpecialTeamSettingModalProps = TeamSettingModalProps;

/** @deprecated Use TeamScheduleTableProps instead */
export type SpecialTeamScheduleTableProps = TeamScheduleTableProps;

/** @deprecated Use TeamStats instead */
export type SpecialTeamStats = TeamStats;
