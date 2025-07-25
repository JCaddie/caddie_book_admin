import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementPriority,
} from "./base";

/**
 * 폼 관련 타입들
 */

// 폼 모드
export type AnnouncementFormMode = "create" | "edit" | "view";

// 폼 데이터
export interface AnnouncementFormData {
  title: string;
  content: string;
  isPublished: boolean;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

// 폼 에러
export interface AnnouncementFormErrors {
  title?: string;
  content?: string;
  category?: string;
  priority?: string;
  files?: string;
  general?: string;
}

// CRUD 데이터 타입들 (폼 데이터 기반)
export type CreateAnnouncementData = AnnouncementFormData;

export type UpdateAnnouncementData = Partial<AnnouncementFormData>;

/**
 * UI 상태 관련 타입들
 */

// 테이블 행 번호가 포함된 공지사항
export interface AnnouncementWithNo
  extends Announcement,
    Record<string, unknown> {
  no: number;
}

// 선택 상태
export interface AnnouncementSelection {
  selectedRowKeys: string[];
  selectedRows: Announcement[];
}

// 페이지네이션 상태
export interface AnnouncementPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// 로딩 상태
export interface AnnouncementLoadingState {
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetching: boolean;
}
