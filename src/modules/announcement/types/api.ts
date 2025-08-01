import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementType,
} from "./base";

/**
 * API 응답 타입들 (snake_case - 백엔드 형식)
 */

// 공지사항 목록 API 응답 아이템
export interface AnnouncementApiData {
  id: string;
  title: string;
  content: string;
  views: number;
  is_published: boolean;
  author: string;
  author_name: string;
  golf_course: string;
  golf_course_name: string;
  target_group: string | null;
  announcement_type: string;
  announcement_type_display: string;
  created_at: string;
  updated_at: string;
}

// 공지사항 상세 API 응답
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
  target_group: string | null;
  announcement_type: string;
  announcement_type_display: string;
  created_at: string;
  updated_at: string;
}

// 공지사항 상세 API 응답 구조 (data 래퍼 포함)
export interface AnnouncementDetailApiResponse {
  success: boolean;
  message: string;
  data: AnnouncementDetailApiData;
}

// 공지사항 목록 API 응답 데이터
export interface AnnouncementListApiData {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: AnnouncementApiData[];
}

// 공지사항 목록 API 응답 구조
export interface AnnouncementListApiResponse {
  success: boolean;
  message: string;
  data: AnnouncementListApiData;
}

/**
 * API 요청 타입들 (camelCase - 프론트엔드 형식)
 */

// 공지사항 생성 요청
export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  announcement_type: string;
  is_published: boolean;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  is_pinned?: boolean;
  valid_from?: string;
  valid_until?: string;
}

// 공지사항 수정 요청
export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  is_published?: boolean;
  announcement_type?: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  is_pinned?: boolean;
  valid_from?: string;
  valid_until?: string;
}

// 일괄 삭제 요청
export interface BulkDeleteRequest {
  ids: string[];
}

/**
 * 필터 및 검색 관련 타입들
 */
export interface AnnouncementFilters {
  searchTerm?: string;
  isPublished?: boolean;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  startDate?: string;
  endDate?: string;
  authorId?: string;
  type?: AnnouncementType;
}

// 정렬 옵션
export interface AnnouncementSort {
  field: keyof Announcement;
  order: "asc" | "desc";
}
