// ================================
// 캐디 UI 전용 타입
// ================================

// 모든 타입들을 caddie.ts에서 import
import type {
  Caddie,
  CaddieFilters,
  CaddieSelection,
  EmploymentType,
  Gender,
  SelectOption,
} from "./caddie";

export type { Caddie, CaddieFilters, CaddieSelection, SelectOption };

// UI 전용 타입들만 여기에 정의
export interface EditableCaddie {
  id: string;
  name: string;
  gender: Gender;
  employmentType: EmploymentType;
  golfCourse: string;
  workScore: number;
  isTeamLeader: boolean;
  primaryGroup: string;
  specialGroups: string;
  phone: string;
  email: string;
  address: string;
}

// 캐디 폼 에러 타입
export interface CaddieFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  employmentType?: string;
  golfCourse?: string;
  address?: string;
  workScore?: string;
  primaryGroup?: string;
  specialGroup?: string;
}

// 캐디 테이블 컬럼 설정
export interface CaddieTableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: "left" | "right";
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: Caddie) => React.ReactNode;
}

// 캐디 목록 화면 상태
export interface CaddieListViewState {
  loading: boolean;
  error: string | null;
  data: Caddie[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: CaddieFilters;
  selection: CaddieSelection;
}

// 캐디 상세 화면 상태
export interface CaddieDetailViewState {
  loading: boolean;
  error: string | null;
  caddie: Caddie | null;
  isEditing: boolean;
  formErrors: CaddieFormErrors;
}

// 캐디 생성/편집 폼 상태
export interface CaddieFormState {
  values: Partial<EditableCaddie>;
  errors: CaddieFormErrors;
  loading: boolean;
  touched: Record<string, boolean>;
}

// 캐디 액션 타입
export type CaddieAction =
  | "view"
  | "edit"
  | "delete"
  | "approve"
  | "reject"
  | "assign_group"
  | "change_status";

// 캐디 권한 체크 함수 타입
export type CaddiePermissionChecker = (
  action: CaddieAction,
  caddie: Caddie,
  userRole: string
) => boolean;
