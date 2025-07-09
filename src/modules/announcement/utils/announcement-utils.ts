import {
  Announcement,
  AnnouncementFilters,
  AnnouncementWithNo,
} from "../types";

// 상수 정의
const SAMPLE_DATA_CONFIG = {
  PUBLISHED_RATIO: 0.7, // 70% 확률로 게시됨
  MAX_DAYS_AGO: 30,
  MAX_UPDATE_DAYS: 7,
  MAX_VIEWS: 5000,
  MAX_AUTHORS: 10,
} as const;

/**
 * 샘플 공지사항 데이터를 생성합니다
 * @param count 생성할 공지사항 개수
 * @returns 생성된 공지사항 배열
 */
export const generateSampleAnnouncements = (count: number): Announcement[] => {
  if (count <= 0) return [];

  const announcements: Announcement[] = [];

  for (let i = 1; i <= count; i++) {
    const isPublished = Math.random() > 1 - SAMPLE_DATA_CONFIG.PUBLISHED_RATIO;
    const createdAt = new Date(
      Date.now() -
        Math.random() * SAMPLE_DATA_CONFIG.MAX_DAYS_AGO * 24 * 60 * 60 * 1000
    );
    const updatedAt = new Date(
      createdAt.getTime() +
        Math.random() * SAMPLE_DATA_CONFIG.MAX_UPDATE_DAYS * 24 * 60 * 60 * 1000
    );

    announcements.push({
      id: `announcement-${i}`,
      title: generateSampleTitle(i),
      content: generateSampleContent(i),
      views: Math.floor(Math.random() * SAMPLE_DATA_CONFIG.MAX_VIEWS) + 1,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      authorId: `user-${
        Math.floor(Math.random() * SAMPLE_DATA_CONFIG.MAX_AUTHORS) + 1
      }`,
      authorName: `관리자${
        Math.floor(Math.random() * SAMPLE_DATA_CONFIG.MAX_AUTHORS) + 1
      }`,
      isPublished,
      publishedAt: isPublished ? createdAt.toISOString() : undefined,
    });
  }

  return announcements;
};

/**
 * 샘플 제목을 생성합니다
 */
const generateSampleTitle = (index: number): string => {
  const titles = [
    "중요한 공지사항입니다",
    "시스템 점검 안내",
    "새로운 기능 업데이트",
    "이벤트 안내",
    "서비스 이용 수칙",
    "개인정보 처리방침 변경",
    "정기 점검 일정",
    "고객센터 운영시간 변경",
  ];

  const baseTitle = titles[index % titles.length];
  return `${baseTitle} - ${index}번째 공지사항입니다.`;
};

/**
 * 샘플 내용을 생성합니다
 */
const generateSampleContent = (index: number): string => {
  return `공지사항 ${index}번의 상세 내용입니다. 중요한 안내사항이 포함되어 있으니 반드시 확인해주시기 바랍니다.`;
};

/**
 * 공지사항 필터링을 수행합니다
 * @param announcements 필터링할 공지사항 배열
 * @param filters 적용할 필터
 * @returns 필터링된 공지사항 배열
 */
export const filterAnnouncements = (
  announcements: Announcement[],
  filters: AnnouncementFilters
): Announcement[] => {
  return announcements.filter((announcement) => {
    // 검색어 필터링
    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      const titleMatch = announcement.title.toLowerCase().includes(searchTerm);
      const contentMatch = announcement.content
        .toLowerCase()
        .includes(searchTerm);
      if (!titleMatch && !contentMatch) return false;
    }

    // 게시 상태 필터링
    if (filters.isPublished !== undefined) {
      if (announcement.isPublished !== filters.isPublished) return false;
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

    return true;
  });
};

/**
 * 공지사항 배열에 번호를 추가합니다
 * @param announcements 번호를 추가할 공지사항 배열
 * @param currentPage 현재 페이지 번호
 * @param pageSize 페이지당 아이템 수
 * @returns 번호가 추가된 공지사항 배열
 */
export const addNumberToAnnouncements = (
  announcements: Announcement[],
  currentPage: number,
  pageSize: number
): AnnouncementWithNo[] => {
  if (currentPage < 1 || pageSize < 1) {
    throw new Error("currentPage와 pageSize는 1 이상이어야 합니다.");
  }

  return announcements.map((announcement, index) => ({
    ...announcement,
    no: (currentPage - 1) * pageSize + index + 1,
  }));
};

/**
 * 빈 템플릿 공지사항을 생성합니다
 * @returns 빈 공지사항 객체
 */
export const createEmptyAnnouncementTemplate = (): Announcement => {
  return {
    id: "",
    title: "",
    content: "",
    views: 0,
    createdAt: "",
    updatedAt: "",
    authorId: "",
    authorName: "",
    isPublished: false,
    publishedAt: undefined,
  };
};

/**
 * 테이블 패딩을 위한 빈 행들을 생성합니다
 * @param currentDataLength 현재 데이터 길이
 * @param pageSize 페이지 크기
 * @returns 빈 행들의 배열
 */
export const createEmptyRows = (
  currentDataLength: number,
  pageSize: number
): AnnouncementWithNo[] => {
  if (currentDataLength < 0 || pageSize < 1) {
    return [];
  }

  const emptyRowsCount = Math.max(0, pageSize - currentDataLength);
  return Array.from({ length: emptyRowsCount }, (_, index) => ({
    ...createEmptyAnnouncementTemplate(),
    id: `empty-${index}`,
    no: currentDataLength + index + 1,
  }));
};

/**
 * 행이 빈 행인지 확인합니다
 * @param record 확인할 레코드
 * @returns 빈 행 여부
 */
export const isEmptyRow = (record: AnnouncementWithNo): boolean => {
  return record.id.startsWith("empty-");
};

/**
 * 유효한 공지사항인지 확인합니다 (빈 행 제외)
 * @param announcement 확인할 공지사항
 * @returns 유효성 여부
 */
export const isValidAnnouncement = (
  announcement: AnnouncementWithNo
): boolean => {
  return !isEmptyRow(announcement) && announcement.id.trim() !== "";
};
