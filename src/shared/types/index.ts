// 사용자 관련 타입
export type { User, AuthUser, UserRole } from "./user";

// 네비게이션 관련 타입
export type {
  NavigationItem,
  SubMenuItem,
  NavigationConfig,
  NavigationState,
} from "./navigation";

// 골프장 관련 타입
export type { ContactInfo, OperationStats, OperationCard } from "./golf-course";

// 캐디 관련 타입
export type {
  Caddie,
  GolfCourse,
  Group,
  SpecialGroup,
  EmploymentType,
  Gender,
  FilterOption,
  CaddieFilters,
  CaddieSelection,
} from "./caddie";

// 테이블 관련 타입
export type {
  Column,
  BaseTableProps,
  SelectableTableProps,
  SelectionState,
  UseTableSelectionReturn,
  TableUtilityProps,
} from "./table";

export * from "./caddie";
export * from "./field";
export * from "./golf-course";
export * from "./navigation";
export * from "./table";
export * from "./user";

// 공통 데이터 타입
export interface WithId {
  id: string;
}

export interface WithNo {
  no: number;
}

export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface WithAuthor {
  authorId: string;
  authorName: string;
}

// 페이지네이션을 위한 데이터 타입
export type PaginatedData<T> = T & WithId & WithNo & Record<string, unknown>;

// 공통 필터 타입
export interface BaseFilters {
  searchTerm: string;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ================================
// 설정 모달 공통 타입
// ================================

// 설정 모달 아이템 기본 인터페이스
export interface BaseSettingItem {
  id: string;
  name: string;
  order: number;
}

// 설정 모달 설정 타입
export interface SettingModalConfig<T extends BaseSettingItem> {
  title: string;
  emptyMessage: string;
  createButtonText: string;
  createNewItem: () => T;
  validateItem: (item: T) => string | null;
  renderItem: (
    item: T,
    isSelected: boolean,
    onNameChange: (name: string) => void,
    onDelete: () => void
  ) => React.ReactNode;
}

// 설정 모달 Props
export interface BaseSettingModalProps<T extends BaseSettingItem> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (items: T[]) => void;
  initialItems?: T[];
  isLoading?: boolean;
  config: SettingModalConfig<T>;
}

// ================================
// 드래그 앤 드롭 타입 안전성
// ================================

// 드래그 데이터 타입 식별자
export interface DragData<T = unknown> {
  type: "caddie" | "team";
  data: T;
}

// 타입 가드 함수들
export function isCaddieDrag(
  dragData: DragData
): dragData is DragData<import("./caddie").Caddie> {
  return dragData.type === "caddie";
}

export function isTeamDrag(
  dragData: DragData
): dragData is DragData<import("../../modules/team/types").Team> {
  return dragData.type === "team";
}
