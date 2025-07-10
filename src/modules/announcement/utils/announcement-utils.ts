/**
 * 공지사항 유틸리티 함수들
 */

import {
  Announcement,
  AnnouncementFilters,
  AnnouncementWithNo,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementSort,
} from "../types";

// 상수 정의
const SAMPLE_DATA_CONFIG = {
  PUBLISHED_RATIO: 0.7, // 70% 확률로 게시됨
  PINNED_RATIO: 0.1, // 10% 확률로 고정됨
  MAX_DAYS_AGO: 30,
  MAX_UPDATE_DAYS: 7,
  MAX_VIEWS: 5000,
  MAX_AUTHORS: 10,
  FILE_RATIO: 0.3, // 30% 확률로 파일 첨부
  MAX_FILES_PER_ANNOUNCEMENT: 3,
} as const;

// 카테고리 목록
const CATEGORIES: AnnouncementCategory[] = [
  "general",
  "system",
  "maintenance",
  "event",
  "notice",
  "urgent",
];

// 우선순위 목록
const PRIORITIES: AnnouncementPriority[] = ["low", "normal", "high", "urgent"];

// 타입별 제목 템플릿
const JCADDIE_TITLES = [
  "제이캐디 시스템 점검 안내",
  "제이캐디 새로운 기능 업데이트",
  "제이캐디 중요한 공지사항",
  "제이캐디 이벤트 안내",
  "제이캐디 서비스 개선 사항",
];

const GOLF_COURSE_TITLES = [
  "골프장 운영 안내",
  "골프장 시설 점검 일정",
  "골프장 이벤트 공지",
  "골프장 규정 변경 안내",
  "골프장 예약 시스템 업데이트",
];

// 샘플 내용 템플릿
const SAMPLE_CONTENTS = [
  "안녕하세요. 중요한 공지사항을 알려드립니다.",
  "시스템 안정성을 위한 업데이트를 진행합니다.",
  "사용자 편의성 개선을 위한 새로운 기능이 추가되었습니다.",
  "정기적인 시스템 점검을 실시합니다.",
  "보안 강화를 위한 업데이트가 적용됩니다.",
];

/**
 * 랜덤 요소 선택
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 랜덤 정수 생성
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 랜덤 날짜 생성
 */
function getRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.random() * daysAgo;
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
}

/**
 * 샘플 제목 생성
 */
function generateSampleTitle(index: number): string {
  // 홀수/짝수로 타입 구분 (실제로는 DB에서 타입 필드로 구분)
  const isJcaddie = index % 2 === 1;
  const titleArray = isJcaddie ? JCADDIE_TITLES : GOLF_COURSE_TITLES;
  return `${getRandomElement(titleArray)} ${String(index).padStart(2, "0")}`;
}

/**
 * 샘플 내용 생성
 */
function generateSampleContent(index: number): string {
  const baseContent = getRandomElement(SAMPLE_CONTENTS);
  return `${baseContent}\n\n상세 내용은 다음과 같습니다:\n\n${index}번째 공지사항의 내용입니다. 자세한 사항은 관련 부서에 문의하시기 바랍니다.`;
}

/**
 * 샘플 파일 생성
 */
function generateSampleFiles(announcementId: string): Announcement["files"] {
  if (Math.random() > SAMPLE_DATA_CONFIG.FILE_RATIO) {
    return [];
  }

  const fileCount = getRandomInt(
    1,
    SAMPLE_DATA_CONFIG.MAX_FILES_PER_ANNOUNCEMENT
  );
  const files: Announcement["files"] = [];

  for (let i = 0; i < fileCount; i++) {
    const fileTypes = [
      { ext: "pdf", mime: "application/pdf", name: "공지사항_첨부파일" },
      {
        ext: "docx",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        name: "상세내용",
      },
      {
        ext: "xlsx",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        name: "데이터",
      },
      { ext: "jpg", mime: "image/jpeg", name: "이미지" },
      { ext: "png", mime: "image/png", name: "스크린샷" },
    ];

    const fileType = getRandomElement(fileTypes);
    const size = getRandomInt(1024, 1024 * 1024 * 5); // 1KB ~ 5MB
    const uploadedAt = getRandomDate(7);

    files.push({
      id: `file-${announcementId}-${i + 1}`,
      filename: `${fileType.name}_${i + 1}.${fileType.ext}`,
      originalName: `${fileType.name}_${i + 1}.${fileType.ext}`,
      size,
      mimeType: fileType.mime,
      url: `/files/${announcementId}/${fileType.name}_${i + 1}.${fileType.ext}`,
      uploadedAt: uploadedAt.toISOString(),
      createdAt: uploadedAt.toISOString(),
      updatedAt: uploadedAt.toISOString(),
    });
  }

  return files;
}

