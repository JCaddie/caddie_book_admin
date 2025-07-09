import { Announcement, AnnouncementFilters } from "../types";

// 샘플 공지사항 생성 함수
export const generateSampleAnnouncements = (count: number): Announcement[] => {
  const announcements: Announcement[] = [];

  for (let i = 1; i <= count; i++) {
    const isPublished = Math.random() > 0.3; // 70% 확률로 게시됨
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const updatedAt = new Date(
      createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
    );

    announcements.push({
      id: `announcement-${i}`,
      title: `공지사항 제목 ${i}번입니다. 중요한 안내사항이 있습니다.`,
      content: `공지사항 내용 ${i}번입니다. 자세한 내용은 다음과 같습니다...`,
      views: Math.floor(Math.random() * 5000) + 1,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      authorId: `user-${Math.floor(Math.random() * 10) + 1}`,
      authorName: `관리자${Math.floor(Math.random() * 10) + 1}`,
      isPublished,
      publishedAt: isPublished ? createdAt.toISOString() : undefined,
    });
  }

  return announcements;
};

// 공지사항 필터링 함수
export const filterAnnouncements = (
  announcements: Announcement[],
  filters: AnnouncementFilters
): Announcement[] => {
  return announcements.filter((announcement) => {
    // 검색어 필터링
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
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

    // 날짜 필터링
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

// 빈 공지사항 템플릿 생성 함수
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

// 번호 추가 함수
export const addNumberToAnnouncements = (
  announcements: Announcement[],
  currentPage: number,
  pageSize: number
): (Announcement & { no: number })[] => {
  return announcements.map((announcement, index) => ({
    ...announcement,
    no: (currentPage - 1) * pageSize + index + 1,
  }));
};
