import { WithId } from "@/shared/types";

// 공통 타입 정의
export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface WithAuthor {
  authorId: string;
  authorName: string;
}

/**
 * 공지사항 기본 타입 (비즈니스 로직용)
 */
export interface BaseAnnouncement {
  title: string;
  content: string;
  isPublished: boolean;
}

/**
 * 공지사항 완전체 타입 (UI용)
 */
export interface Announcement
  extends BaseAnnouncement,
    WithId,
    WithTimestamps,
    WithAuthor {
  views: number;
  publishedAt?: string;
  files: AnnouncementFile[];
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  validFrom?: string;
  validUntil?: string;
}

/**
 * 첨부파일 타입
 */
export interface AnnouncementFile extends WithId, WithTimestamps {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

/**
 * 공지사항 상태 타입
 */
export type AnnouncementStatus = "draft" | "published" | "archived";

/**
 * 공지사항 카테고리 타입
 */
export type AnnouncementCategory =
  | "general"
  | "system"
  | "maintenance"
  | "event"
  | "notice"
  | "urgent";

/**
 * 공지사항 우선순위 타입
 */
export type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

/**
 * 공지사항 타입 (대시보드 연동용)
 */
export type AnnouncementType = "JCADDIE" | "GOLF_COURSE";