/**
 * 샘플 공지사항 데이터를 생성합니다
 * @param count 생성할 공지사항 개수
 * @returns 생성된 공지사항 배열
 */
export function generateSampleAnnouncements(count: number): Announcement[] {
  if (count <= 0) return [];

  const announcements: Announcement[] = [];

  for (let i = 1; i <= count; i++) {
    const isPublished = Math.random() < SAMPLE_DATA_CONFIG.PUBLISHED_RATIO;
    const isPinned = Math.random() < SAMPLE_DATA_CONFIG.PINNED_RATIO;
    const category = getRandomElement(CATEGORIES);
    const priority = getRandomElement(PRIORITIES);

    const createdAt = getRandomDate(SAMPLE_DATA_CONFIG.MAX_DAYS_AGO);
    const updatedAt = new Date(
      createdAt.getTime() +
        Math.random() * SAMPLE_DATA_CONFIG.MAX_UPDATE_DAYS * 24 * 60 * 60 * 1000
    );

    const announcementId = `announcement-${i}`;
    const authorId = `user-${getRandomInt(1, SAMPLE_DATA_CONFIG.MAX_AUTHORS)}`;

    announcements.push({
      id: announcementId,
      title: generateSampleTitle(i),
      content: generateSampleContent(i),
      views: getRandomInt(1, SAMPLE_DATA_CONFIG.MAX_VIEWS),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      authorId,
      authorName: `관리자${authorId.split("-")[1]}`,
      isPublished,
      publishedAt: isPublished ? createdAt.toISOString() : undefined,
      files: generateSampleFiles(announcementId),
      category,
      priority,
      isPinned,
      validFrom: createdAt.toISOString(),
      validUntil: undefined, // 대부분의 공지사항은 만료일이 없음
    });
  }

  return announcements;
}

/**
 * 공지사항 필터링을 수행합니다
 * @param announcements 필터링할 공지사항 배열
 * @param filters 적용할 필터
 * @returns 필터링된 공지사항 배열
 */
export function filterAnnouncements(
  announcements: Announcement[],
  filters: AnnouncementFilters
): Announcement[] {
  return announcements.filter((announcement) => {
    // 검색어 필터링
    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      const titleMatch = announcement.title.toLowerCase().includes(searchTerm);
      const contentMatch = announcement.content
        .toLowerCase()
        .includes(searchTerm);
      const authorMatch = announcement.authorName
        .toLowerCase()
        .includes(searchTerm);

      if (!titleMatch && !contentMatch && !authorMatch) return false;
    }

    // 게시 상태 필터링
    if (filters.isPublished !== undefined) {
      if (announcement.isPublished !== filters.isPublished) return false;
    }

    // 카테고리 필터링
    if (filters.category && announcement.category !== filters.category) {
      return false;
    }

    // 우선순위 필터링
    if (filters.priority && announcement.priority !== filters.priority) {
      return false;
    }

    // 고정 상태 필터링
    if (filters.isPinned !== undefined) {
      if (announcement.isPinned !== filters.isPinned) return false;
    }

    // 작성자 필터링
    if (filters.authorId && announcement.authorId !== filters.authorId) {
      return false;
    }

    // 날짜 범위 필터링
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const createdAt = new Date(announcement.createdAt);
      if (createdAt < startDate) return false;
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const createdAt = new Date(announcement.createdAt);
      if (createdAt > endDate) return false;
    }

    // 공지사항 타입 필터링 (대시보드 연동용)
    if (filters.type) {
      // Mock 데이터에서는 제목 기반으로 타입 구분 (실제로는 DB에서 타입 필드로 구분)
      const announcementType = announcement.title.includes("제이캐디")
        ? "JCADDIE"
        : announcement.title.includes("골프장")
        ? "GOLF_COURSE"
        : "JCADDIE"; // 기본값

      if (announcementType !== filters.type) return false;
    }

    return true;
  });
}

/**
 * 공지사항 정렬을 수행합니다
 * @param announcements 정렬할 공지사항 배열
 * @param sort 정렬 옵션
 * @returns 정렬된 공지사항 배열
 */
