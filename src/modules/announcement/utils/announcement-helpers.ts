/**
 * 공지사항 헬퍼 유틸리티
 */

import { Announcement } from "../types";

/**
 * 공지사항 통계 계산
 */
export function calculateAnnouncementStats(announcements: Announcement[]) {
  const total = announcements.length;
  const published = announcements.filter((a) => a.isPublished).length;
  const unpublished = total - published;
  const pinned = announcements.filter((a) => a.isPinned).length;
  const urgent = announcements.filter((a) => a.priority === "urgent").length;
  const highPriority = announcements.filter(
    (a) => a.priority === "high"
  ).length;
  const normalPriority = announcements.filter(
    (a) => a.priority === "normal"
  ).length;
  const lowPriority = announcements.filter((a) => a.priority === "low").length;

  // 카테고리별 통계
  const categoryStats = announcements.reduce((acc, announcement) => {
    const category = announcement.category || "uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 타입별 통계
  const typeStats = announcements.reduce((acc, announcement) => {
    const type = announcement.announcementType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 조회수 통계
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
  const avgViews = total > 0 ? Math.round(totalViews / total) : 0;
  const maxViews = Math.max(...announcements.map((a) => a.views));
  const minViews = Math.min(...announcements.map((a) => a.views));

  return {
    total,
    published,
    unpublished,
    pinned,
    urgent,
    highPriority,
    normalPriority,
    lowPriority,
    categoryStats,
    typeStats,
    views: {
      total: totalViews,
      average: avgViews,
      max: maxViews,
      min: minViews,
    },
  };
}

/**
 * 공지사항 ID 유효성 검사
 */
export function isValidAnnouncementId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }

  // UUID 형식 검사 (간단한 버전)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * 공지사항 슬러그 생성
 */
export function createAnnouncementSlug(title: string, id: string): string {
  // 제목에서 슬러그 생성
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "") // 특수문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로 변경
    .replace(/-+/g, "-") // 연속된 하이픈을 하나로
    .trim();

  // ID와 결합하여 고유한 슬러그 생성
  return `${slug}-${id.slice(0, 8)}`;
}
