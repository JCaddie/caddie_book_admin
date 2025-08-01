/**
 * 공지사항 테이블 관련 유틸리티
 */

import { Announcement, AnnouncementWithNo } from "../types";

/**
 * 공지사항에 번호 추가
 */
export function addNumberToAnnouncements(
  announcements: Announcement[],
  currentPage: number,
  pageSize: number
): AnnouncementWithNo[] {
  return announcements.map((announcement, index) => ({
    ...announcement,
    no: (currentPage - 1) * pageSize + index + 1,
  }));
}

/**
 * 빈 행 생성 (페이지네이션용)
 */
export function createEmptyRows(
  currentDataLength: number,
  pageSize: number
): AnnouncementWithNo[] {
  const emptyRowsCount = Math.max(0, pageSize - currentDataLength);
  const emptyRows: AnnouncementWithNo[] = [];

  for (let i = 0; i < emptyRowsCount; i++) {
    emptyRows.push({
      id: `empty-${i}`,
      no: currentDataLength + i + 1,
      title: "",
      content: "",
      views: 0,
      isPublished: false,
      files: [],
      createdAt: "",
      updatedAt: "",
      authorId: "",
      authorName: "",
      golfCourseId: "",
      golfCourseName: "",
      targetGroup: null,
      announcementType: "",
      announcementTypeDisplay: "",
      isEmpty: true,
    });
  }

  return emptyRows;
}

/**
 * 빈 행 여부 확인
 */
export function isEmptyRow(record: AnnouncementWithNo): boolean {
  return (
    record.isEmpty === true || !record.id || record.id.startsWith("empty-")
  );
}

/**
 * 유효한 공지사항 여부 확인
 */
export function isValidAnnouncement(announcement: AnnouncementWithNo): boolean {
  return (
    !isEmptyRow(announcement) &&
    !!announcement.id &&
    !announcement.id.startsWith("empty-")
  );
}
