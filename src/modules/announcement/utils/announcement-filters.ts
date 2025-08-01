/**
 * 공지사항 필터링 및 정렬 유틸리티
 */

import { Announcement, AnnouncementFilters, AnnouncementSort } from "../types";

/**
 * 공지사항 필터링
 */
export function filterAnnouncements(
  announcements: Announcement[],
  filters: AnnouncementFilters
): Announcement[] {
  return announcements.filter((announcement) => {
    // 검색어 필터
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const titleMatch = announcement.title.toLowerCase().includes(searchTerm);
      const contentMatch = announcement.content
        .toLowerCase()
        .includes(searchTerm);
      const authorMatch = announcement.authorName
        .toLowerCase()
        .includes(searchTerm);

      if (!titleMatch && !contentMatch && !authorMatch) {
        return false;
      }
    }

    // 공개 상태 필터
    if (filters.isPublished !== undefined) {
      if (announcement.isPublished !== filters.isPublished) {
        return false;
      }
    }

    // 카테고리 필터
    if (filters.category) {
      if (announcement.category !== filters.category) {
        return false;
      }
    }

    // 우선순위 필터
    if (filters.priority) {
      if (announcement.priority !== filters.priority) {
        return false;
      }
    }

    // 고정 여부 필터
    if (filters.isPinned !== undefined) {
      if (announcement.isPinned !== filters.isPinned) {
        return false;
      }
    }

    // 날짜 범위 필터
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const announcementDate = new Date(announcement.createdAt);
      if (announcementDate < startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const announcementDate = new Date(announcement.createdAt);
      if (announcementDate > endDate) {
        return false;
      }
    }

    // 작성자 필터
    if (filters.authorId) {
      if (announcement.authorId !== filters.authorId) {
        return false;
      }
    }

    // 타입 필터
    if (filters.type) {
      if (announcement.announcementType !== filters.type) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 공지사항 정렬
 */
export function sortAnnouncements(
  announcements: Announcement[],
  sort: AnnouncementSort
): Announcement[] {
  return [...announcements].sort((a, b) => {
    const { field, order } = sort;
    const multiplier = order === "asc" ? 1 : -1;

    switch (field) {
      case "title":
        return multiplier * a.title.localeCompare(b.title);

      case "content":
        return multiplier * a.content.localeCompare(b.content);

      case "views":
        return multiplier * (a.views - b.views);

      case "isPublished":
        return multiplier * (Number(a.isPublished) - Number(b.isPublished));

      case "publishedAt":
        if (!a.publishedAt && !b.publishedAt) return 0;
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        return (
          multiplier *
          (new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime())
        );

      case "createdAt":
        return (
          multiplier *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );

      case "updatedAt":
        return (
          multiplier *
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        );

      case "authorName":
        return multiplier * a.authorName.localeCompare(b.authorName);

      case "golfCourseName":
        return multiplier * a.golfCourseName.localeCompare(b.golfCourseName);

      case "announcementType":
        return (
          multiplier * a.announcementType.localeCompare(b.announcementType)
        );

      case "category":
        if (!a.category && !b.category) return 0;
        if (!a.category) return 1;
        if (!b.category) return -1;
        return multiplier * a.category.localeCompare(b.category);

      case "priority":
        if (!a.priority && !b.priority) return 0;
        if (!a.priority) return 1;
        if (!b.priority) return -1;
        return multiplier * a.priority.localeCompare(b.priority);

      case "isPinned":
        if (!a.isPinned && !b.isPinned) return 0;
        if (!a.isPinned) return 1;
        if (!b.isPinned) return -1;
        return multiplier * (Number(a.isPinned) - Number(b.isPinned));

      default:
        return 0;
    }
  });
}

/**
 * 공지사항 검색
 */
export function searchAnnouncements(
  announcements: Announcement[],
  searchTerm: string,
  options: {
    fields?: ("title" | "content" | "authorName")[];
    caseSensitive?: boolean;
    exactMatch?: boolean;
  } = {}
): Announcement[] {
  const {
    fields = ["title", "content", "authorName"],
    caseSensitive = false,
    exactMatch = false,
  } = options;

  if (!searchTerm.trim()) {
    return announcements;
  }

  const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  return announcements.filter((announcement) => {
    return fields.some((field) => {
      const value = announcement[field];
      if (!value) return false;

      const fieldValue = caseSensitive ? value : value.toLowerCase();

      if (exactMatch) {
        return fieldValue === term;
      } else {
        return fieldValue.includes(term);
      }
    });
  });
}
