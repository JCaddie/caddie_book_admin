import { useCallback, useState } from "react";
import type { Announcement, AnnouncementSelection } from "../types";

/**
 * 공지사항 선택 관리 훅
 * 테이블 행 선택 상태를 관리합니다.
 */
export const useAnnouncementSelection = () => {
  const [selection, setSelection] = useState<AnnouncementSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 선택 상태 업데이트
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Announcement[]) => {
      setSelection({
        selectedRowKeys,
        selectedRows,
      });
    },
    []
  );

  // 전체 선택
  const selectAll = useCallback(
    (announcements: Announcement[]) => {
      const allIds = announcements.map((item) => item.id);
      updateSelection(allIds, announcements);
    },
    [updateSelection]
  );

  // 전체 선택 해제
  const clearSelection = useCallback(() => {
    updateSelection([], []);
  }, [updateSelection]);

  // 단일 항목 선택/해제 토글
  const toggleSelection = useCallback(
    (announcement: Announcement) => {
      const isSelected = selection.selectedRowKeys.includes(announcement.id);

      if (isSelected) {
        // 선택 해제
        const newSelectedRowKeys = selection.selectedRowKeys.filter(
          (id) => id !== announcement.id
        );
        const newSelectedRows = selection.selectedRows.filter(
          (row) => row.id !== announcement.id
        );
        updateSelection(newSelectedRowKeys, newSelectedRows);
      } else {
        // 선택 추가
        const newSelectedRowKeys = [
          ...selection.selectedRowKeys,
          announcement.id,
        ];
        const newSelectedRows = [...selection.selectedRows, announcement];
        updateSelection(newSelectedRowKeys, newSelectedRows);
      }
    },
    [selection, updateSelection]
  );

  // 선택된 항목이 있는지 확인
  const hasSelection = selection.selectedRowKeys.length > 0;

  // 특정 항목이 선택되었는지 확인
  const isSelected = useCallback(
    (id: string) => selection.selectedRowKeys.includes(id),
    [selection.selectedRowKeys]
  );

  // 전체 선택 상태 확인
  const isAllSelected = useCallback(
    (announcements: Announcement[]) => {
      if (announcements.length === 0) return false;
      return announcements.every((item) =>
        selection.selectedRowKeys.includes(item.id)
      );
    },
    [selection.selectedRowKeys]
  );

  // 부분 선택 상태 확인 (일부만 선택된 상태)
  const isIndeterminate = useCallback(
    (announcements: Announcement[]) => {
      const selectedCount = announcements.filter((item) =>
        selection.selectedRowKeys.includes(item.id)
      ).length;
      return selectedCount > 0 && selectedCount < announcements.length;
    },
    [selection.selectedRowKeys]
  );

  return {
    // 상태
    selection,
    hasSelection,
    selectedCount: selection.selectedRowKeys.length,

    // 업데이트 함수들
    updateSelection,
    selectAll,
    clearSelection,
    toggleSelection,

    // 확인 함수들
    isSelected,
    isAllSelected,
    isIndeterminate,
  };
};
