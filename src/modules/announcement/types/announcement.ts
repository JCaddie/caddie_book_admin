import {
  WithId,
  WithTimestamps,
  WithAuthor,
  BaseFilters,
  SelectionState,
  ApiResponse,
  PaginatedData,
} from "@/shared/types";

// 첨부파일 타입
export interface AnnouncementFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface Announcement extends WithId, WithTimestamps, WithAuthor {
  title: string;
  content: string;
  views: number;
  isPublished: boolean;
  publishedAt?: string;
  files: AnnouncementFile[];
}

// 번호가 추가된 공지사항 타입
export type AnnouncementWithNo = PaginatedData<Announcement>;

// 폼 모드 타입
export type AnnouncementFormMode = "view" | "create" | "edit";

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
  files: File[];
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  isPublished?: boolean;
  files?: File[];
  removeFileIds?: string[];
}

export type AnnouncementSelection = SelectionState<Announcement>;
