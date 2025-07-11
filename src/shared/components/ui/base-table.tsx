"use client";

import React, { useMemo } from "react";
import { BaseTableProps, Column } from "@/shared/types/table";

// 빈 행 체크 함수
export const isEmptyRow = (record: unknown): boolean => {
  return (record as { isEmpty?: boolean })?.isEmpty === true;
};

// 데이터 패딩 함수 (빈 행 추가)
const createPaddedData = <T extends Record<string, unknown>>(
  data: T[],
  itemsPerPage: number = 20
): T[] => {
  if (data.length >= itemsPerPage) {
    return data;
  }

  const emptyRowsCount = itemsPerPage - data.length;
  const emptyRows = Array.from(
    { length: emptyRowsCount },
    (_, index) =>
      ({
        id: `empty-${index}`,
        isEmpty: true,
      } as unknown as T)
  );

  return [...data, ...emptyRows];
};

// 테이블 유틸리티 함수들
export const createTableUtils = <T extends Record<string, unknown>>(
  rowKey: keyof T | ((record: T) => string) = "id",
  getRowKey?: (record: T) => string
) => {
  // 행 키 추출 함수
  const extractRowKey = (record: T): string => {
    if (getRowKey) {
      return getRowKey(record);
    }
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return String(record[rowKey]);
  };

  // 테이블 너비 계산
  const calculateContainerWidth = (
    containerWidth: number | "auto",
    layout: "fixed" | "flexible",
    columns: Column<T>[],
    hasCheckbox = false
  ): number | string => {
    if (containerWidth === "auto") {
      if (layout === "fixed") {
        const checkboxWidth = hasCheckbox ? 60 : 0;
        const totalWidth = columns.reduce((sum, col) => {
          return sum + (col.width || 120);
        }, checkboxWidth);
        return Math.max(totalWidth, 600);
      } else {
        return "100%";
      }
    }
    return containerWidth;
  };

  // 컬럼 스타일 계산
  const getColumnStyle = (
    column: Column<T>,
    layout: "fixed" | "flexible",
    isCheckboxColumn = false
  ): React.CSSProperties => {
    if (layout === "fixed") {
      const width = isCheckboxColumn ? 60 : column.width || 120;
      return { width: `${width}px`, flexShrink: 0 };
    } else {
      if (isCheckboxColumn) {
        return { width: "60px", flexShrink: 0 };
      }
      if (column.width) {
        return { width: `${column.width}px`, flexShrink: 0 };
      }
      return { flex: 1, minWidth: "80px" };
    }
  };

  // 셀 값 추출
  const getCellValue = (record: T, column: Column<T>) => {
    if (typeof column.key === "string" && column.key.includes(".")) {
      try {
        const keys = column.key.split(".");
        let result: unknown = record;
        for (const key of keys) {
          result = (result as Record<string, unknown>)?.[key];
        }
        return result;
      } catch {
        return undefined;
      }
    }
    return record[column.key as keyof T];
  };

  return {
    extractRowKey,
    calculateContainerWidth,
    getColumnStyle,
    getCellValue,
  };
};

// 셀 렌더링 함수
export const renderCell = <T extends Record<string, unknown>>(
  record: T,
  column: Column<T>,
  rowIndex: number,
  getCellValue: (record: T, column: Column<T>) => unknown
) => {
  if (isEmptyRow(record)) {
    return <span className="block">&nbsp;</span>;
  }

  const value = getCellValue(record, column);

  if (column.render) {
    return column.render(value, record, rowIndex);
  }

  return (
    <span className="truncate block" title={String(value || "")}>
      {String(value || "")}
    </span>
  );
};

