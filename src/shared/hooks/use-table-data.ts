"use client";

import { useMemo } from "react";

export interface TableItem extends Record<string, unknown> {
  id: string;
  isEmpty?: boolean;
}

interface UseTableDataProps<T extends TableItem> {
  data: T[];
  itemsPerPage: number;
  emptyRowTemplate: Omit<T, "id" | "isEmpty">;
}

interface UseTableDataReturn<T extends TableItem> {
  paddedData: T[];
}

export function useTableData<T extends TableItem>({
  data,
  itemsPerPage,
  emptyRowTemplate,
}: UseTableDataProps<T>): UseTableDataReturn<T> {
  const paddedData = useMemo(() => {
    const result: T[] = [...data];
    const emptyRowsCount = itemsPerPage - data.length;

    // 빈 행 추가
    for (let i = 0; i < emptyRowsCount; i++) {
      result.push({
        ...emptyRowTemplate,
        id: `empty-${i}`,
        isEmpty: true,
      } as T);
    }

    return result;
  }, [data, itemsPerPage, emptyRowTemplate]);

  return {
    paddedData,
  };
}

// 빈 행 렌더링을 위한 유틸리티 함수
export function createEmptyRowRenderer<T extends TableItem>(
  renderContent: (value: unknown, record: T, index: number) => React.ReactNode
) {
  return (value: unknown, record: T, index: number): React.ReactNode => {
    if (record.isEmpty) return null;
    return renderContent(value, record, index);
  };
}

// 기본 렌더러
export function defaultCellRenderer<T extends TableItem>(
  value: unknown,
  record: T
): React.ReactNode {
  if (record.isEmpty) return null;
  return String(value || "");
}
