import {
  WithId,
  WithTimestamps,
  WithAuthor,
  BaseFilters,
  SelectionState,
  ApiResponse,
  PaginatedData,
} from "@/shared/types";

export interface Announcement extends WithId, WithTimestamps, WithAuthor {
  title: string;
  content: string;
  views: number;
  isPublished: boolean;
  publishedAt?: string;
}

// 번호가 추가된 공지사항 타입
export type AnnouncementWithNo = PaginatedData<Announcement>;

export interface AnnouncementFilters extends BaseFilters {
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

export type AnnouncementListResponse = ApiResponse<Announcement[]>;

export interface CreateAnnouncementData {
  title: string;
  content: string;
  isPublished: boolean;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  isPublished?: boolean;
}

export type AnnouncementSelection = SelectionState<Announcement>;