// 기본 테이블 헤더 컴포넌트
export const TableHeader = <T extends Record<string, unknown>>({
  columns,
  layout,
  getColumnStyle,
  hasCheckbox = false,
  checkboxElement,
}: {
  columns: Column<T>[];
  layout: "fixed" | "flexible";
  getColumnStyle: (
    column: Column<T>,
    layout: "fixed" | "flexible",
    isCheckboxColumn?: boolean
  ) => React.CSSProperties;
  hasCheckbox?: boolean;
  checkboxElement?: React.ReactNode;
}) => (
  <div style={{ backgroundColor: "#F7F7F7" }}>
    <div
      className={[
        "flex items-stretch max-h-[40px] px-4 py-2",
        layout === "flexible" ? "justify-between gap-8" : "gap-4",
      ].join(" ")}
    >
      {/* 체크박스 컬럼 헤더 */}
      {hasCheckbox && (
        <div
          className="flex items-center justify-center"
          style={getColumnStyle({} as Column<T>, layout, true)}
          onClick={(e) => e.stopPropagation()}
        >
          {checkboxElement}
        </div>
      )}

      {/* 일반 컬럼 헤더들 */}
      {columns.map((column, index) => (
        <div
          key={`header-${index}`}
          className="flex items-center justify-center"
          style={getColumnStyle(column, layout)}
        >
          <span
            className="text-center truncate font-bold"
            style={{
              fontSize: "13px",
              color: "rgba(0, 0, 0, 0.6)",
              lineHeight: "1.85",
            }}
          >
            {column.title}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// 기본 테이블 행 컴포넌트
export const TableRow = <T extends Record<string, unknown>>({
  record,
  rowIndex,
  columns,
  layout,
  getColumnStyle,
  getCellValue,
  extractRowKey,
  onRowClick,
  hasCheckbox = false,
  checkboxElement,
  isSelected = false,
}: {
  record: T;
  rowIndex: number;
  columns: Column<T>[];
  layout: "fixed" | "flexible";
  getColumnStyle: (
    column: Column<T>,
    layout: "fixed" | "flexible",
    isCheckboxColumn?: boolean
  ) => React.CSSProperties;
  getCellValue: (record: T, column: Column<T>) => unknown;
  extractRowKey: (record: T) => string;
  onRowClick?: (record: T, index: number) => void;
  hasCheckbox?: boolean;
  checkboxElement?: React.ReactNode;
  isSelected?: boolean;
}) => {
  const isEmpty = isEmptyRow(record);
  const rowKey = extractRowKey(record);

  return (
    <div
      key={rowKey}
      className={[
        "flex items-stretch max-h-[40px] px-4 py-2 transition-colors",
        layout === "flexible" ? "justify-between gap-8" : "gap-4",
        !isEmpty && onRowClick ? "hover:bg-primary-50 cursor-pointer" : "",
        isSelected ? "bg-blue-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: isSelected
          ? "#EBF8FF"
          : rowIndex % 2 === 0
          ? "#FFFFFF"
          : "#FAFAFA",
      }}
      onClick={() => {
        if (!isEmpty && onRowClick) {
          onRowClick?.(record, rowIndex);
        }
      }}
    >
      {/* 체크박스 컬럼 */}
      {hasCheckbox && (
        <div
          className="flex items-center justify-center"
          style={getColumnStyle({} as Column<T>, layout, true)}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEmpty && checkboxElement}
        </div>
      )}

      {/* 일반 컬럼들 */}
      {columns.map((column, colIndex) => (
        <div
          key={`cell-${rowIndex}-${colIndex}`}
          className={[
            "flex items-center",
            column.align === "left"
              ? "justify-start"
              : column.align === "right"
              ? "justify-end"
              : "justify-center",
          ].join(" ")}
          style={getColumnStyle(column, layout)}
        >
          <div
            className={[
              "w-full",
              column.align === "left"
                ? "text-left"
                : column.align === "right"
                ? "text-right"
                : "text-center",
            ].join(" ")}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.8)",
              lineHeight: "1.85",
            }}
          >
            {renderCell(record, column, rowIndex, getCellValue)}
          </div>
        </div>
      ))}
    </div>
  );
};

// 베이스 테이블 컴포넌트
function BaseTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onRowClick,
  className,
  maxHeight = "auto",
  emptyText = "데이터가 없습니다",
  layout = "flexible",
  containerWidth = "auto",
  rowKey = "id",
  getRowKey,
  itemsPerPage = 20,
  children,
}: BaseTableProps<T> & {
  children: (props: {
    tableContainerWidth: number | string;
    utils: ReturnType<typeof createTableUtils<T>>;
    TableHeader: React.ComponentType<{
      columns: Column<T>[];
      layout: "fixed" | "flexible";
      getColumnStyle: (
        column: Column<T>,
        layout: "fixed" | "flexible",
        isCheckboxColumn?: boolean
      ) => React.CSSProperties;
      hasCheckbox?: boolean;
      checkboxElement?: React.ReactNode;
    }>;
    TableRow: React.ComponentType<{
      record: T;
      rowIndex: number;
      columns: Column<T>[];
      layout: "fixed" | "flexible";
      getColumnStyle: (
        column: Column<T>,
        layout: "fixed" | "flexible",
        isCheckboxColumn?: boolean
      ) => React.CSSProperties;
      getCellValue: (record: T, column: Column<T>) => unknown;
      extractRowKey: (record: T) => string;
      onRowClick?: (record: T, index: number) => void;
      hasCheckbox?: boolean;
      checkboxElement?: React.ReactNode;
      isSelected?: boolean;
    }>;
    data: T[];
    emptyText: string;
  }) => React.ReactNode;
}) {
  const utils = createTableUtils(rowKey, getRowKey);
  const tableContainerWidth = utils.calculateContainerWidth(
    containerWidth,
    layout,
    columns,
    false
  );

  // 데이터 패딩 처리
  const paddedData = useMemo(() => {
    return createPaddedData(data, itemsPerPage);
  }, [data, itemsPerPage]);

  // 로딩 상태
  if (loading) {
    return (
      <div
        className="bg-white rounded-md border border-gray-200"
        style={{
          width:
            typeof tableContainerWidth === "number"
              ? `${tableContainerWidth}px`
              : tableContainerWidth,
        }}
      >
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-md border border-gray-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width:
          typeof tableContainerWidth === "number"
            ? `${tableContainerWidth}px`
            : tableContainerWidth,
        maxHeight,
      }}
    >
      {children({
        tableContainerWidth,
        utils,
        TableHeader,
        TableRow,
        data: paddedData,
        emptyText,
      })}
    </div>
  );
}

export default BaseTable;
