// ================================
// 특수반 관리 타입
// ================================

// 특수반 데이터 타입
export interface SpecialTeam {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 특수반 멤버 타입
export interface SpecialTeamMember {
  id: string;
  caddieId: string;
  caddieName: string;
  teamId: string;
  joinedAt: string;
  isActive: boolean;
}

// 특수반 스케줄 타입
export interface SpecialTeamSchedule {
  id: string;
  teamId: string;
  date: string;
  timeSlot: string;
  caddieId: string;
  caddieName: string;
  status: "scheduled" | "completed" | "cancelled";
}

// 특수반 관리 필터 타입
export interface SpecialTeamFilter {
  search: string;
  status: string;
  team: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// 특수반 생성/수정 폼 데이터 타입
export interface SpecialTeamFormData {
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
}

// ================================
// 페이지 및 컴포넌트 Props 타입
// ================================

// 특수반 상세 페이지 Props
export interface SpecialTeamDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 특수반 테이블 Props
export interface SpecialTeamTableProps {
  teams: SpecialTeam[];
  onEdit: (team: SpecialTeam) => void;
  onDelete: (teamId: string) => void;
  onStatusChange: (teamId: string, isActive: boolean) => void;
}

// 특수반 설정 모달 Props
export interface SpecialTeamSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teams: SpecialTeam[]) => void;
  initialTeams?: SpecialTeam[];
}

// 특수반 스케줄 테이블 Props
export interface SpecialTeamScheduleTableProps {
  teams: SpecialTeam[];
  timeSlots: string[];
  schedules: SpecialTeamSchedule[];
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

// 특수반 통계 타입
export interface SpecialTeamStats {
  totalTeams: number;
  activeTeams: number;
  totalMembers: number;
  activeMembers: number;
  scheduleCount: number;
}
