import { useState, useMemo, useCallback } from "react";
import {
  Announcement,
  AnnouncementFilters,
  AnnouncementSelection,
  AnnouncementWithNo,
  CreateAnnouncementData,
} from "../types";
import { usePagination } from "@/shared/hooks";
import { simulateApiDelay } from "@/shared/lib/data-utils";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import {
  generateSampleAnnouncements,
  filterAnnouncements,
  addNumberToAnnouncements,
  createEmptyRows,
  isValidAnnouncement,
} from "../utils";
import { useAnnouncementError } from "./use-announcement-error";
import { useAnnouncementUrlParams } from "./use-announcement-url-params";

interface UseAnnouncementListReturn {
  // 데이터
  data: AnnouncementWithNo[];
  totalCount: number;
  realDataCount: number;

  // 페이지네이션
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;

  // 필터
  filters: AnnouncementFilters;
  updateSearchTerm: (searchTerm: string) => void;
  updateIsPublished: (isPublished: boolean | undefined) => void;
  updateFilters: (filters: Partial<AnnouncementFilters>) => void;

  // 선택
  selection: AnnouncementSelection;
  updateSelection: (
    selectedRowKeys: string[],
    selectedRows: Announcement[]
  ) => void;
  clearSelection: () => void;

  // 액션
  deleteSelectedAnnouncements: () => Promise<void>;
  createNewAnnouncement: (data: CreateAnnouncementData) => Promise<void>;

  // 상태
  isDeleting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * 공지사항 리스트 관리를 위한 커스텀 훅
 */
export const useAnnouncementList = (): UseAnnouncementListReturn => {
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

  // 로딩 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 에러 관리
  const { error, handleApiError, clearError } = useAnnouncementError();

  // 필터 업데이트 함수
  const updateFilters = useCallback(
    (newFilters: Partial<AnnouncementFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  // URL 파라미터 처리
  useAnnouncementUrlParams({ onFiltersChange: updateFilters });

  // 샘플 데이터 생성 (메모이제이션)
  const allAnnouncements = useMemo(() => {
    return generateSampleAnnouncements(26);
  }, []);

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

  // 필터 업데이트 함수들
  const updateSearchTerm = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm });
    },
    [updateFilters]
  );

  const updateIsPublished = useCallback(
    (isPublished: boolean | undefined) => {
      updateFilters({ isPublished });
    },
    [updateFilters]
  );

  // 선택 관련 함수들
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Announcement[]) => {
      // 유효한 행만 선택되도록 필터링
      const validRows = selectedRows.filter((row) => {
        // AnnouncementWithNo 타입으로 캐스팅해서 유효성 검사
        const rowWithNo = row as AnnouncementWithNo;
        return isValidAnnouncement(rowWithNo);
      });
      const validKeys = validRows.map((row) => row.id);

      setSelection({ selectedRowKeys: validKeys, selectedRows: validRows });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  }, []);

  // 선택된 공지사항 삭제
  const deleteSelectedAnnouncements = useCallback(async () => {
    if (selection.selectedRows.length === 0) return;

    setIsDeleting(true);

    try {
      // API 호출 시뮬레이션
      await simulateApiDelay(1000);

      // TODO: 실제 삭제 API 호출
      console.log("삭제할 공지사항들:", selection.selectedRows);

      // 성공 후 선택 상태 초기화
      clearSelection();
    } catch (err) {
      handleApiError(err, "DELETE_FAILED");
    } finally {
      setIsDeleting(false);
    }
  }, [selection.selectedRows, clearSelection, handleApiError]);

  // 새 공지사항 생성
  const createNewAnnouncement = useCallback(
    async (announcementData: CreateAnnouncementData) => {
      try {
        // API 호출 시뮬레이션
        await simulateApiDelay(1000);

        // TODO: 실제 생성 API 호출
        console.log("새 공지사항 생성:", announcementData);
      } catch (err) {
        handleApiError(err, "CREATE_FAILED");
      }
    },
    [handleApiError]
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
    updateFilters,

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
    clearError,
  };
};
