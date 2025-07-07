"use client";

import React from "react";

// 컬럼 정의 인터페이스
interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number; // px 고정값
  flex?: boolean; // flex 1로 설정할지 여부
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
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
  layout?: "fixed" | "flexible"; // 레이아웃 모드
  containerWidth?: number | "auto"; // 컨테이너 너비
}

// 빈 행 체크 함수
const isEmptyRow = (record: unknown): boolean => {
  return (record as { isEmpty?: boolean })?.isEmpty === true;
};

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onRowClick,
  className,
  maxHeight = "auto",
  emptyText = "데이터가 없습니다",
  layout = "flexible",
  containerWidth = "auto",
}: DataTableProps<T>) {
  // 테이블 너비 계산
  const calculateContainerWidth = () => {
    if (containerWidth === "auto") {
      if (layout === "fixed") {
        // 고정 레이아웃: 컬럼들의 지정된 너비 합계
        const totalWidth = columns.reduce((sum, col) => {
          return sum + (col.width || 120); // 기본 120px
        }, 0);
        return Math.max(totalWidth, 600); // 최소 600px
      } else {
        // 유연한 레이아웃: 컨테이너에 맞춤
        return "100%";
      }
    }
    return containerWidth;
  };

  const tableContainerWidth = calculateContainerWidth();

  // 컬럼 스타일 계산
  const getColumnStyle = (column: Column<T>) => {
    if (layout === "fixed") {
      // 고정 레이아웃: 지정된 너비 사용
      const width = column.width || 120;
      return { width: `${width}px`, flexShrink: 0 };
    } else {
      // 유연한 레이아웃: flex 기반
      if (column.width) {
        return { width: `${column.width}px`, flexShrink: 0 };
      }
      return { flex: 1, minWidth: "80px" };
    }
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
    // 빈 행인 경우 빈 내용 반환
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
      {/* 헤더 - Figma 스펙: #F7F7F7 */}
      <div style={{ backgroundColor: "#F7F7F7" }}>
        <div
          className={[
            "flex items-stretch min-h-[40px] px-4 py-2",
            layout === "flexible" ? "justify-between gap-8" : "gap-4",
          ].join(" ")}
        >
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
          data.map((record, rowIndex) => {
            const isEmpty = isEmptyRow(record);

            return (
              <div
                key={rowIndex}
                className={[
                  "flex items-stretch min-h-[40px] px-4 py-2 transition-colors",
                  layout === "flexible" ? "justify-between gap-8" : "gap-4",
                  // 빈 행이 아니고 클릭 이벤트가 있는 경우에만 hover 효과
                  !isEmpty && onRowClick
                    ? "hover:bg-primary-50 cursor-pointer"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  // Figma 스펙: 홀수/짝수 행 색상 (zebra stripe)
                  backgroundColor: rowIndex % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                }}
                onClick={() => {
                  // 빈 행이 아닌 경우에만 클릭 이벤트 실행
                  if (!isEmpty) {
                    onRowClick?.(record, rowIndex);
                  }
                }}
              >
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

export default DataTable;
