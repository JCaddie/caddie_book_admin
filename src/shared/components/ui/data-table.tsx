"use client";

import React from "react";

// 컬럼 정의 인터페이스
interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number | "auto"; // number는 px 고정값, "auto"는 flex 1
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  fixed?: boolean; // 고정 너비 여부
}

// 데이터 테이블 Props 인터페이스
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  maxHeight?: number | string;
  emptyText?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onRowClick,
  className,
  maxHeight = "auto",
  emptyText = "데이터가 없습니다",
}: DataTableProps<T>) {
  // 컬럼 스타일 계산
  const getColumnStyle = (column: Column<T>) => {
    if (typeof column.width === "number") {
      return { width: `${column.width}px`, flexShrink: 0 };
    }
    return { flex: 1, minWidth: 0 };
  };

  // 셀 값 추출
  const getCellValue = (record: T, column: Column<T>) => {
    if (typeof column.key === "string" && column.key.includes(".")) {
      // nested property 지원 (예: "user.name") - 타입 안전성을 위해 간단히 처리
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

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-md border">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={["overflow-hidden rounded-md", className]
        .filter(Boolean)
        .join(" ")}
      style={{ maxHeight }}
    >
      {/* 헤더 - Figma 스펙: #F7F7F7 */}
      <div style={{ backgroundColor: "#F7F7F7" }}>
        <div className="flex items-stretch gap-8 px-4 py-2 min-h-[40px]">
          {columns.map((column, index) => (
            <div
              key={`header-${index}`}
              className="flex items-center justify-center px-2"
              style={getColumnStyle(column)}
            >
              <span
                className="text-center truncate"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                {column.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 영역 */}
      <div
        className="overflow-y-auto"
        style={{
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        }}
      >
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500">{emptyText}</span>
          </div>
        ) : (
          data.map((record, rowIndex) => (
            <div
              key={rowIndex}
              className={[
                "flex items-stretch gap-8 px-4 py-2 min-h-[40px] transition-colors",
                onRowClick ? "hover:bg-primary-50 cursor-pointer" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                // Figma 스펙: 홀수/짝수 행 색상 (zebra stripe)
                backgroundColor: rowIndex % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
              }}
              onClick={() => onRowClick?.(record, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={[
                    "flex items-center px-2",
                    column.align === "left"
                      ? "justify-start"
                      : column.align === "right"
                      ? "justify-end"
                      : "justify-center",
                  ].join(" ")}
                  style={getColumnStyle(column)}
                >
                  <div
                    className="w-full text-center"
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "rgba(0, 0, 0, 0.8)",
                      lineHeight: "1.6",
                    }}
                  >
                    {renderCell(record, column, rowIndex)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DataTable;
