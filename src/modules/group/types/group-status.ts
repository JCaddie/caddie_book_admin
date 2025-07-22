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

// 그룹 생성 API 요청 타입
export interface CreateGroupRequest {
  name: string;
  group_type: "PRIMARY" | "SPECIAL";
  golf_course: string; // UUID 문자열로 변경
  order: number;
  is_active: boolean;
  description?: string;
}

// 그룹 생성 API 응답 타입
export interface CreateGroupResponse {
  id: number;
  name: string;
  group_type: "PRIMARY" | "SPECIAL";
  golf_course: number;
  order: number;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

// 그룹 목록 조회 API 응답 타입
export interface GroupListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CreateGroupResponse[];
}
