"use client";

import React from "react";
import BaseTable from "./base-table";
import { BaseTableProps } from "@/shared/types/table";

// 데이터 테이블 Props 인터페이스 (호환성 유지)
type DataTableProps<T> = BaseTableProps<T>;

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
  rowKey = "id",
  getRowKey,
}: DataTableProps<T>) {
  return (
    <BaseTable
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={onRowClick}
      className={className}
      maxHeight={maxHeight}
      emptyText={emptyText}
      layout={layout}
      containerWidth={containerWidth}
      rowKey={rowKey}
      getRowKey={getRowKey}
    >
      {({
        utils,
        TableHeader,
        TableRow,
        data: tableData,
        emptyText: tableEmptyText,
      }) => (
        <>
          {/* 헤더 */}
          <TableHeader
            columns={columns}
            layout={layout}
            getColumnStyle={utils.getColumnStyle}
            hasCheckbox={false}
          />

          {/* 데이터 영역 */}
          <div className="w-full">
            {tableData.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <span className="text-gray-500">{tableEmptyText}</span>
              </div>
            ) : (
              tableData.map((record, rowIndex) => (
                <TableRow
                  key={utils.extractRowKey(record)}
                  record={record}
                  rowIndex={rowIndex}
                  columns={columns}
                  layout={layout}
                  getColumnStyle={utils.getColumnStyle}
                  getCellValue={utils.getCellValue}
                  extractRowKey={utils.extractRowKey}
                  onRowClick={onRowClick}
                  hasCheckbox={false}
                />
              ))
            )}
          </div>
        </>
      )}
    </BaseTable>
  );
}

export default DataTable;
