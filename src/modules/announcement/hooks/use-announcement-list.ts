import { useCallback } from "react";
import type { AnnouncementWithNo } from "../types";
import { useAnnouncementData } from "./use-announcement-data";
import { useAnnouncementFilters } from "./use-announcement-filters";
import { useAnnouncementSelection } from "./use-announcement-selection";
import { useAnnouncementActions } from "./use-announcement-actions";
import { isValidAnnouncement } from "../utils";

/**
 * 공지사항 목록 종합 관리 훅
 * 분리된 책임별 훅들을 조합하여 기존 인터페이스를 유지합니다.
 *
 * @description
 * 이 훅은 다음과 같은 책임들을 조합합니다:
 * - 데이터 조회 (useAnnouncementData)
 * - 필터 및 URL 관리 (useAnnouncementFilters)
 * - 선택 상태 관리 (useAnnouncementSelection)
 * - CRUD 액션 관리 (useAnnouncementActions)
 */
export const useAnnouncementList = () => {
  // 필터 및 URL 파라미터 관리
  const {
    filters,
    currentPage,
    updateSearchTerm,
    updateIsPublished,
    updateFilters,
    handlePageChange,
  } = useAnnouncementFilters();

  // 데이터 조회
  const {
    data,
    totalCount,
    totalPages,
    realDataCount,
    isLoading,
    error: dataError,
    refetch,
  } = useAnnouncementData(filters, currentPage);

  // 선택 상태 관리
  const {
    selection,
    updateSelection: baseUpdateSelection,
    clearSelection,
  } = useAnnouncementSelection();

  // CRUD 액션 관리
  const {
    createAnnouncement,
    deleteSelectedAnnouncements: baseDeleteSelected,
    error: actionError,
    clearError: clearActionError,
    isDeleting,
  } = useAnnouncementActions();

  // 선택 상태 업데이트 (유효성 검사 포함)
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: AnnouncementWithNo[]) => {
      // 유효한 행만 선택에 포함
      const validSelectedRows = selectedRows.filter(isValidAnnouncement);
      const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

      baseUpdateSelection(validSelectedRowKeys, validSelectedRows);
    },
    [baseUpdateSelection]
  );

  // 선택된 공지사항 삭제 (선택 해제 포함)
  const deleteSelectedAnnouncements = useCallback(async () => {
    if (selection.selectedRowKeys.length === 0) return;

    try {
      await baseDeleteSelected(selection.selectedRowKeys);
      clearSelection(); // 삭제 성공 시 선택 해제
    } catch (error) {
      // 에러는 useAnnouncementActions에서 관리됨
      console.error("선택된 공지사항 삭제 실패:", error);
    }
  }, [selection.selectedRowKeys, baseDeleteSelected, clearSelection]);

  // 새 공지사항 생성
  const createNewAnnouncement = useCallback(
    async (data: Parameters<typeof createAnnouncement>[0]) => {
      return createAnnouncement(data);
    },
    [createAnnouncement]
  );

  // 통합 에러 관리
  const error = dataError || actionError;
  const clearError = useCallback(() => {
    if (actionError) {
      clearActionError();
    }
    // 데이터 에러는 refetch로 해결
  }, [actionError, clearActionError]);

  return {
    // 데이터
    data,
    totalCount,
    realDataCount,

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
    isLoading,
    isDeleting,
    error,
    clearError,

    // 유틸리티
    refetch,
  };
};
