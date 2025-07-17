import React from "react";
import { DataTable, Pagination } from "@/shared/components/ui";

interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  flex?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

interface TableWithPaginationProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  totalPages: number;
  onRowClick?: (record: T, index: number) => void;
  layout?: "fixed" | "flexible";
  maxHeight?: number | string;
  className?: string;
}

function TableWithPagination<T extends Record<string, unknown>>({
  columns,
  data,
  totalPages,
  onRowClick,
  layout = "flexible",
  maxHeight,
  className,
}: TableWithPaginationProps<T>) {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      <DataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        layout={layout}
        maxHeight={maxHeight}
      />

      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default TableWithPagination;
