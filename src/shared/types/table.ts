import React from "react";

// ================================
// 테이블 기본 구조 타입
// ================================

// 컬럼 정의 인터페이스
export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number; // px 고정값
  flex?: boolean; // flex 1로 설정할지 여부
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

// ================================
// 테이블 Props 타입
// ================================

// 기본 테이블 Props 인터페이스
export interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  maxHeight?: number | string;
  emptyText?: string;
  layout?: "fixed" | "flexible"; // 레이아웃 모드
  containerWidth?: number | "auto"; // 컨테이너 너비
  rowKey?: keyof T | ((record: T) => string); // 각 행의 고유 키
  getRowKey?: (record: T) => string; // 행 키 추출 함수
}

// 선택 가능한 테이블 Props 인터페이스
export interface SelectableTableProps<T> extends BaseTableProps<T> {
  selectable?: boolean; // 선택 기능 활성화 여부
  selectedRowKeys?: string[]; // 선택된 행의 키 배열
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  realDataCount?: number; // 실제 데이터 개수 (빈 행 제외)
}

// ================================
// 테이블 선택 기능 타입
// ================================

// 선택 상태 관리 타입 (제네릭으로 개선)
export interface SelectionState<T = unknown> {
  selectedRowKeys: string[];
  selectedRows: T[];
}

// 선택 기능 Hook 반환 타입
export interface UseTableSelectionReturn<T> {
  selectedRowKeys: string[];
  selectedRows: T[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleRowSelect: (record: T, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  clearSelection: () => void;
}

// ================================
// 테이블 유틸리티 타입
// ================================

// 테이블 공통 유틸리티 타입
export interface TableUtilityProps<T = Record<string, unknown>> {
  extractRowKey: (record: T) => string;
  isEmptyRow: (record: unknown) => boolean;
  calculateContainerWidth: (
    containerWidth: number | "auto",
    layout: "fixed" | "flexible",
    columns: Column<T>[],
    hasCheckbox?: boolean
  ) => number | string;
  getColumnStyle: (
    column: Column<T>,
    layout: "fixed" | "flexible",
    isCheckboxColumn?: boolean
  ) => React.CSSProperties;
}
