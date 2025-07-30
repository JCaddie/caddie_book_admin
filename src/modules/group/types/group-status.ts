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
    originalId?: string; // 원본 UUID (드래그 앤 드롭용)
    order?: number; // 그룹 내 순서
    groupName?: string; // 그룹 이름
  }>;
}

// 그룹 생성 API 요청 타입
export interface CreateGroupRequest {
  name: string;
  group_type: "PRIMARY" | "SPECIAL";
  golf_course: string; // UUID 문자열로 변경
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

// 캐디 그룹 배정 관련 타입들
export interface AssignPrimaryRequest {
  caddie_ids: string[];
  orders: number[];
}

export interface AssignedCaddie {
  id: string;
  name: string;
  order: number;
}

export interface AssignPrimaryResponse {
  success: boolean;
  message: string;
  data: {
    group_id: number;
    assigned_count: number;
    assigned_caddies: AssignedCaddie[];
  };
}

export interface ReorderRequest {
  reorders: {
    caddie_id: string;
    new_order: number;
  }[];
}

export interface ReorderResponse {
  success: boolean;
  message: string;
  data: {
    group_id: number;
    updated_count: number;
    updated_orders: {
      caddie_id: string;
      name: string;
      old_order: number;
      new_order: number;
    }[];
  };
}

export interface RemovePrimaryRequest {
  caddie_ids: string[];
}

export interface RemovePrimaryResponse {
  success: boolean;
  message: string;
  data: {
    group_id: number;
    removed_count: number;
    removed_caddies: {
      caddie_id: string;
      name: string;
    }[];
  };
}

// 새로운 그룹 멤버 관리 API 타입들
export interface AddGroupMemberRequest {
  user_id: string;
  order?: number; // 선택적: 지정하지 않으면 맨 뒤에 추가
  membership_type: "PRIMARY" | "SPECIAL";
}

export interface AddGroupMemberResponse {
  success: boolean;
  message: string;
  data: {
    group_id: string;
    user_id: string;
    order: number;
    membership_type: string;
  };
}

export interface RemoveGroupMemberRequest {
  user_id: string;
}

export interface RemoveGroupMemberResponse {
  success: boolean;
  message: string;
  data: {
    group_id: string;
    user_id: string;
    removed: boolean;
  };
}

export interface ReorderGroupMemberRequest {
  user_id: string;
  order: number; // 새로운 순서
}

export interface ReorderGroupMemberResponse {
  success: boolean;
  message: string;
  data: {
    group_id: string;
    user_id: string;
    old_order: number;
    new_order: number;
  };
}
