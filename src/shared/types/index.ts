// ================================
// 통합된 도메인 타입들
// ================================

// 골프장 관련 타입
export type { GolfCourse } from "./domain";

// 필드 관련 타입
export type { Field } from "./domain";

// 그룹 관련 타입
export type {
  Group,
  GroupDetail,
  SpecialGroup,
  GroupMembership,
} from "./domain";

// 캐디 관련 타입
export type {
  Caddie,
  CaddieDetail,
  Gender,
  EmploymentType,
  RoleDisplay,
  Career,
  AssignedWork,
} from "./domain";

// 근무 관련 타입
export type { Work } from "./domain";

// 카트 관련 타입
export type { Cart, CartStatus } from "./domain";

// 공지사항 관련 타입
export type {
  Announcement,
  AnnouncementType,
  AnnouncementCategory,
  AnnouncementPriority,
} from "./domain";

// 사용자 관련 타입
export type { User, UserRole } from "./domain";

// 공통 타입
export type { WithId, ApiResponse, ApiError, DragData } from "./domain";

// ================================
// 테이블 관련 타입
// ================================

export type {
  Column,
  BaseTableProps,
  SelectableTableProps,
  SelectionState,
  UseTableSelectionReturn,
  TableUtilityProps,
} from "./table";

// ================================
// 네비게이션 관련 타입
// ================================

export type {
  NavigationItem,
  NavigationConfig,
  NavigationState,
  SubMenuItem,
} from "./navigation";

// ================================
// 필터 관련 타입
// ================================

export interface FilterOption {
  value: string;
  label: string;
}

export interface CaddieFilters {
  searchTerm: string;
  selectedGroup: string;
  selectedSpecialTeam: string;
  selectedGolfCourseId?: string;
}

export interface CaddieSelection {
  selectedRowKeys: string[];
  selectedRows: import("./domain").Caddie[];
}

// ================================
// 기타 유틸리티 타입
// ================================

export interface BaseSettingItem {
  id: string;
  name: string;
}

export interface BaseSettingModalProps<T extends BaseSettingItem> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (items: T[]) => void;
  initialItems?: T[];
  isLoading?: boolean;
  config: {
    createNewItem: () => T;
    validateItem: (item: T) => string | null;
  };
}
