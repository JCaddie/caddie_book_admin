"use client";

import React from "react";
import BaseTable from "./base-table";
import { BaseTableProps } from "@/shared/types/table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";

// 선택 가능한 테이블 Props 인터페이스
interface SelectableTableProps<T> extends BaseTableProps<T> {
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  realDataCount?: number; // 실제 데이터 개수 (빈 행 제외)
}

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
  rowKey = "id",
  getRowKey,
  selectable = false,
  selectedRowKeys = [],
  onSelectChange,
  realDataCount,
  itemsPerPage = 20,
}: SelectableTableProps<T>) {
  // 테이블 선택 로직
  const selection = useTableSelection({
    data,
    extractRowKey: getRowKey
      ? (record) => String(getRowKey(record))
      : (record) => String(record[rowKey as keyof T]),
    selectedRowKeys,
    onSelectChange,
  });

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
      itemsPerPage={itemsPerPage}
    >
      {({
        utils,
        TableHeader,
        TableRow,
        data: tableData,
        emptyText: tableEmptyText,
      }) => {
        // 빈 행이 아닌 실제 데이터 필터링
        const realData = tableData.filter(
          (record) => !(record as { isEmpty?: boolean })?.isEmpty
        );

        // 전체 선택 체크박스 엘리먼트
        const selectAllCheckbox = selectable ? (
          <input
            type="checkbox"
            checked={selection.isAllSelected}
            ref={(input) => {
              if (input) input.indeterminate = selection.isIndeterminate;
            }}
            onChange={(e) => {
              e.stopPropagation();
              selection.handleSelectAll(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
        ) : undefined;

        return (
          <>
            {/* 헤더 */}
            <TableHeader
              columns={columns}
              layout={layout}
              getColumnStyle={utils.getColumnStyle}
              hasCheckbox={selectable}
              checkboxElement={selectAllCheckbox}
            />

            {/* 데이터 영역 */}
            <div className="w-full">
              {tableData.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <span className="text-gray-500">{tableEmptyText}</span>
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
                tableData.map((record, rowIndex) => {
                  const isEmpty = (record as { isEmpty?: boolean })?.isEmpty;
                  const rowKey = utils.extractRowKey(record);
                  const isSelected = selection.selectedRowKeys.includes(rowKey);

                  // 개별 행 체크박스 엘리먼트
                  const rowCheckbox =
                    selectable && !isEmpty ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          selection.handleRowSelect(record, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                    ) : undefined;

                  return (
                    <TableRow
                      key={rowKey}
                      record={record}
                      rowIndex={rowIndex}
                      columns={columns}
                      layout={layout}
                      getColumnStyle={utils.getColumnStyle}
                      getCellValue={utils.getCellValue}
                      extractRowKey={utils.extractRowKey}
                      onRowClick={onRowClick}
                      hasCheckbox={selectable}
                      checkboxElement={rowCheckbox}
                      isSelected={isSelected}
                    />
                  );
                })
              )}
            </div>
          </>
        );
      }}
    </BaseTable>
  );
}

export default SelectableDataTable;