export function sortAnnouncements(
  announcements: Announcement[],
  sort: AnnouncementSort
): Announcement[] {
  return [...announcements].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sort.field) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case "publishedAt":
        aValue = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
        bValue = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
        break;
      case "views":
        aValue = a.views;
        bValue = b.views;
        break;
      case "priority":
        const priorityOrder = { low: 1, normal: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority || "normal"];
        bValue = priorityOrder[b.priority || "normal"];
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * 공지사항에 번호를 추가합니다
 * @param announcements 공지사항 배열
 * @param currentPage 현재 페이지
 * @param pageSize 페이지 크기
 * @returns 번호가 추가된 공지사항 배열
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
 * 빈 행을 생성합니다
 * @param currentDataLength 현재 데이터 길이
 * @param pageSize 페이지 크기
 * @returns 빈 행 배열
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
      createdAt: "",
      updatedAt: "",
      authorId: "",
      authorName: "",
      isPublished: false,
      files: [],
      isEmpty: true,
    } as AnnouncementWithNo);
  }

  return emptyRows;
}

/**
 * 행이 빈 행인지 확인합니다
 * @param record 확인할 레코드
 * @returns 빈 행 여부
 */
export function isEmptyRow(record: AnnouncementWithNo): boolean {
  return (
    record.id.startsWith("empty-") ||
    ("isEmpty" in record && Boolean(record.isEmpty))
  );
}

/**
 * 유효한 공지사항인지 확인합니다 (빈 행 제외)
 * @param announcement 확인할 공지사항
 * @returns 유효성 여부
 */
export function isValidAnnouncement(announcement: AnnouncementWithNo): boolean {
  return !isEmptyRow(announcement) && announcement.id.trim() !== "";
}

/**
 * 공지사항 검색을 수행합니다
 * @param announcements 검색할 공지사항 배열
 * @param searchTerm 검색어
 * @param options 검색 옵션
 * @returns 검색 결과
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

  if (!searchTerm.trim()) return announcements;

  const term = caseSensitive
    ? searchTerm.trim()
    : searchTerm.toLowerCase().trim();

  return announcements.filter((announcement) => {
    return fields.some((field) => {
      const value = announcement[field];
      if (typeof value !== "string") return false;

      const fieldValue = caseSensitive ? value : value.toLowerCase();

      return exactMatch ? fieldValue === term : fieldValue.includes(term);
    });
  });
}

/**
 * 공지사항 통계를 계산합니다
 * @param announcements 공지사항 배열
 * @returns 통계 정보
 */
export function calculateAnnouncementStats(announcements: Announcement[]) {
  const totalCount = announcements.length;
  const publishedCount = announcements.filter((a) => a.isPublished).length;
  const draftCount = announcements.filter((a) => !a.isPublished).length;
  const pinnedCount = announcements.filter((a) => a.isPinned).length;
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
  const avgViews = totalCount > 0 ? Math.round(totalViews / totalCount) : 0;

  // 최근 7일 내 생성된 공지사항 수
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCount = announcements.filter(
    (a) => new Date(a.createdAt) >= sevenDaysAgo
  ).length;

  // 카테고리별 통계
  const categoryStats = CATEGORIES.reduce((stats, category) => {
    stats[category] = announcements.filter(
      (a) => a.category === category
    ).length;
    return stats;
  }, {} as Record<AnnouncementCategory, number>);

  // 우선순위별 통계
  const priorityStats = PRIORITIES.reduce((stats, priority) => {
    stats[priority] = announcements.filter(
      (a) => a.priority === priority
    ).length;
    return stats;
  }, {} as Record<AnnouncementPriority, number>);

  return {
    totalCount,
    publishedCount,
    draftCount,
    archivedCount: 0, // 현재 구현에서는 아카이브 기능 없음
    pinnedCount,
    totalViews,
    avgViews,
    recentViewsCount: recentCount,
    categoryStats,
    priorityStats,
  };
}

/**
 * 공지사항 ID 유효성 검사
 * @param id 검사할 ID
 * @returns 유효한 ID인지 여부
 */
export function isValidAnnouncementId(id: string): boolean {
  return /^announcement-\d+$/.test(id);
}

/**
 * 공지사항 슬러그 생성
 * @param title 제목
 * @param id ID
 * @returns 슬러그
 */
export function createAnnouncementSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return `${slug}-${id}`;
}
