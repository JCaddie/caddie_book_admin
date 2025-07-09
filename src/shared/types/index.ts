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
export type {
  GolfCourse,
  ContactInfo,
  OperationStats,
  GolfCourseDetail,
  EditableGolfCourse,
  GolfCourseFilters,
  OperationCard,
} from "./golf-course";

// 캐디 관련 타입
export type {
  Caddie,
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
