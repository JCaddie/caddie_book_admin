"use client";

import React, { useState, useEffect } from "react";

// 컬럼 정의 인터페이스
interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number; // px 고정값
  flex?: boolean; // flex 1로 설정할지 여부
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

// 선택 가능한 데이터 테이블 Props 인터페이스
interface SelectableDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  maxHeight?: number | string;
  emptyText?: string;
  layout?: "fixed" | "flexible"; // 레이아웃 모드
  containerWidth?: number | "auto"; // 컨테이너 너비
  // 선택 기능 관련
  selectable?: boolean; // 선택 기능 활성화 여부
  selectedRowKeys?: string[]; // 선택된 행의 키 배열
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string); // 각 행의 고유 키
  getRowKey?: (record: T) => string; // 행 키 추출 함수
  // 빈 상태 관련
  realDataCount?: number; // 실제 데이터 개수 (빈 행 제외)
}

// 빈 행 체크 함수
const isEmptyRow = (record: unknown): boolean => {
  return (record as { isEmpty?: boolean })?.isEmpty === true;
};

function SelectableDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onRowClick,
  className,
  maxHeight = "auto",
  emptyText = "데이터가 없습니다",
  layout = "flexible",
  containerWidth = "auto",
  selectable = false,
  selectedRowKeys = [],
  onSelectChange,
  rowKey = "id",
  getRowKey,
  realDataCount,
}: SelectableDataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(
    []
  );

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

  // 선택된 키 관리
  const currentSelectedKeys =
    selectedRowKeys.length > 0 ? selectedRowKeys : internalSelectedKeys;

  useEffect(() => {
    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys([]);
    }
  }, [selectedRowKeys]);

  // 빈 행이 아닌 실제 데이터만 필터링
  const realData = data.filter((record) => !isEmptyRow(record));

  // 테이블 너비 계산
  const calculateContainerWidth = () => {
    if (containerWidth === "auto") {
      if (layout === "fixed") {
        // 선택 컬럼 너비 추가
        const checkboxWidth = selectable ? 60 : 0;
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

  const tableContainerWidth = calculateContainerWidth();

  // 컬럼 스타일 계산
  const getColumnStyle = (column: Column<T>, isCheckboxColumn = false) => {
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

  // 셀 렌더링
  const renderCell = (record: T, column: Column<T>, rowIndex: number) => {
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

  // 개별 행 선택/해제
  const handleRowSelect = (record: T, checked: boolean) => {
    const key = extractRowKey(record);
    let newSelectedKeys: string[];

    if (checked) {
      newSelectedKeys = [...currentSelectedKeys, key];
    } else {
      newSelectedKeys = currentSelectedKeys.filter((k) => k !== key);
    }

    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    const selectedRows = realData.filter((item) =>
      newSelectedKeys.includes(extractRowKey(item))
    );

    onSelectChange?.(newSelectedKeys, selectedRows);
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    let newSelectedKeys: string[];

    if (checked) {
      newSelectedKeys = realData.map((record) => extractRowKey(record));
    } else {
      newSelectedKeys = [];
    }

    if (selectedRowKeys.length === 0) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    const selectedRows = checked ? [...realData] : [];
    onSelectChange?.(newSelectedKeys, selectedRows);
  };

  // 전체 선택 상태 계산 (빈 행 제외)
  const isAllSelected =
    realData.length > 0 && currentSelectedKeys.length === realData.length;
  const isIndeterminate =
    currentSelectedKeys.length > 0 &&
    currentSelectedKeys.length < realData.length;

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
      {/* 헤더 */}
      <div style={{ backgroundColor: "#F7F7F7" }}>
        <div
          className={[
            "flex items-stretch min-h-[40px] px-4 py-2",
            layout === "flexible" ? "justify-between gap-8" : "gap-4",
          ].join(" ")}
        >
          {/* 체크박스 컬럼 헤더 */}
          {selectable && (
            <div
              className="flex items-center justify-center"
              style={getColumnStyle({} as Column<T>, true)}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
            </div>
          )}

          {/* 일반 컬럼 헤더들 */}
          {columns.map((column, index) => (
            <div
              key={`header-${index}`}
              className="flex items-center justify-center"
              style={getColumnStyle(column)}
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

      {/* 데이터 영역 */}
      <div className="w-full">
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500">{emptyText}</span>
          </div>
        ) : (
            realDataCount !== undefined
              ? realDataCount === 0
              : realData.length === 0
          ) ? (
          // 실제 데이터가 없는 경우 (모든 행이 빈 행인 경우)
          <div
            className="flex items-center justify-center bg-white rounded-md"
            style={{ height: "40px" }}
          >
            <span
              className="text-center font-medium"
              style={{
                fontSize: "13px",
                color: "#AEAAAA",
                lineHeight: "1.85",
              }}
            >
              검색된 결과가 없습니다.
            </span>
          </div>
        ) : (
          data.map((record, rowIndex) => {
            const isEmpty = isEmptyRow(record);
            const rowKey = extractRowKey(record);
            const isSelected = currentSelectedKeys.includes(rowKey);

            return (
              <div
                key={rowKey}
                className={[
                  "flex items-stretch min-h-[40px] px-4 py-2 transition-colors",
                  layout === "flexible" ? "justify-between gap-8" : "gap-4",
                  !isEmpty && onRowClick
                    ? "hover:bg-primary-50 cursor-pointer"
                    : "",
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
                  if (!isEmpty && onRowClick && !selectable) {
                    onRowClick?.(record, rowIndex);
                  }
                }}
              >
                {/* 체크박스 컬럼 */}
                {selectable && (
                  <div
                    className="flex items-center justify-center"
                    style={getColumnStyle({} as Column<T>, true)}
                  >
                    {!isEmpty && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(record, e.target.checked);
                        }}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                    )}
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
                    style={getColumnStyle(column)}
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
                      {renderCell(record, column, rowIndex)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SelectableDataTable;
