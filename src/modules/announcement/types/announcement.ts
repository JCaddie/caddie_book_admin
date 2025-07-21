import {
  ApiResponse,
  BaseFilters,
  PaginatedData,
  SelectionState,
  WithAuthor,
  WithId,
  WithTimestamps,
} from "@/shared/types";

// 파일 업로드 상태 타입
export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

// 첨부파일 타입
export interface AnnouncementFile extends WithId, WithTimestamps {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

// 업로드 중인 파일 타입
export interface UploadingFile {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress?: number;
  error?: string;
}

// 공지사항 상태 타입
export type AnnouncementStatus = "draft" | "published" | "archived";

// 공지사항 우선순위 타입
export type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

// 공지사항 카테고리 타입
export type AnnouncementCategory =
  | "general"
  | "system"
  | "maintenance"
  | "event"
  | "notice"
  | "urgent";

// 공지사항 기본 타입
export interface Announcement extends WithId, WithTimestamps, WithAuthor {
  title: string;
  content: string;
  views: number;
  isPublished: boolean;
  publishedAt?: string;
  files: AnnouncementFile[];
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

// 번호가 추가된 공지사항 타입 (빈 행 표시 속성 포함)
export interface AnnouncementWithNo extends PaginatedData<Announcement> {
  isEmpty?: boolean;
}

// 폼 모드 타입
export type AnnouncementFormMode = "view" | "create" | "edit";

// 공지사항 폼 데이터 타입 (공통)
export interface AnnouncementFormData {
  title: string;
  content: string;
  isPublished: boolean;
  // TODO: 첨부파일 기능 추후 활성화 예정
  // files: File[];
  // removeFileIds: string[];
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

// 유효성 검사 에러 타입
export interface AnnouncementFormErrors {
  title?: string;
  content?: string;
  files?: string;
  category?: string;
  priority?: string;
  validFrom?: string;
  validUntil?: string;
  general?: string;
}

// 공지사항 타입 (대시보드 연동용)
export type AnnouncementType = "JCADDIE" | "GOLF_COURSE";

// 공지사항 필터 타입
export interface AnnouncementFilters extends BaseFilters {
  isPublished?: boolean;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  startDate?: string;
  endDate?: string;
  authorId?: string;
  type?: AnnouncementType;
}

// 공지사항 정렬 타입
export type AnnouncementSortField =
  | "title"
  | "createdAt"
  | "updatedAt"
  | "publishedAt"
  | "views"
  | "priority";

export type AnnouncementSortOrder = "asc" | "desc";

export interface AnnouncementSort {
  field: AnnouncementSortField;
  order: AnnouncementSortOrder;
}

// API 응답 타입들 (백엔드 실제 응답 형태)
export interface AnnouncementListApiResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: AnnouncementApiData[];
}

// 백엔드 API 데이터 형태 (snake_case) - 목록용
export interface AnnouncementApiData {
  id: string;
  title: string;
  views: number;
  created_at: string;
  author_name: string;
  golf_course_name: string;
  is_published: boolean;
}

// 백엔드 API 상세 데이터 형태 (snake_case) - 상세 조회용
export interface AnnouncementDetailApiData {
  id: string;
  title: string;
  content: string;
  views: number;
  is_published: boolean;
  author: string;
  author_name: string;
  golf_course: string;
  golf_course_name: string;
  created_at: string;
  updated_at: string;
}

// 기존 타입 (호환성을 위해 유지)
export type AnnouncementListResponse = ApiResponse<{
  items: Announcement[];
  totalCount: number;
  hasMore: boolean;
}>;

export type AnnouncementDetailResponse = ApiResponse<Announcement>;

// CRUD 데이터 타입들
export interface CreateAnnouncementData {
  title: string;
  content: string;
  isPublished: boolean;
  // TODO: 첨부파일 기능 추후 활성화 예정
  // files: File[];
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  isPublished?: boolean;
  // TODO: 첨부파일 기능 추후 활성화 예정
  // files?: File[];
  // removeFileIds?: string[];
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

// 선택 상태 타입
export type AnnouncementSelection = SelectionState<Announcement>;

// 공지사항 통계 타입
export interface AnnouncementStats {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  totalViews: number;
  avgViews: number;
  recentViewsCount: number;
}

// 공지사항 활동 로그 타입
export interface AnnouncementActivityLog
  extends WithId,
    WithTimestamps,
    WithAuthor {
  announcementId: string;
  action:
    | "created"
    | "updated"
    | "published"
    | "unpublished"
    | "deleted"
    | "viewed";
  details?: string;
  metadata?: Record<string, unknown>;
}

// 공지사항 검색 결과 타입
export interface AnnouncementSearchResult {
  announcement: Announcement;
  matchedFields: ("title" | "content")[];
  highlightedTitle?: string;
  highlightedContent?: string;
  relevanceScore: number;
}
