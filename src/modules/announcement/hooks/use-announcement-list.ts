import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Announcement,
  AnnouncementFilters,
  AnnouncementSelection,
} from "../types";
import { usePagination } from "@/shared/hooks";
import { simulateApiDelay } from "@/shared/lib/data-utils";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";

// 번호가 추가된 공지사항 타입
type AnnouncementWithNo = Announcement & { no: number };

// 샘플 공지사항 생성 함수
const generateSampleAnnouncements = (count: number): Announcement[] => {
  const announcements: Announcement[] = [];

  for (let i = 1; i <= count; i++) {
    const isPublished = Math.random() > 0.3;
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const updatedAt = new Date(
      createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
    );

    announcements.push({
      id: `announcement-${i}`,
      title: `공지사항 제목입니다. 공지사항 제목입니다. 공지사항 제목입니다. 공지사항 제목입니다. ${i}`,
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
const filterAnnouncements = (
  announcements: Announcement[],
  filters: AnnouncementFilters
): Announcement[] => {
  return announcements.filter((announcement) => {
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const titleMatch = announcement.title.toLowerCase().includes(searchTerm);
      const contentMatch = announcement.content
        .toLowerCase()
        .includes(searchTerm);
      if (!titleMatch && !contentMatch) return false;
    }

    if (filters.isPublished !== undefined) {
      if (announcement.isPublished !== filters.isPublished) return false;
    }

    return true;
  });
};

// 번호 추가 함수
const addNumberToAnnouncements = (
  announcements: Announcement[],
  currentPage: number,
  pageSize: number
): AnnouncementWithNo[] => {
  return announcements.map((announcement, index) => ({
    ...announcement,
    no: (currentPage - 1) * pageSize + index + 1,
  }));
};

// 빈 행 생성 함수
const createEmptyRows = (
  currentDataLength: number,
  pageSize: number
): AnnouncementWithNo[] => {
  const emptyRowsCount = Math.max(0, pageSize - currentDataLength);
  return Array.from({ length: emptyRowsCount }, (_, index) => ({
    id: `empty-${index}`,
    title: "",
    content: "",
    views: 0,
    createdAt: "",
    updatedAt: "",
    authorId: "",
    authorName: "",
    isPublished: false,
    publishedAt: undefined,
    no: currentDataLength + index + 1,
  }));
};

export const useAnnouncementList = () => {
  const searchParams = useSearchParams();

  // 필터 상태
  const [filters, setFilters] = useState<AnnouncementFilters>({
    searchTerm: "",
    isPublished: undefined,
  });

  // 선택 상태
  const [selection, setSelection] = useState<AnnouncementSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 로딩 및 에러 상태
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 검색 파라미터로부터 초기 검색어 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: decodeURIComponent(searchParam),
      }));
    }
  }, [searchParams]);

  // 샘플 데이터 생성 (메모이제이션)
  const allAnnouncements = useMemo(() => generateSampleAnnouncements(26), []);

  // 필터링된 데이터 (메모이제이션)
  const filteredAnnouncements = useMemo(() => {
    return filterAnnouncements(allAnnouncements, filters);
  }, [allAnnouncements, filters]);

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredAnnouncements,
      itemsPerPage: ANNOUNCEMENT_CONSTANTS.PAGE_SIZE,
    });

  // 번호가 추가된 현재 페이지 데이터
  const currentDataWithNo = useMemo(() => {
    return addNumberToAnnouncements(
      currentData,
      currentPage,
      ANNOUNCEMENT_CONSTANTS.PAGE_SIZE
    );
  }, [currentData, currentPage]);

  // 빈 행이 추가된 데이터 (메모이제이션)
  const paddedData = useMemo(() => {
    const emptyRows = createEmptyRows(
      currentDataWithNo.length,
      ANNOUNCEMENT_CONSTANTS.PAGE_SIZE
    );
    return [...currentDataWithNo, ...emptyRows];
  }, [currentDataWithNo]);

  // 필터 업데이트 함수들 (useCallback으로 최적화)
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const updateIsPublished = useCallback((isPublished: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, isPublished }));
  }, []);

  // 선택 관련 함수들 (useCallback으로 최적화)
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Announcement[]) => {
      setSelection({ selectedRowKeys, selectedRows });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  }, []);

  // 선택된 공지사항 삭제 (useCallback으로 최적화)
  const deleteSelectedAnnouncements = useCallback(async () => {
    if (selection.selectedRows.length === 0) return;

    setIsDeleting(true);
    setError(null);

    try {
      // API 호출 시뮬레이션
      await simulateApiDelay(1000);

      // TODO: 실제 삭제 API 호출
      console.log("삭제할 공지사항들:", selection.selectedRows);

      // 성공 후 선택 상태 초기화
      clearSelection();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "공지사항 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("공지사항 삭제 중 오류 발생:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [selection.selectedRows, clearSelection]);

  // 새 공지사항 생성
  const createNewAnnouncement = useCallback(
    (
      announcementData: Omit<
        Announcement,
        "id" | "createdAt" | "updatedAt" | "views" | "authorId" | "authorName"
      >
    ) => {
      // TODO: 실제 생성 API 호출
      console.log("새 공지사항 생성:", announcementData);
    },
    []
  );

  return {
    // 데이터
    data: paddedData,
    totalCount: filteredAnnouncements.length,
    realDataCount: currentData.length,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 필터
    filters,
    updateSearchTerm,
    updateIsPublished,

    // 선택
    selection,
    updateSelection,
    clearSelection,

    // 액션
    deleteSelectedAnnouncements,
    createNewAnnouncement,

    // 상태
    isDeleting,
    error,
  };
};
