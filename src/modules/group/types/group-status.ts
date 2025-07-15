// 캐디 그룹 정보 인터페이스
export interface CaddieGroup extends Record<string, unknown> {
  id: string;
  no: number;
  groupName: string;
  leaderName: string;
  memberCount: number;
  activeCount: number;
  inactiveCount: number;
  golfCourse: string;
  members: string[];
  isEmpty?: boolean;
}

// 그룹현황 필터 상태 타입
export interface GroupStatusFilters {
  searchTerm: string;
  selectedGroup: string;
}

// 그룹현황 선택 상태 타입
export interface GroupStatusSelection {
  selectedRowKeys: string[];
  selectedRows: CaddieGroup[];
}

// 그룹 필터 옵션 타입
export interface GroupFilterOption {
  value: string;
  label: string;
}

// 그룹 관리 페이지용 캐디 그룹 인터페이스
export interface CaddieGroupManagement {
  id: string;
  name: string;
  memberCount: number;
  caddies: Array<{
    id: number;
    name: string;
    group: number;
    badge: string;
    status: string;
    specialBadge?: string;
  }>;
}

// 그룹 관리 필터 상태 타입
export interface GroupManagementFilters {
  selectedGroup: string;
  selectedSpecialTeam: string;
  selectedStatus: string;
  searchTerm: string;
}

// 그룹 데이터 타입 (그룹 설정 모달용)
export interface GroupData {
  id: string;
  name: string;
  order: number;
}

// 그룹 설정 모달 Props 타입
export interface GroupSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groups: GroupData[]) => void;
  initialGroups?: GroupData[];
  isLoading?: boolean;
}
